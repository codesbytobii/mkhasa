import { createPageMetadata } from "@/seo/nextMetadata";
import TermsPageClient from "./page.client";

export const metadata = createPageMetadata({
  title: "Terms & Conditions | Mkhasa",
  description:
    "Review Mkhasa terms and conditions for use of our website, purchases, shipping, and returns.",
  path: "/terms",
});

export default function TermsPage() {
  return <TermsPageClient />;
}
