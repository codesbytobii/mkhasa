import { createPageMetadata } from "@/seo/nextMetadata";
import AboutPageClient from "./page.client";

export const metadata = createPageMetadata({
  title: "About Mkhasa | Original Perfumes in Nigeria",
  description:
    "Learn about Mkhasa, our mission, and values. We deliver authentic perfumes and fragrances at fair prices across Nigeria.",
  path: "/about",
  keywords: ["about mkhasa", "mkhasa nigeria", "authentic fragrance store"],
});

export default function AboutPage() {
  return <AboutPageClient />;
}
