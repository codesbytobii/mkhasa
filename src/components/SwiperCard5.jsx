
import rayhaan from "../assets/images/lionhead.jpg";
// import rayhaanDesktop from "../assets/images/hero section desktop (3).jpg";
import Link from "next/link";
import { toProductPath } from "../utils/paths";
export const SwiperCard5 = () => {
  const rayhaanSrc = rayhaan?.src || rayhaan;

  return (

    <div className="w-full max-h-screen rounded-3xl md:h-screen overflow-y-hidden   ">
      <Link href={toProductPath("Rayhaan Aquatica Eau de Parfum 100ml")} style={{ display: "contents" }}>
        <div className="bg-third-card-image h-screen">
          <div className="">
            <img
              alt="rayhaan product image"
              src={rayhaanSrc}
              fetchPriority="high"
              className="block lg:hidden cursor-pointer object-cover bg-no-repeat absolute bottom-0 top-0 right-0 left-0 w-full h-full"
            />
            <img
              alt="rayhaan product image"
              src={rayhaanSrc}
              fetchPriority="high"
              className="hidden lg:block cursor-pointer object-cover bg-no-repeat absolute bottom-0 top-0 right-0 left-0 w-full h-full"
            />
          </div>
        </div>
      </Link>
    </div>
  );
};
