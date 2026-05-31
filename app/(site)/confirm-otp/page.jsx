import { noIndexMetadata } from "@/seo/noIndexMetadata";
import ConfirmOtpClient from "./page.client";

export const metadata = {
  ...noIndexMetadata,
  title: "Confirm OTP | Mkhasa",
};

export default function ConfirmOtpPage() {
  return <ConfirmOtpClient />;
}
