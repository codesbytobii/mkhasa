import { Button } from "./ui/Button";
import image3 from "../assets/images/slide3desk.jpeg";
import image3mob from "../assets/images/slide3mob.jpeg";
// import bruleeDesktop from "../assets/images/hero section desktop (2).jpg";
import Link from "next/link";
import { toProductPath } from "../utils/paths";
export const SwiperCard4 = () => {
  const image3Src = image3?.src || aura;
  const image3mobSrc = image3mob?.src || aura;

  return (

    <div className="max-h-screen w-full rounded-3xl md:h-screen overflow-y-hidden   ">
      <Link href={toProductPath("Lattafa Khamrah Waha Eau de Parfum 100ml")} style={{ display: "contents" }}>
        <div className="bg-second-card-image h-screen">
          <div className="">

            <img
            alt="Lattafa Khamrah image"
              src={image3Src}
              fetchPriority="high"
              className="block lg:hidden cursor-pointer object-cover bg-no-repeat absolute bottom-0 top-0 right-0 left-0 w-full h-full"
            />
            <img
            alt="Lattafa Khamrah image"
              src={image3mobSrc}
              fetchPriority="high"
              className="hidden lg:block cursor-pointer object-cover bg-no-repeat absolute bottom-0 top-0 right-0 left-0 w-full h-full"
            />
          </div>
        </div>
      </Link>
    </div>
  );
};



