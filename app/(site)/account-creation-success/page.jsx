import { noIndexMetadata } from "@/seo/noIndexMetadata";
import AccountCreationSuccessClient from "./page.client";

export const metadata = {
  ...noIndexMetadata,
  title: "Account Created | Mkhasa",
};

export default function AccountCreationSuccessPage() {
  return <AccountCreationSuccessClient />;
}
