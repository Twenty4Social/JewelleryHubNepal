import PageIntro from "@/components/page-intro";
import Categories from "@/components/categories";

export const metadata = { title: "Explore jewellery \u2014 Jewellery Hub Nepal" };
export default function Page() {
  return <><PageIntro title={{"en": "Explore jewellery", "np": "गहना हेर्नुहोस्"}} description={{"en": "Browse at your own pace. Choose a type or a shop to narrow your search.", "np": "आफ्नै गतिमा हेर्नुहोस्। गहनाको प्रकार वा पसल रोज्नुहोस्।"}} /><Categories /></>;
}
