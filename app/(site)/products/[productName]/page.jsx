import { createPageMetadata, formatSlugForTitle } from "@/seo/nextMetadata";
import { noIndexMetadata } from "@/seo/noIndexMetadata";
import { getProductServerData } from "@/seo/serverData";
import { toProductPath, toProductSlug } from "@/utils/paths";
import { notFound, permanentRedirect } from "next/navigation";
import ProductPageClient from "./page.client";

export async function generateMetadata({ params }) {
  const raw = Array.isArray(params?.productName)
    ? params.productName[0]
    : params?.productName || "";

  if (!raw) return noIndexMetadata;

  const product = await getProductServerData(raw);
  if (!product) {
    const fallbackName = formatSlugForTitle(raw) || "Product";
    return createPageMetadata({
      title: `${fallbackName} | Mkhasa`,
      description: `The product ${fallbackName} is unavailable or no longer exists.`,
      path: toProductPath(raw),
      robots: noIndexMetadata.robots,
    });
  }

  const productName = product?.name || formatSlugForTitle(raw) || "Perfume";
  const productPrice = product?.price
    ? ` NGN ${Number(product.price).toLocaleString()}.`
    : "";
  const canonicalPath = toProductPath(productName);

  return createPageMetadata({
    title: `${productName} | Mkhasa Fragrance Store`,
    description: `Buy ${productName} online at Mkhasa.${productPrice} 100% authentic perfume with fast delivery nationwide in Nigeria.`,
    path: canonicalPath,
    image: product?.mainImage || "/logo.webp",
    keywords: [productName, `${productName} perfume`, "buy perfume online nigeria"],
  });
}

export default async function ProductPage({ params }) {
  const raw = Array.isArray(params?.productName)
    ? params.productName[0]
    : params?.productName || "";

  if (!raw) notFound();

  const initialProduct = await getProductServerData(raw);
  if (!initialProduct) notFound();

  const canonicalSlug = toProductSlug(initialProduct?.name || raw);
  const normalizedRaw = String(raw || "").trim().toLowerCase();
  if (canonicalSlug && normalizedRaw !== canonicalSlug) {
    permanentRedirect(toProductPath(canonicalSlug));
  }

  const canonicalPath = toProductPath(canonicalSlug || raw);
  const images = [
    initialProduct?.mainImage,
    initialProduct?.firstImage,
    initialProduct?.secondImage,
    initialProduct?.thirdImage,
  ].filter(Boolean);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: initialProduct?.name || formatSlugForTitle(raw),
    image: images,
    description:
      initialProduct?.description ||
      `Buy ${initialProduct?.name || formatSlugForTitle(raw)} online at Mkhasa.`,
    sku: initialProduct?.barcode || initialProduct?._id,
    brand: {
      "@type": "Brand",
      name: initialProduct?.brand || initialProduct?.vendor || "Mkhasa",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "NGN",
      price: Number(initialProduct?.price || 0).toString(),
      availability:
        initialProduct?.available === false
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      url: `https://www.mkhasa.com${canonicalPath}`,
    },
  };

  return (
    <>
      <h1 className="sr-only">
        {initialProduct?.name || formatSlugForTitle(raw) || "Product details"}
      </h1>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProductPageClient productName={raw} initialProduct={initialProduct} />
    </>
  );
}
