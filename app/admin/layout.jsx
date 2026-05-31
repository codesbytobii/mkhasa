import { noIndexMetadata } from "@/seo/noIndexMetadata";
import AdminShell from "./admin-shell.jsx";

export const metadata = noIndexMetadata;

export default function AdminLayout({ children }) {
  return <AdminShell>{children}</AdminShell>;
}
