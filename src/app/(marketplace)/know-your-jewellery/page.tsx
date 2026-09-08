import PageIntro from "@/components/page-intro";
import JewelleryClinic from "@/components/jewellery-clinic";

export const metadata = { title: "Know your jewellery \u2014 Jewellery Hub Nepal" };
export default function Page() {
  return <><PageIntro title={{"en": "Know your jewellery", "np": "आफ्नो गहना बुझ्नुहोस्"}} description={{"en": "Ask about care, repairs or a piece you own. Describe it, add a photo or record your question.", "np": "हेरचाह, मर्मत वा आफ्नो गहनाबारे सोध्नुहोस्। विवरण लेख्नुहोस्, फोटो राख्नुहोस् वा आवाजमा सोध्नुहोस्।"}} /><JewelleryClinic /></>;
}
