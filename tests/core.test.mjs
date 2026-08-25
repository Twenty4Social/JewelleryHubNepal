import test from "node:test";
import assert from "node:assert/strict";
import { localSearch } from "../src/lib/catalog-search.ts";
import { parseRss } from "../src/lib/live-data.ts";
import { isRateLimited } from "../src/lib/rate-limit.ts";

test("local catalog search respects product intent and budget", () => {
  const result = localSearch("925 silver bracelet for a wedding under Rs 15,000");
  assert.equal(result.productIds[0], "p18");
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
