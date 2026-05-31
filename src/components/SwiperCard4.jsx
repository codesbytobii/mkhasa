import { Button } from "./ui/Button";
import brulee from "../assets/images/shaghaf.jpg";
// import bruleeDesktop from "../assets/images/hero section desktop (2).jpg";
import Link from "next/link";
import { toProductPath } from "../utils/paths";
export const SwiperCard4 = () => {
  const bruleeSrc = brulee?.src || brulee;

  return (

    <div className="max-h-screen w-full rounded-3xl md:h-screen overflow-y-hidden   ">
      <Link href={toProductPath("Ahmed Al Maghribi Brulee Eau de Parfum 100ml")} style={{ display: "contents" }}>
        <div className="bg-second-card-image h-screen">
          <div className="">

            <img
            alt="brulee perfume image"
              src={bruleeSrc}
              fetchPriority="high"
              className="block lg:hidden cursor-pointer object-cover bg-no-repeat absolute bottom-0 top-0 right-0 left-0 w-full h-full"
            />
            <img
            alt="brulee perfume image"
              src={bruleeSrc}
              fetchPriority="high"
              className="hidden lg:block cursor-pointer object-cover bg-no-repeat absolute bottom-0 top-0 right-0 left-0 w-full h-full"
            />
          </div>
        </div>
      </Link>
    </div>
  );
};



