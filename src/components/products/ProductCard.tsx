import type { ProductWithImages } from "@/interfaces/products-with-images.interface";

interface Props {
    key: string;
    product: ProductWithImages;
}

export const ProductCard = ({ key, product }: Props) => {
  return (
    <div>
        { product.title }
    </div>
  )
}
