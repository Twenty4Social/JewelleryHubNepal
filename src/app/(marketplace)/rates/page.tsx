import PageIntro from "@/components/page-intro";
import Predictions from "@/components/predictions";
import { getMarketData } from "@/lib/live-data";
export const metadata = { title: "Rates & outlook — Jewellery Hub Nepal" };
export default async function Page() {
  const market = await getMarketData();
  return <><PageIntro title={{ en: "Rates, trends & outlook", np: "दर, प्रवृत्ति र सम्भावना" }} description={{ en: "Published Nepal gold and silver rates, with recent movement in one place.", np: "नेपालको प्रकाशित सुन र चाँदीको दर र हालको परिवर्तन एकै ठाउँमा।" }} /><Predictions market={market} /></>;
}
