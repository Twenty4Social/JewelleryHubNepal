import Header from "@/components/header";
import Hero from "@/components/hero";
import Categories from "@/components/categories";
import { ShopCards, EditRail } from "@/components/shops";
import Predictions from "@/components/predictions";
import Newsroom from "@/components/newsroom";
import { HowItWorks, JoinCTA } from "@/components/how-it-works";
import Footer from "@/components/footer";
import { getLiveNews, getMarketData } from "@/lib/live-data";

export default async function Home() {
  const [market, news] = await Promise.all([getMarketData(), getLiveNews()]);

  return (
    <>
      <Header rates={market} />
      <main>
        <Hero />
        <Categories />
        <ShopCards />
        <EditRail />
        <Predictions market={market} />
        <Newsroom items={news} />
        <HowItWorks />
        <JoinCTA />
      </main>
      <Footer />
    </>
  );
}
