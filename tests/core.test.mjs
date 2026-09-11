import test from "node:test";
import { existsSync, readFileSync } from "node:fs";
import assert from "node:assert/strict";
import { localSearch } from "../src/lib/catalog-search.ts";
import { parseRss, getMarketData, getLiveNews } from "../src/lib/live-data.ts";
import { isRateLimited } from "../src/lib/rate-limit.ts";
import { getProductDetails, products, shops, productPrice, rateMovement } from "../src/lib/data.ts";
import { acceptClinicRequest } from "../src/lib/clinic.ts";

test("local catalog search finds supplied photo designs without inventing prices", () => {
  const result = localSearch("floral statement ring under Rs 15,000");
  assert.equal(result.productIds[0], "p11");
  assert.equal(productPrice(products[10]), "Ask for price");
});

test("RSS parser preserves source links and strips markup", () => {
  const [item] = parseRss(`
    <rss><channel><item>
      <title><![CDATA[Gold &amp; craft]]></title>
      <link>https://example.com/story</link>
      <pubDate>Mon, 24 Aug 2026 12:00:00 +0000</pubDate>
      <category><![CDATA[Markets]]></category>
      <description><![CDATA[<p>A sourced jewellery story.</p> The post Gold appeared first on Example.]]></description>
    </item></channel></rss>
  `, "Example");

  assert.equal(item.title, "Gold & craft");
  assert.equal(item.summary, "A sourced jewellery story.");
  assert.equal(item.url, "https://example.com/story");
});

test("rate limiter resets after its window", () => {
  assert.equal(isRateLimited("test", 2, 1_000, 0), false);
  assert.equal(isRateLimited("test", 2, 1_000, 1), false);
  assert.equal(isRateLimited("test", 2, 1_000, 2), true);
  assert.equal(isRateLimited("test", 2, 1_000, 1_001), false);
});

test("every catalog product exposes usable jewellery specifications", () => {
  for (const product of products) {
    const details = getProductDetails(product);
    assert.ok(details.purity && details.weight && details.sku);
  }
});

test("accepting a clinic request assigns one jeweller and raises a ticket", () => {
  const [accepted] = acceptClinicRequest([{
    id: "request-1234",
    customerName: "Customer",
    contact: "9800000000",
    message: "Please check this ring",
    createdAt: "2026-08-30T10:00:00.000Z",
    status: "open",
  }], "request-1234", "aabhushan", "2026-08-30T10:05:00.000Z");

  assert.equal(accepted.status, "accepted");
  assert.equal(accepted.assignedShopId, "aabhushan");
  assert.match(accepted.ticketId, /^JHN-260830-/);
});


test("the five named shops each have eleven distinct local collection photos", () => {
  assert.deepEqual(shops.map((s) => s.name.en), ["Aabhushan Crafts", "Guna Jyasha Pasa", "Guheswori Ornaments Workshop", "Siddhi Binayak Jewellers", "Dakshinkali Ornaments"]);
  const photoProducts = products.filter(p => !p.collection);
  assert.equal(photoProducts.length, 55);
  assert.equal(new Set(photoProducts.map((p) => p.image)).size, 55);
  for (const shop of shops) assert.equal(photoProducts.filter((p) => p.shopId === shop.id).length, 11);
  for (const product of products) {
    assert.ok(shops.some((s) => s.id === product.shopId));
    assert.ok(existsSync(new URL(`../public${product.image}`, import.meta.url)));
  }
  const homepage = readFileSync(new URL("../src/app/(marketplace)/page.tsx", import.meta.url), "utf8");
  assert.match(homepage, /<Categories preview/);
  for (const route of ["shops", "products", "know-your-jewellery", "rates", "news", "connect"]) assert.ok(existsSync(new URL(`../src/app/(marketplace)/${route}/page.tsx`, import.meta.url)));
});


test("live feeds have cancellation signals so a stalled publisher cannot block pages indefinitely", async (t) => {
  let requests = 0;
  t.mock.method(globalThis, "fetch", async (_url, options) => {
    assert.ok(options.signal instanceof AbortSignal);
    requests++;
    return new Response(JSON.stringify([]), { status: 200 });
  });
  assert.deepEqual(await getMarketData(), []);
  assert.deepEqual(await getLiveNews(), []);
  assert.equal(requests, 4);
});

test("rate arrows distinguish increases, decreases, unchanged and missing records", () => {
  assert.equal(rateMovement(305400, 304000), "up");
  assert.equal(rateMovement(4790, 4800), "down");
  assert.equal(rateMovement(4790, 4790), "unchanged");
  assert.equal(rateMovement(4790, 0), "unknown");
  assert.equal(rateMovement(4790, NaN), "unknown");
});

test("catalogue follow-ups retain the shop and type, while newer types replace older ones", () => {
  const first = localSearch("floral styles", "en", ["rings from Aabhushan Crafts"]);
  assert.ok(first.productIds.length);
  assert.ok(first.productIds.every(id => products.find(p => p.id === id).shopId === "aabhushan"));
  assert.ok(first.productIds.every(id => products.find(p => p.id === id).category === "rings"));
  const changed = localSearch("necklaces instead", "en", ["rings from Aabhushan Crafts", "floral styles"]);
  assert.ok(changed.productIds.length);
  assert.ok(changed.productIds.every(id => products.find(p => p.id === id).category === "necklaces"));
  assert.ok(changed.productIds.every(id => products.find(p => p.id === id).shopId === "aabhushan"));
  const reference = localSearch("Tell me about the second one", "en", ["rings"], first.productIds);
  assert.deepEqual(reference.productIds, [first.productIds[1]]);
  assert.match(reference.message, /price, weight and purity/);
});


test("silver and diamond searches return relevant sample collections in both languages", () => {
  for (const [query, collection] of [["silver", "silver"], ["diamond", "diamond"], ["चाँदी", "silver"], ["हीरा", "diamond"]]) {
    const result = localSearch(query);
    assert.equal(result.productIds.length, 5);
    assert.ok(result.productIds.every(id => products.find(p => p.id === id).collection === collection));
  }
  const rings = localSearch("silver rings");
  assert.equal(rings.productIds.length, 2);
  const changed = localSearch("diamond instead", "en", ["silver rings"]);
  assert.equal(changed.productIds.length, 2);
  assert.ok(changed.productIds.every(id => {
    const p = products.find(p => p.id === id);
    return p.collection === "diamond" && p.category === "rings";
  }));
  assert.equal(new Set(products.map(p => p.id)).size, products.length);
});
