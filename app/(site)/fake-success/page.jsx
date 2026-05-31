import { noIndexMetadata } from "@/seo/noIndexMetadata";
import FakeSuccessClient from "./page.client";

export const metadata = {
  ...noIndexMetadata,
  title: "Order Confirmed | Mkhasa",
};

export default function FakeSuccessPage() {
  return <FakeSuccessClient />;
}
