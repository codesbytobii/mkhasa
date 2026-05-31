import { noIndexMetadata } from "@/seo/noIndexMetadata";
import PaymentCallbackClient from "./page.client";

export const metadata = {
  ...noIndexMetadata,
  title: "Payment Confirmation | Mkhasa",
};

export default function PaymentCallbackPage() {
  return <PaymentCallbackClient />;
}
