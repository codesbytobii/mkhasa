import { createPageMetadata } from "@/seo/nextMetadata";
import PrivacyPageClient from "./page.client";

export const metadata = createPageMetadata({
  title: "Privacy Policy | Mkhasa",
  description:
    "Read the Mkhasa privacy policy to understand how we collect, use, and protect your personal information.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return <PrivacyPageClient />;
}
