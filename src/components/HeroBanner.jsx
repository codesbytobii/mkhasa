import Image from "next/image";
import Link from "next/link";

import desktopHero from "../assets/images/hero_banner.webp";
import mobileHero from "../assets/images/hero_banner_mobile.webp";

export const HeroBanner = ({
  href,
  alt = "Black Friday: up to 20% off all items at Mkhasa",
}) => {
  const banner = (
    <>
      {/* Mobile: visible below 768px */}
      <Image
        src={mobileHero}
        alt={alt}
        sizes="100vw"
        className="block md:hidden w-full h-auto rounded-sm"
      />

      {/* Desktop: visible from 768px up */}
      <Image
        src={desktopHero}
        alt={alt}
        sizes="100vw"
        quality={85}
        className="hidden md:block w-full h-auto rounded-sm"
      />
    </>
  );

  return (
    <section className="w-full pt-2 pb-4">
      {href ? <Link href={href}>{banner}</Link> : banner}
    </section>
  );
};

export default HeroBanner;