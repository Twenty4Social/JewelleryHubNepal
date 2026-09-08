import PageIntro from "@/components/page-intro";
import { ShopCards } from "@/components/shops";

export const metadata = { title: "Shops \u2014 Jewellery Hub Nepal" };
export default function Page() {
  return <><PageIntro title={{"en": "Shops", "np": "पसलहरू"}} description={{"en": "Meet five jewellery houses. Find a collection that feels like you.", "np": "पाँच गहना पसल चिनौँ। आफ्नो मनपर्ने सङ्ग्रह रोजौँ।"}} /><ShopCards /></>;
}
