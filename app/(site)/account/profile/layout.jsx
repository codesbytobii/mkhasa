import { noIndexMetadata } from "@/seo/noIndexMetadata";

export const metadata = {
  ...noIndexMetadata,
  title: "My Profile | Mkhasa",
};

export default function ProfileLayout({ children }) {
  return children;
}
