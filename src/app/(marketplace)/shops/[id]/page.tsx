import { notFound } from "next/navigation";
import ShopDetail from "@/components/shop-detail";
import { shops } from "@/lib/data";

export function generateStaticParams() { return shops.map((shop) => ({ id: shop.id })); }
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: `${shops.find((s) => s.id === id)?.name.en ?? "Shop"} — Jewellery Hub Nepal` };
}
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!shops.some((shop) => shop.id === id)) notFound();
  return <><ShopDetail shopId={id} /></>;
}
