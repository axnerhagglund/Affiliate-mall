import Image from "next/image";
import type { Product } from "@/lib/products";

export function ProductImage({ product, sizes }: { product: Product; sizes: string }) {
  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-white">
      <Image src={product.image} alt={product.imageAlt ?? product.name} fill sizes={sizes} className="object-contain p-3" />
    </div>
  );
}
