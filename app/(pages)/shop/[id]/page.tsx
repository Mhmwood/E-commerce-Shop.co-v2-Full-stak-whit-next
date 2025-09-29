import ProductClientView from "@components/pages/productById/ProductClientView";
export { generateMetadata } from "@lib/seo";

interface Props {
  params: { id: string };
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  return <ProductClientView id={id} />;
}
