import { noIndexMetadata } from "@/seo/noIndexMetadata";
import AdminLoginClient from "./page.client";

export const metadata = {
  ...noIndexMetadata,
  title: "Admin Login | Mkhasa",
};

export default function AdminLoginPage() {
  return <AdminLoginClient />;
}
