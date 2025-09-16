import ProductClientView from "@components/pages/productById/ProductClientView";
export { generateMetadata } from "@lib/seo";

interface Props {
  params: { id: string };
}

export default function ProductDetailPage({ params }: Props) {
  return <ProductClientView id={params.id} />;
}
