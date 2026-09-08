import Header from "@/components/header";
import Footer from "@/components/footer";
import PageTransition from "@/components/page-transition";
import { getMarketData } from "@/lib/live-data";

export default async function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  const rates = await getMarketData();
  return <><Header rates={rates} /><PageTransition>{children}</PageTransition><Footer /></>;
}
