/** Pitch catalogue. Images supplied by the project owner, allocated evenly as sample collections.
 * Shop contacts are placeholders; prices, materials and availability await shop confirmation.
 * Original filenames are recorded in public/images/jewellery/manifest.json.
 */

export type L = { en: string; np: string };

export type Shop = {
  id: string;
  name: L;
  city: L;
  specialty: L;
  blurb: L;
  whatsapp: string; // international format, no +
  image: string;
  verified: boolean;
};

export type Product = {
  id: string;
  title: L;
  shopId: string;
  priceMin: number;
  priceMax?: number;
  metal: "Gold" | "925 Silver" | "Gold Plated" | "Rose Gold" | "To confirm";
  category: "rings" | "earrings" | "necklaces" | "bracelets" | "chains" | "sets";
  occasion: L;
  image: string;
};

export type ProductDetails = {
  type: string;
  purity: string;
  karat: string;
  weight: string;
  stone: string;
  stoneWeight: string;
  finish: string;
  sku: string;
  description: L;
};

export type Category = {
  id: string;
  name: L;
  glyph: string;
  count: number;
};

export type MarketAsset = {
  id: string;
  label: L;
  price: number;
  previousPrice: number;
  direction: "rising" | "cooling" | "steady";
  delta: number;
  spark: number[];
  updatedAt: string;
};

export type LiveNewsItem = {
  id: string;
  title: string;
  source: string;
  date: string;
  summary: string;
  tag: string;
  url: string;
};

export const categories: Category[] = [
  { id: "rings", name: { en: "Rings", np: "औंठी" }, glyph: "◎", count: 3 },
  { id: "earrings", name: { en: "Earrings", np: "झुम्का" }, glyph: "✧", count: 8 },
  { id: "necklaces", name: { en: "Necklaces", np: "माला" }, glyph: "⌒", count: 29 },
  { id: "bracelets", name: { en: "Bracelets", np: "ब्रेसलेट" }, glyph: "◍", count: 2 },
  { id: "sets", name: { en: "Bridal Sets", np: "बुटी सेट" }, glyph: "❖", count: 13 },
];


export const shops: Shop[] = [
  {"id": "aabhushan", "name": {"en": "Aabhushan Crafts", "np": "आभूषण क्राफ्ट्स"}, "city": {"en": "Nepal", "np": "नेपाल"}, "specialty": {"en": "Jewellery collection", "np": "गहनाको सङ्ग्रह"}, "blurb": {"en": "Explore the sample collection and ask about the designs you love.", "np": "नमुना सङ्ग्रह हेर्नुहोस् र मनपर्ने डिजाइनबारे सोध्नुहोस्।"}, "whatsapp": "9779800000005", "image": "/images/jewellery/aabhushan/p11.jpeg", "verified": true},
  {"id": "guna-jyasha-pasa", "name": {"en": "Guna Jyasha Pasa", "np": "गुण ज्याशा पसः"}, "city": {"en": "Nepal", "np": "नेपाल"}, "specialty": {"en": "Jewellery collection", "np": "गहनाको सङ्ग्रह"}, "blurb": {"en": "Explore the sample collection and ask about the designs you love.", "np": "नमुना सङ्ग्रह हेर्नुहोस् र मनपर्ने डिजाइनबारे सोध्नुहोस्।"}, "whatsapp": "9779800000001", "image": "/images/jewellery/guna-jyasha-pasa/p22.jpeg", "verified": true},
  {"id": "guheswori-ornaments-workshop", "name": {"en": "Guheswori Ornaments Workshop", "np": "गुह्येश्वरी अर्नामेन्ट्स वर्कशप"}, "city": {"en": "Nepal", "np": "नेपाल"}, "specialty": {"en": "Jewellery collection", "np": "गहनाको सङ्ग्रह"}, "blurb": {"en": "Explore the sample collection and ask about the designs you love.", "np": "नमुना सङ्ग्रह हेर्नुहोस् र मनपर्ने डिजाइनबारे सोध्नुहोस्।"}, "whatsapp": "9779800000002", "image": "/images/jewellery/guheswori-ornaments-workshop/p28.jpeg", "verified": true},
  {"id": "siddhi-binayak-jewellers", "name": {"en": "Siddhi Binayak Jewellers", "np": "सिद्धि विनायक ज्वेलर्स"}, "city": {"en": "Nepal", "np": "नेपाल"}, "specialty": {"en": "Jewellery collection", "np": "गहनाको सङ्ग्रह"}, "blurb": {"en": "Explore the sample collection and ask about the designs you love.", "np": "नमुना सङ्ग्रह हेर्नुहोस् र मनपर्ने डिजाइनबारे सोध्नुहोस्।"}, "whatsapp": "9779800000003", "image": "/images/jewellery/siddhi-binayak-jewellers/p24.jpeg", "verified": true},
  {"id": "dakshinkali-ornaments", "name": {"en": "Dakshinkali Ornaments", "np": "दक्षिणकाली अर्नामेन्ट्स"}, "city": {"en": "Nepal", "np": "नेपाल"}, "specialty": {"en": "Jewellery collection", "np": "गहनाको सङ्ग्रह"}, "blurb": {"en": "Explore the sample collection and ask about the designs you love.", "np": "नमुना सङ्ग्रह हेर्नुहोस् र मनपर्ने डिजाइनबारे सोध्नुहोस्।"}, "whatsapp": "9779800000004", "image": "/images/jewellery/dakshinkali-ornaments/p45.jpeg", "verified": true},
];

export const products: Product[] = [
  {"id": "p1", "title": {"en": "Medallion Beaded Choker", "np": "मेडालियन पोते चोकर"}, "shopId": "aabhushan", "priceMin": 0, "metal": "To confirm", "category": "necklaces", "occasion": {"en": "Occasion wear", "np": "विशेष अवसर"}, "image": "/images/jewellery/aabhushan/p1.jpeg"},
  {"id": "p2", "title": {"en": "Red Stone Drop Earrings", "np": "रातो पत्थरका झुम्का"}, "shopId": "guna-jyasha-pasa", "priceMin": 0, "metal": "To confirm", "category": "earrings", "occasion": {"en": "Occasion wear", "np": "विशेष अवसर"}, "image": "/images/jewellery/guna-jyasha-pasa/p2.jpeg"},
  {"id": "p3", "title": {"en": "Floral Necklace", "np": "फूल बुट्टाको माला"}, "shopId": "guheswori-ornaments-workshop", "priceMin": 0, "metal": "To confirm", "category": "necklaces", "occasion": {"en": "Occasion wear", "np": "विशेष अवसर"}, "image": "/images/jewellery/guheswori-ornaments-workshop/p3.jpeg"},
  {"id": "p4", "title": {"en": "Statement Pendant Set", "np": "ठूलो लोकेट सेट"}, "shopId": "siddhi-binayak-jewellers", "priceMin": 0, "metal": "To confirm", "category": "sets", "occasion": {"en": "Occasion wear", "np": "विशेष अवसर"}, "image": "/images/jewellery/siddhi-binayak-jewellers/p4.jpeg"},
  {"id": "p5", "title": {"en": "Layered Choker", "np": "तहदार चोकर"}, "shopId": "dakshinkali-ornaments", "priceMin": 0, "metal": "To confirm", "category": "necklaces", "occasion": {"en": "Occasion wear", "np": "विशेष अवसर"}, "image": "/images/jewellery/dakshinkali-ornaments/p5.jpeg"},
  {"id": "p6", "title": {"en": "Teardrop Beaded Pendant", "np": "थोपा आकारको पोते लोकेट"}, "shopId": "aabhushan", "priceMin": 0, "metal": "To confirm", "category": "necklaces", "occasion": {"en": "Occasion wear", "np": "विशेष अवसर"}, "image": "/images/jewellery/aabhushan/p6.jpeg"},
  {"id": "p7", "title": {"en": "Textured Collar Necklace", "np": "बुट्टेदार कण्ठहार"}, "shopId": "guna-jyasha-pasa", "priceMin": 0, "metal": "To confirm", "category": "necklaces", "occasion": {"en": "Occasion wear", "np": "विशेष अवसर"}, "image": "/images/jewellery/guna-jyasha-pasa/p7.jpeg"},
  {"id": "p8", "title": {"en": "Temple Pendant Necklace", "np": "मन्दिर लोकेट माला"}, "shopId": "guheswori-ornaments-workshop", "priceMin": 0, "metal": "To confirm", "category": "necklaces", "occasion": {"en": "Occasion wear", "np": "विशेष अवसर"}, "image": "/images/jewellery/guheswori-ornaments-workshop/p8.jpeg"},
  {"id": "p9", "title": {"en": "Ornate Bridal Set", "np": "बुट्टेदार दुलही सेट"}, "shopId": "siddhi-binayak-jewellers", "priceMin": 0, "metal": "To confirm", "category": "sets", "occasion": {"en": "Occasion wear", "np": "विशेष अवसर"}, "image": "/images/jewellery/siddhi-binayak-jewellers/p9.jpeg"},
  {"id": "p10", "title": {"en": "Sculpted Bangle Pair", "np": "बुट्टेदार चुरा जोडी"}, "shopId": "dakshinkali-ornaments", "priceMin": 0, "metal": "To confirm", "category": "bracelets", "occasion": {"en": "Occasion wear", "np": "विशेष अवसर"}, "image": "/images/jewellery/dakshinkali-ornaments/p10.jpeg"},
  {"id": "p11", "title": {"en": "Floral Statement Ring", "np": "फूल बुट्टाको औंठी"}, "shopId": "aabhushan", "priceMin": 0, "metal": "To confirm", "category": "rings", "occasion": {"en": "Occasion wear", "np": "विशेष अवसर"}, "image": "/images/jewellery/aabhushan/p11.jpeg"},
  {"id": "p12", "title": {"en": "Tiered Jhumka Earrings", "np": "तहदार झुम्का"}, "shopId": "guna-jyasha-pasa", "priceMin": 0, "metal": "To confirm", "category": "earrings", "occasion": {"en": "Occasion wear", "np": "विशेष अवसर"}, "image": "/images/jewellery/guna-jyasha-pasa/p12.jpeg"},
  {"id": "p13", "title": {"en": "Floral Drop Jhumka", "np": "फूल बुट्टाका झुम्का"}, "shopId": "guheswori-ornaments-workshop", "priceMin": 0, "metal": "To confirm", "category": "earrings", "occasion": {"en": "Occasion wear", "np": "विशेष अवसर"}, "image": "/images/jewellery/guheswori-ornaments-workshop/p13.jpeg"},
  {"id": "p14", "title": {"en": "Medallion Beaded Mala", "np": "मेडालियन पोते माला"}, "shopId": "siddhi-binayak-jewellers", "priceMin": 0, "metal": "To confirm", "category": "necklaces", "occasion": {"en": "Occasion wear", "np": "विशेष अवसर"}, "image": "/images/jewellery/siddhi-binayak-jewellers/p14.jpeg"},
  {"id": "p15", "title": {"en": "Red Beaded Choker", "np": "रातो पोते चोकर"}, "shopId": "dakshinkali-ornaments", "priceMin": 0, "metal": "To confirm", "category": "necklaces", "occasion": {"en": "Occasion wear", "np": "विशेष अवसर"}, "image": "/images/jewellery/dakshinkali-ornaments/p15.jpeg"},
  {"id": "p16", "title": {"en": "Floral Occasion Necklace", "np": "उत्सवको फूल बुट्टे माला"}, "shopId": "aabhushan", "priceMin": 0, "metal": "To confirm", "category": "necklaces", "occasion": {"en": "Occasion wear", "np": "विशेष अवसर"}, "image": "/images/jewellery/aabhushan/p16.jpeg"},
  {"id": "p17", "title": {"en": "Ornate Bangle Pair", "np": "कलात्मक चुरा जोडी"}, "shopId": "guna-jyasha-pasa", "priceMin": 0, "metal": "To confirm", "category": "bracelets", "occasion": {"en": "Occasion wear", "np": "विशेष अवसर"}, "image": "/images/jewellery/guna-jyasha-pasa/p17.jpeg"},
  {"id": "p18", "title": {"en": "Floral Stud Earrings", "np": "फूल आकारका टप"}, "shopId": "guheswori-ornaments-workshop", "priceMin": 0, "metal": "To confirm", "category": "earrings", "occasion": {"en": "Occasion wear", "np": "विशेष अवसर"}, "image": "/images/jewellery/guheswori-ornaments-workshop/p18.jpeg"},
  {"id": "p19", "title": {"en": "Filigree Round Earrings", "np": "जालीदार गोलो टप"}, "shopId": "siddhi-binayak-jewellers", "priceMin": 0, "metal": "To confirm", "category": "earrings", "occasion": {"en": "Occasion wear", "np": "विशेष अवसर"}, "image": "/images/jewellery/siddhi-binayak-jewellers/p19.jpeg"},
  {"id": "p20", "title": {"en": "Teardrop Earrings", "np": "थोपा आकारका झुम्का"}, "shopId": "dakshinkali-ornaments", "priceMin": 0, "metal": "To confirm", "category": "earrings", "occasion": {"en": "Occasion wear", "np": "विशेष अवसर"}, "image": "/images/jewellery/dakshinkali-ornaments/p20.jpeg"},
  {"id": "p21", "title": {"en": "Scalloped Necklace Set", "np": "किनारेदार माला सेट"}, "shopId": "aabhushan", "priceMin": 0, "metal": "To confirm", "category": "sets", "occasion": {"en": "Occasion wear", "np": "विशेष अवसर"}, "image": "/images/jewellery/aabhushan/p21.jpeg"},
  {"id": "p22", "title": {"en": "Round Pendant Mala", "np": "गोलो लोकेट माला"}, "shopId": "guna-jyasha-pasa", "priceMin": 0, "metal": "To confirm", "category": "necklaces", "occasion": {"en": "Occasion wear", "np": "विशेष अवसर"}, "image": "/images/jewellery/guna-jyasha-pasa/p22.jpeg"},
  {"id": "p23", "title": {"en": "Petal Necklace Set", "np": "पत्र आकारको माला सेट"}, "shopId": "guheswori-ornaments-workshop", "priceMin": 0, "metal": "To confirm", "category": "sets", "occasion": {"en": "Occasion wear", "np": "विशेष अवसर"}, "image": "/images/jewellery/guheswori-ornaments-workshop/p23.jpeg"},
  {"id": "p24", "title": {"en": "Floral Bridal Necklace Set", "np": "फूल बुट्टाको दुलही सेट"}, "shopId": "siddhi-binayak-jewellers", "priceMin": 0, "metal": "To confirm", "category": "sets", "occasion": {"en": "Occasion wear", "np": "विशेष अवसर"}, "image": "/images/jewellery/siddhi-binayak-jewellers/p24.jpeg"},
  {"id": "p25", "title": {"en": "Traditional Collar Necklace", "np": "परम्परागत कण्ठहार"}, "shopId": "dakshinkali-ornaments", "priceMin": 0, "metal": "To confirm", "category": "necklaces", "occasion": {"en": "Occasion wear", "np": "विशेष अवसर"}, "image": "/images/jewellery/dakshinkali-ornaments/p25.jpeg"},
  {"id": "p26", "title": {"en": "Red Floral Necklace", "np": "रातो फूल बुट्टाको माला"}, "shopId": "aabhushan", "priceMin": 0, "metal": "To confirm", "category": "necklaces", "occasion": {"en": "Occasion wear", "np": "विशेष अवसर"}, "image": "/images/jewellery/aabhushan/p26.jpeg"},
  {"id": "p27", "title": {"en": "Boxed Occasion Set", "np": "उत्सवको गहना सेट"}, "shopId": "guna-jyasha-pasa", "priceMin": 0, "metal": "To confirm", "category": "sets", "occasion": {"en": "Occasion wear", "np": "विशेष अवसर"}, "image": "/images/jewellery/guna-jyasha-pasa/p27.jpeg"},
  {"id": "p28", "title": {"en": "V-shaped Necklace Set", "np": "भी आकारको माला सेट"}, "shopId": "guheswori-ornaments-workshop", "priceMin": 0, "metal": "To confirm", "category": "sets", "occasion": {"en": "Occasion wear", "np": "विशेष अवसर"}, "image": "/images/jewellery/guheswori-ornaments-workshop/p28.jpeg"},
  {"id": "p29", "title": {"en": "Beaded Choker Set", "np": "पोते चोकर सेट"}, "shopId": "siddhi-binayak-jewellers", "priceMin": 0, "metal": "To confirm", "category": "sets", "occasion": {"en": "Occasion wear", "np": "विशेष अवसर"}, "image": "/images/jewellery/siddhi-binayak-jewellers/p29.jpeg"},
  {"id": "p30", "title": {"en": "Long Pendant Set", "np": "लामो लोकेट सेट"}, "shopId": "dakshinkali-ornaments", "priceMin": 0, "metal": "To confirm", "category": "sets", "occasion": {"en": "Occasion wear", "np": "विशेष अवसर"}, "image": "/images/jewellery/dakshinkali-ornaments/p30.jpeg"},
  {"id": "p31", "title": {"en": "Fan Motif Necklace Set", "np": "पंखा बुट्टाको माला सेट"}, "shopId": "aabhushan", "priceMin": 0, "metal": "To confirm", "category": "sets", "occasion": {"en": "Occasion wear", "np": "विशेष अवसर"}, "image": "/images/jewellery/aabhushan/p31.jpeg"},
  {"id": "p32", "title": {"en": "Layered Long Mala", "np": "तहदार लामो माला"}, "shopId": "guna-jyasha-pasa", "priceMin": 0, "metal": "To confirm", "category": "necklaces", "occasion": {"en": "Occasion wear", "np": "विशेष अवसर"}, "image": "/images/jewellery/guna-jyasha-pasa/p32.jpeg"},
  {"id": "p33", "title": {"en": "Ceremonial Pendant Mala", "np": "समारोहको लोकेट माला"}, "shopId": "guheswori-ornaments-workshop", "priceMin": 0, "metal": "To confirm", "category": "necklaces", "occasion": {"en": "Occasion wear", "np": "विशेष अवसर"}, "image": "/images/jewellery/guheswori-ornaments-workshop/p33.jpeg"},
  {"id": "p34", "title": {"en": "Leaf Border Necklace", "np": "पात किनाराको माला"}, "shopId": "siddhi-binayak-jewellers", "priceMin": 0, "metal": "To confirm", "category": "necklaces", "occasion": {"en": "Occasion wear", "np": "विशेष अवसर"}, "image": "/images/jewellery/siddhi-binayak-jewellers/p34.jpeg"},
  {"id": "p35", "title": {"en": "Layered Celebration Set", "np": "तहदार उत्सव सेट"}, "shopId": "dakshinkali-ornaments", "priceMin": 0, "metal": "To confirm", "category": "sets", "occasion": {"en": "Occasion wear", "np": "विशेष अवसर"}, "image": "/images/jewellery/dakshinkali-ornaments/p35.jpeg"},
  {"id": "p36", "title": {"en": "Leaf Drop Necklace", "np": "पात बुट्टाको माला"}, "shopId": "aabhushan", "priceMin": 0, "metal": "To confirm", "category": "necklaces", "occasion": {"en": "Occasion wear", "np": "विशेष अवसर"}, "image": "/images/jewellery/aabhushan/p36.jpeg"},
  {"id": "p37", "title": {"en": "Delicate Beaded Necklace", "np": "साना दानाको माला"}, "shopId": "guna-jyasha-pasa", "priceMin": 0, "metal": "To confirm", "category": "necklaces", "occasion": {"en": "Occasion wear", "np": "विशेष अवसर"}, "image": "/images/jewellery/guna-jyasha-pasa/p37.jpeg"},
  {"id": "p38", "title": {"en": "Floral Drop Necklace", "np": "फूल बुट्टाको लोकेट माला"}, "shopId": "guheswori-ornaments-workshop", "priceMin": 0, "metal": "To confirm", "category": "necklaces", "occasion": {"en": "Occasion wear", "np": "विशेष अवसर"}, "image": "/images/jewellery/guheswori-ornaments-workshop/p38.jpeg"},
  {"id": "p39", "title": {"en": "Festive Collar Necklace", "np": "चाडपर्वको कण्ठहार"}, "shopId": "siddhi-binayak-jewellers", "priceMin": 0, "metal": "To confirm", "category": "necklaces", "occasion": {"en": "Occasion wear", "np": "विशेष अवसर"}, "image": "/images/jewellery/siddhi-binayak-jewellers/p39.jpeg"},
  {"id": "p40", "title": {"en": "Red Stone Stud Pair", "np": "रातो पत्थरका टप जोडी"}, "shopId": "dakshinkali-ornaments", "priceMin": 0, "metal": "To confirm", "category": "earrings", "occasion": {"en": "Occasion wear", "np": "विशेष अवसर"}, "image": "/images/jewellery/dakshinkali-ornaments/p40.jpeg"},
  {"id": "p41", "title": {"en": "Oval Red Stone Ring", "np": "अण्डाकार रातो पत्थरको औंठी"}, "shopId": "aabhushan", "priceMin": 0, "metal": "To confirm", "category": "rings", "occasion": {"en": "Occasion wear", "np": "विशेष अवसर"}, "image": "/images/jewellery/aabhushan/p41.jpeg"},
  {"id": "p42", "title": {"en": "Ornate Red Stone Ring", "np": "बुट्टेदार रातो पत्थरको औंठी"}, "shopId": "guna-jyasha-pasa", "priceMin": 0, "metal": "To confirm", "category": "rings", "occasion": {"en": "Occasion wear", "np": "विशेष अवसर"}, "image": "/images/jewellery/guna-jyasha-pasa/p42.jpeg"},
  {"id": "p43", "title": {"en": "Long Medallion Set", "np": "लामो मेडालियन सेट"}, "shopId": "guheswori-ornaments-workshop", "priceMin": 0, "metal": "To confirm", "category": "sets", "occasion": {"en": "Occasion wear", "np": "विशेष अवसर"}, "image": "/images/jewellery/guheswori-ornaments-workshop/p43.jpeg"},
  {"id": "p44", "title": {"en": "Geometric Necklace", "np": "ज्यामितीय बुट्टाको माला"}, "shopId": "siddhi-binayak-jewellers", "priceMin": 0, "metal": "To confirm", "category": "necklaces", "occasion": {"en": "Occasion wear", "np": "विशेष अवसर"}, "image": "/images/jewellery/siddhi-binayak-jewellers/p44.jpeg"},
  {"id": "p45", "title": {"en": "Fringed Necklace", "np": "झालरदार माला"}, "shopId": "dakshinkali-ornaments", "priceMin": 0, "metal": "To confirm", "category": "necklaces", "occasion": {"en": "Occasion wear", "np": "विशेष अवसर"}, "image": "/images/jewellery/dakshinkali-ornaments/p45.jpeg"},
  {"id": "p46", "title": {"en": "Teardrop Fringe Necklace", "np": "थोपा झालरको माला"}, "shopId": "aabhushan", "priceMin": 0, "metal": "To confirm", "category": "necklaces", "occasion": {"en": "Occasion wear", "np": "विशेष अवसर"}, "image": "/images/jewellery/aabhushan/p46.jpeg"},
  {"id": "p47", "title": {"en": "Scalloped Bridal Set", "np": "किनारेदार दुलही सेट"}, "shopId": "guna-jyasha-pasa", "priceMin": 0, "metal": "To confirm", "category": "sets", "occasion": {"en": "Occasion wear", "np": "विशेष अवसर"}, "image": "/images/jewellery/guna-jyasha-pasa/p47.jpeg"},
  {"id": "p48", "title": {"en": "Flower Pendant Necklace", "np": "फूल लोकेट माला"}, "shopId": "guheswori-ornaments-workshop", "priceMin": 0, "metal": "To confirm", "category": "necklaces", "occasion": {"en": "Occasion wear", "np": "विशेष अवसर"}, "image": "/images/jewellery/guheswori-ornaments-workshop/p48.jpeg"},
  {"id": "p49", "title": {"en": "Double Drop Necklace", "np": "दुई तहको लोकेट माला"}, "shopId": "siddhi-binayak-jewellers", "priceMin": 0, "metal": "To confirm", "category": "necklaces", "occasion": {"en": "Occasion wear", "np": "विशेष अवसर"}, "image": "/images/jewellery/siddhi-binayak-jewellers/p49.jpeg"},
  {"id": "p50", "title": {"en": "Star Motif Mala", "np": "तारा बुट्टाको माला"}, "shopId": "dakshinkali-ornaments", "priceMin": 0, "metal": "To confirm", "category": "necklaces", "occasion": {"en": "Occasion wear", "np": "विशेष अवसर"}, "image": "/images/jewellery/dakshinkali-ornaments/p50.jpeg"},
  {"id": "p51", "title": {"en": "Dainty Drop Necklace", "np": "सानो लोकेट माला"}, "shopId": "aabhushan", "priceMin": 0, "metal": "To confirm", "category": "necklaces", "occasion": {"en": "Occasion wear", "np": "विशेष अवसर"}, "image": "/images/jewellery/aabhushan/p51.jpeg"},
  {"id": "p52", "title": {"en": "Petal Drop Necklace", "np": "पत्र लोकेट माला"}, "shopId": "guna-jyasha-pasa", "priceMin": 0, "metal": "To confirm", "category": "necklaces", "occasion": {"en": "Occasion wear", "np": "विशेष अवसर"}, "image": "/images/jewellery/guna-jyasha-pasa/p52.jpeg"},
  {"id": "p53", "title": {"en": "Linked Floral Necklace", "np": "जोडिएको फूल बुट्टे माला"}, "shopId": "guheswori-ornaments-workshop", "priceMin": 0, "metal": "To confirm", "category": "necklaces", "occasion": {"en": "Occasion wear", "np": "विशेष अवसर"}, "image": "/images/jewellery/guheswori-ornaments-workshop/p53.jpeg"},
  {"id": "p54", "title": {"en": "Bell Jhumka Earrings", "np": "घण्टी आकारका झुम्का"}, "shopId": "siddhi-binayak-jewellers", "priceMin": 0, "metal": "To confirm", "category": "earrings", "occasion": {"en": "Occasion wear", "np": "विशेष अवसर"}, "image": "/images/jewellery/siddhi-binayak-jewellers/p54.jpeg"},
  {"id": "p55", "title": {"en": "Crescent Drop Necklace", "np": "चन्द्र आकारको लोकेट माला"}, "shopId": "dakshinkali-ornaments", "priceMin": 0, "metal": "To confirm", "category": "necklaces", "occasion": {"en": "Occasion wear", "np": "विशेष अवसर"}, "image": "/images/jewellery/dakshinkali-ornaments/p55.jpeg"},
];

export function waLink(number: string, message: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function formatPrice(npr: number): string {
  return `Rs ${npr.toLocaleString("en-IN")}`;
}

export function productPrice(product: Product, lang: "en" | "np" = "en"): string {
  if (!product.priceMin) return lang === "np" ? "मूल्य सोध्नुहोस्" : "Ask for price";
  return `${formatPrice(product.priceMin)}${product.priceMax ? ` – ${formatPrice(product.priceMax)}` : ""}`;
}

export function getProductDetails(product: Product): ProductDetails {
  return {
    type: product.category,
    purity: "To be confirmed / पुष्टि गर्न बाँकी",
    karat: "To be confirmed / पुष्टि गर्न बाँकी",
    weight: "To be confirmed / पुष्टि गर्न बाँकी",
    stone: "To be confirmed / पुष्टि गर्न बाँकी",
    stoneWeight: "To be confirmed / पुष्टि गर्न बाँकी",
    finish: "To be confirmed / पुष्टि गर्न बाँकी",
    sku: `JHN-${product.shopId.slice(0, 3).toUpperCase()}-${product.id.slice(1).padStart(3, "0")}`,
    description: {
      en: "A design from this sample collection. Ask the shop to confirm availability, materials and the full price.",
      np: "यो नमुना सङ्ग्रहको डिजाइन हो। उपलब्धता, सामग्री र पूरा मूल्य पसलसँग पुष्टि गर्नुहोस्।",
    },
  };
}

export function rateMovement(price: number, previous: number) {
  if (!Number.isFinite(price) || !Number.isFinite(previous) || price <= 0 || previous <= 0) return "unknown";
  return price > previous ? "up" : price < previous ? "down" : "unchanged";
}
