import { noIndexMetadata } from "@/seo/noIndexMetadata";
import CartPageClient from "./page.client";

export const metadata = {
  ...noIndexMetadata,
  title: "Your Cart | Mkhasa",
};

export default function CartPage() {
  return <CartPageClient />;
}
