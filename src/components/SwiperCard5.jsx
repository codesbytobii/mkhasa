
import image4 from "../assets/images/slide4desk.png";
import image4mob from "../assets/images/slide4mob.jpeg";
import Link from "next/link";
import { toProductPath } from "../utils/paths";
export const SwiperCard5 = () => {
  const image4Src = image4?.src || Assaf;
  const image4mobSrc = image4mob?.src || Assaf;

  return (

    <div className="w-full max-h-screen rounded-3xl md:h-screen overflow-y-hidden   ">
      <Link href={toProductPath("Assaf Attacks Eau de Parfum 150ml")} style={{ display: "contents" }}>
        <div className="bg-third-card-image h-screen">
          <div className="">
            <img
              alt="Assaf Attacks product image"
              src={image4Src}
              fetchPriority="high"
              className="block lg:block cursor-pointer object-cover bg-no-repeat absolute bottom-0 top-0 right-0 left-0 w-full h-full"
            />
            <img
              alt="Assaf Attacks product image"
              src={image4mobSrc}
              fetchPriority="high"
              className="hidden lg:hidden cursor-pointer object-cover bg-no-repeat absolute bottom-0 top-0 right-0 left-0 w-full h-full"
            />
          </div>
        </div>
      </Link>
    </div>
  );
};
