import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/product-detail";
import { products } from "@/lib/data";

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = products.find((item) => item.id === id);
  return product ? {
    title: `${product.title.en} — Jewellery Hub Nepal`,
    description: `Transparent specifications and direct shop contact for ${product.title.en}.`,
  } : {};
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!products.some((product) => product.id === id)) notFound();
  return <><ProductDetail productId={id} /></>;
}
