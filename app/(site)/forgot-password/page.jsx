import { noIndexMetadata } from "@/seo/noIndexMetadata";
import ForgotPasswordClient from "./page.client";

export const metadata = {
  ...noIndexMetadata,
  title: "Forgot Password | Mkhasa",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordClient />;
}
