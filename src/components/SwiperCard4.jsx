import { Button } from "./ui/Button";
import image3 from "../assets/images/slide3desk.webp";
import image3mob from "../assets/images/slide3mob.webp";
import desktopHero from "../assets/images/blackfriday2desktop.webp";
import mobileHero from "../assets/images/blackfriday2mobile.webp";
import Link from "next/link";
import { toProductPath } from "../utils/paths";
export const SwiperCard4 = () => {
  const image3Src = desktopHero?.src || aura;
  const image3mobSrc = mobileHero?.src || aura;

  return (

    <div className="max-h-screen w-full rounded-3xl md:h-screen overflow-y-hidden   ">
      {/* <Link href={toProductPath("Lattafa Khamrah Waha Eau de Parfum 100ml")} style={{ display: "contents" }}> */}
      <Link href="/brands/mykonos" style={{ display: "contents" }}>
        <div className="bg-second-card-image h-screen">
          <div className="">

            <img
            alt="Lattafa Khamrah image"
              src={image3Src}
              fetchPriority="high"
              className="block lg:block cursor-pointer object-cover bg-no-repeat absolute bottom-0 top-0 right-0 left-0 w-full h-full"
            />
            <img
            alt="Lattafa Khamrah image"
              src={image3mobSrc}
              fetchPriority="high"
              className="hidden lg:hidden cursor-pointer object-cover bg-no-repeat absolute bottom-0 top-0 right-0 left-0 w-full h-full"
            />
          </div>
        </div>
      </Link>
    </div>
  );
};



