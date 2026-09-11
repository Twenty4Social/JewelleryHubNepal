import RashiJewellery from "@/components/rashi-jewellery";
import Hero from "@/components/hero";
import Categories from "@/components/categories";
import { ShopCards } from "@/components/shops";
import HomeLinks from "@/components/home-links";
import { JoinCTA } from "@/components/how-it-works";

export default function Home() {
  return <><Hero /><ShopCards preview /><Categories preview /><HomeLinks /><RashiJewellery /><JoinCTA /></>;
}
