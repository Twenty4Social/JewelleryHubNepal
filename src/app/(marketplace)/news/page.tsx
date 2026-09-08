import PageIntro from "@/components/page-intro";
import Newsroom from "@/components/newsroom";
import { getLiveNews } from "@/lib/live-data";
import { products } from "@/lib/data";
export const metadata = { title: "News & stories — Jewellery Hub Nepal" };
export default async function Page() {
  const news = await getLiveNews();
  return <><PageIntro title={{ en: "News & stories", np: "समाचार र कथा" }} description={{ en: "Jewellery news from publishers. Open a story to read the original report.", np: "प्रकाशकबाट गहनासम्बन्धी समाचार। पूरा समाचार मूल स्रोतमा पढ्नुहोस्।" }} image={products[27].image} /><Newsroom items={news} /></>;
}
