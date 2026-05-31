import { createPageMetadata } from "@/seo/nextMetadata";
import ShippingReturnsPageClient from "./page.client";

export const metadata = createPageMetadata({
  title: "Shipping & Returns | Mkhasa",
  description:
    "View Mkhasa shipping timelines, delivery fees, and return policy for perfume orders in Nigeria.",
  path: "/shipping-returns",
});

export default function ShippingReturnsPage() {
  return <ShippingReturnsPageClient />;
}
