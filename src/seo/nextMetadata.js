const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.mkhasa.com";
const BRAND_NAME = "Mkhasa";
const DEFAULT_IMAGE = "/logo.webp";

const safeDecode = (value = "") => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

export const formatSlugForTitle = (value = "") => {
  const readable = safeDecode(value)
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!readable) return "";

  return readable
    .split(" ")
    .map((word) => {
      if (!word) return "";
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
};

const toAbsoluteUrl = (path = "/") => {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalized, SITE_URL).toString();
};

export const createPageMetadata = ({
  title,
  description,
  path = "/",
  image = DEFAULT_IMAGE,
  keywords = [],
  robots,
}) => {
  const canonical = toAbsoluteUrl(path);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: BRAND_NAME,
      type: "website",
      locale: "en_NG",
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    ...(robots ? { robots } : {}),
  };
};
