/** Prototype catalog data. Replace these records with Supabase rows as shops onboard.
 *  Images: Unsplash (free to use under the Unsplash License).
 *  In production this comes from Supabase — see platform-blueprint.md.
 */

const u = (id: string, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

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
  foundingPartner?: boolean;
};

export type Product = {
  id: string;
  title: L;
  shopId: string;
  priceMin: number;
  priceMax?: number;
  metal: "Gold" | "925 Silver" | "Gold Plated" | "Rose Gold";
  category: "rings" | "earrings" | "necklaces" | "bracelets" | "chains" | "sets";
  occasion: L;
  image: string;
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
  { id: "earrings", name: { en: "Earrings", np: "झुम्का" }, glyph: "✧", count: 4 },
  { id: "necklaces", name: { en: "Necklaces", np: "माला" }, glyph: "⌒", count: 5 },
  { id: "bracelets", name: { en: "Bracelets", np: "ब्रेसलेट" }, glyph: "◍", count: 3 },
  { id: "chains", name: { en: "Chains", np: "चेन" }, glyph: "⛓", count: 1 },
  { id: "sets", name: { en: "Bridal Sets", np: "बुटी सेट" }, glyph: "❖", count: 2 },
];

export const shops: Shop[] = [
  {
    id: "aabhushan",
    name: { en: "Aabhushan Crafts", np: "आभूषण क्राफ्ट्स" },
    city: { en: "Patan", np: "पाटन" },
    specialty: { en: "Handcrafted Gold", np: "हस्तनिर्मित सुन" },
    blurb: {
      en: "A founding house for Newari-inspired bridal and made-to-order pieces.",
      np: "नेवारी शैलीका दुलही र अर्डरअनुसार बन्ने गहनाको संस्थापक घर।",
    },
    whatsapp: "9779800000005",
    image: u("photo-1599643478518-a784e5dc4c8f"),
    verified: true,
    foundingPartner: true,
  },
  {
    id: "kasturi",
    name: { en: "Kasturi Silver House", np: "कस्तुरी चाँदी घर" },
    city: { en: "Patan", np: "पाटन" },
    specialty: { en: "925 Silver", np: "९२५ चाँदी" },
    blurb: {
      en: "Handcrafted tennis chains, malachite rings & temple pendants.",
      np: "हस्तनिर्मित टेनिस चेन, मलाचाइट औंठी र मन्दिर लोकेट।",
    },
    whatsapp: "9779800000001",
    image: u("photo-1603561591411-07134e71a2a9"),
    verified: true,
  },
  {
    id: "himal",
    name: { en: "Himal Radiance Jewellers", np: "हिमाल रेडियन्स ज्वेलर्स" },
    city: { en: "New Road", np: "न्यूरोड" },
    specialty: { en: "Gold Plated", np: "गोल्ड प्लेटेड" },
    blurb: {
      en: "Festive sets, jhumkas & bridal edits at honest prices.",
      np: "चाडपर्वका सेट, झुम्का र इमानदार भाउका दुलही सेट।",
    },
    whatsapp: "9779800000002",
    image: u("photo-1611652022419-a9419f74343d"),
    verified: true,
  },
  {
    id: "newa",
    name: { en: "Newa Silpi Crafts", np: "नेवा शिल्प क्राफ्ट्स" },
    city: { en: "Bhaktapur", np: "भक्तपुर" },
    specialty: { en: "Heritage", np: "परम्परागत" },
    blurb: {
      en: "Traditional Newari makar & hasli work, made to order.",
      np: "परम्परागत नेवारी मकर र हसुली कला, अर्डरमा बन्ने।",
    },
    whatsapp: "9779800000003",
    image: u("photo-1515562141207-7a88fb7ce338"),
    verified: true,
  },
  {
    id: "malla",
    name: { en: "Malla Atelier", np: "मल्ल एटेलिये" },
    city: { en: "Thamel", np: "थमेल" },
    specialty: { en: "Contemporary", np: "आधुनिक" },
    blurb: {
      en: "Minimal everyday silver, engraved by hand.",
      np: "दैनिक लगाउने सानो चाँदी, हस्तले कुँदिएको।",
    },
    whatsapp: "9779800000004",
    image: u("photo-1617038260897-41a1f14a8ca0"),
    verified: true,
  },
  {
    id: "ratna",
    name: { en: "Ratna Shree Jewellers", np: "रत्न श्री ज्वेलर्स" },
    city: { en: "New Road", np: "न्यूरोड" },
    specialty: { en: "Gold & Gemstones", np: "सुन र रत्न" },
    blurb: {
      en: "Gem-set rings and celebration pieces with transparent specifications.",
      np: "स्पष्ट विवरणसहित रत्नजडित औंठी र उत्सवका गहना।",
    },
    whatsapp: "9779800000006",
    image: u("photo-1605100804763-247f67b3557e"),
    verified: true,
  },
  {
    id: "swayambhu",
    name: { en: "Swayambhu Ornament House", np: "स्वयम्भू आभूषण घर" },
    city: { en: "Kathmandu", np: "काठमाडौँ" },
    specialty: { en: "Bridal Gold", np: "दुलही सुन" },
    blurb: {
      en: "Rani haar, tilhari sets and groom's chains for Nepali ceremonies.",
      np: "नेपाली समारोहका लागि रानी हार, तिलहरी सेट र दुलहाको चेन।",
    },
    whatsapp: "9779800000007",
    image: u("photo-1573408301185-9146fe634ad0"),
    verified: true,
  },
  {
    id: "janaki",
    name: { en: "Janaki Mithila Jewels", np: "जानकी मिथिला ज्वेल्स" },
    city: { en: "Janakpur", np: "जनकपुर" },
    specialty: { en: "Mithila Heritage", np: "मिथिला सम्पदा" },
    blurb: {
      en: "Peacock motifs and colourful ceremonial sets inspired by Mithila art.",
      np: "मिथिला कलाबाट प्रेरित मयूर बुट्टा र रंगीन समारोह सेट।",
    },
    whatsapp: "9779800000008",
    image: u("photo-1611085583191-a3b181a88401"),
    verified: true,
  },
  {
    id: "pokhara-pearl",
    name: { en: "Pokhara Pearl Studio", np: "पोखरा पर्ल स्टुडियो" },
    city: { en: "Pokhara", np: "पोखरा" },
    specialty: { en: "Pearls & Contemporary", np: "मोती र आधुनिक" },
    blurb: {
      en: "Lightweight pearl and rose-gold pieces for gifts and daily wear.",
      np: "उपहार र दैनिक प्रयोगका लागि हलुका मोती र रोज गोल्ड गहना।",
    },
    whatsapp: "9779800000009",
    image: u("photo-1611591437281-460bfbe1220a"),
    verified: true,
  },
];

export const products: Product[] = [
  {
    id: "p1",
    title: { en: "Crown Diamond Ring", np: "क्राउन डायमण्ड औंठी" },
    shopId: "kasturi",
    priceMin: 24500,
    priceMax: 31000,
    metal: "925 Silver",
    category: "rings",
    occasion: { en: "Engagement", np: "गहना लगाउने" },
    image: u("photo-1605100804763-247f67b3557e"),
  },
  {
    id: "p2",
    title: { en: "Emerald Drop Earrings", np: "पन्ना झुम्का" },
    shopId: "himal",
    priceMin: 4800,
    priceMax: 6500,
    metal: "Gold Plated",
    category: "earrings",
    occasion: { en: "Festive", np: "चाडपर्व" },
    image: u("photo-1630019852942-f89202989a59"),
  },
  {
    id: "p3",
    title: { en: "Heritage Layered Neckpiece", np: "परम्परागत माला" },
    shopId: "newa",
    priceMin: 12500,
    metal: "Gold",
    category: "necklaces",
    occasion: { en: "Wedding", np: "विवाह" },
    image: u("photo-1599643478518-a784e5dc4c8f"),
  },
  {
    id: "p4",
    title: { en: "Pearl & Gold Cuff", np: "मोती ब्रेसलेट" },
    shopId: "malla",
    priceMin: 7200,
    priceMax: 9400,
    metal: "Rose Gold",
    category: "bracelets",
    occasion: { en: "Daily Wear", np: "दैनिक" },
    image: u("photo-1611591437281-460bfbe1220a"),
  },
  {
    id: "p5",
    title: { en: "Solitaire Pendant", np: "सोलिटेयर लोकेट" },
    shopId: "kasturi",
    priceMin: 15800,
    priceMax: 19200,
    metal: "925 Silver",
    category: "necklaces",
    occasion: { en: "Gift", np: "उपहार" },
    image: u("photo-1515562141207-7a88fb7ce338"),
  },
  {
    id: "p6",
    title: { en: "Antique Bangle Pair", np: "पुरानो शैलीको चुरा" },
    shopId: "newa",
    priceMin: 9900,
    priceMax: 14500,
    metal: "Gold Plated",
    category: "bracelets",
    occasion: { en: "Wedding", np: "विवाह" },
    image: u("photo-1611085583191-a3b181a88401"),
  },
  {
    id: "p7",
    title: { en: "Onyx Signet Ring", np: "ओनिक्स औंठी" },
    shopId: "malla",
    priceMin: 6400,
    metal: "925 Silver",
    category: "rings",
    occasion: { en: "Daily Wear", np: "दैनिक" },
    image: u("photo-1611652022419-a9419f74343d"),
  },
  {
    id: "p8",
    title: { en: "Temple Jhumka Set", np: "मन्दिर झुम्का सेट" },
    shopId: "himal",
    priceMin: 5200,
    priceMax: 7800,
    metal: "Gold Plated",
    category: "earrings",
    occasion: { en: "Festive", np: "चाडपर्व" },
    image: u("photo-1573408301185-9146fe634ad0"),
  },
  {
    id: "p9",
    title: { en: "Hand-Carved Tilhari Necklace", np: "हातले कुँदिएको तिलहरी" },
    shopId: "aabhushan",
    priceMin: 48000,
    priceMax: 65000,
    metal: "Gold",
    category: "necklaces",
    occasion: { en: "Wedding", np: "विवाह" },
    image: u("photo-1599643478518-a784e5dc4c8f"),
  },
  {
    id: "p10",
    title: { en: "Newari Sun & Moon Earrings", np: "नेवारी सूर्य चन्द्र झुम्का" },
    shopId: "aabhushan",
    priceMin: 12500,
    priceMax: 18000,
    metal: "Gold Plated",
    category: "earrings",
    occasion: { en: "Festive", np: "चाडपर्व" },
    image: u("photo-1630019852942-f89202989a59"),
  },
  {
    id: "p11",
    title: { en: "Custom Devanagari Name Pendant", np: "देवनागरी नामको लोकेट" },
    shopId: "aabhushan",
    priceMin: 8500,
    priceMax: 14000,
    metal: "Gold Plated",
    category: "necklaces",
    occasion: { en: "Gift", np: "उपहार" },
    image: u("photo-1515562141207-7a88fb7ce338"),
  },
  {
    id: "p12",
    title: { en: "Ruby Navaratna Ring", np: "रुबी नवरत्न औंठी" },
    shopId: "ratna",
    priceMin: 36000,
    priceMax: 52000,
    metal: "Gold",
    category: "rings",
    occasion: { en: "Engagement", np: "मगनी" },
    image: u("photo-1605100804763-247f67b3557e"),
  },
  {
    id: "p13",
    title: { en: "Bridal Rani Haar Set", np: "दुलही रानी हार सेट" },
    shopId: "swayambhu",
    priceMin: 95000,
    priceMax: 145000,
    metal: "Gold",
    category: "sets",
    occasion: { en: "Wedding", np: "विवाह" },
    image: u("photo-1599643478518-a784e5dc4c8f"),
  },
  {
    id: "p14",
    title: { en: "Groom's Classic Gold Chain", np: "दुलहाको क्लासिक सुनको चेन" },
    shopId: "swayambhu",
    priceMin: 68000,
    priceMax: 88000,
    metal: "Gold",
    category: "chains",
    occasion: { en: "Wedding", np: "विवाह" },
    image: u("photo-1603561591411-07134e71a2a9"),
  },
  {
    id: "p15",
    title: { en: "Mithila Peacock Jhumka", np: "मिथिला मयूर झुम्का" },
    shopId: "janaki",
    priceMin: 6200,
    priceMax: 8900,
    metal: "Gold Plated",
    category: "earrings",
    occasion: { en: "Festive", np: "चाडपर्व" },
    image: u("photo-1573408301185-9146fe634ad0"),
  },
  {
    id: "p16",
    title: { en: "Mithila Wedding Jewellery Set", np: "मिथिला विवाह गहना सेट" },
    shopId: "janaki",
    priceMin: 22000,
    priceMax: 34000,
    metal: "Gold Plated",
    category: "sets",
    occasion: { en: "Wedding", np: "विवाह" },
    image: u("photo-1611085583191-a3b181a88401"),
  },
  {
    id: "p17",
    title: { en: "Freshwater Pearl Pendant", np: "ताजा पानीको मोती लोकेट" },
    shopId: "pokhara-pearl",
    priceMin: 7400,
    priceMax: 11000,
    metal: "Rose Gold",
    category: "necklaces",
    occasion: { en: "Daily Wear", np: "दैनिक" },
    image: u("photo-1611591437281-460bfbe1220a"),
  },
  {
    id: "p18",
    title: { en: "925 Silver Tennis Bracelet", np: "९२५ चाँदी टेनिस ब्रेसलेट" },
    shopId: "kasturi",
    priceMin: 11055,
    priceMax: 15578,
    metal: "925 Silver",
    category: "bracelets",
    occasion: { en: "Wedding", np: "विवाह" },
    image: u("photo-1603561591411-07134e71a2a9"),
  },
];

/** Editorial rail on the homepage */
export const editRailIds = ["p9", "p10", "p13", "p16"];

export function waLink(number: string, message: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function formatPrice(npr: number): string {
  return `Rs ${npr.toLocaleString("en-IN")}`;
}
