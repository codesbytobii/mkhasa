import { noIndexMetadata } from "@/seo/noIndexMetadata";
import ResetPasswordClient from "./page.client";

export const metadata = {
  ...noIndexMetadata,
  title: "Reset Password | Mkhasa",
};

export default function ResetPasswordPage() {
  return <ResetPasswordClient />;
}
