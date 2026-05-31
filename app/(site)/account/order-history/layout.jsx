import { noIndexMetadata } from "@/seo/noIndexMetadata";

export const metadata = {
  ...noIndexMetadata,
  title: "Order History | Mkhasa",
};

export default function OrderHistoryLayout({ children }) {
  return children;
}
