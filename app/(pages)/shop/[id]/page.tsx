import ProductClientView from "@/components/pages/productById/ProductClientView";

interface Props {
  params: { id: string };
}

export default function ProductDetailPage({ params }: Props) {
  return <ProductClientView id={params.id} />;
}
