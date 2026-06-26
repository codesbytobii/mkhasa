import Link from "next/link";
import image1 from "../assets/images/slide1desk.png";
import image1mob from "../assets/images/slide1mob.jpeg";
import { toProductPath } from "../utils/paths";

export const SwiperCard1 = () => {
  const image1Src = image1?.src || aura;
  const image1mobSrc = image1mob?.src || aura;

  return (
    <div className="w-full max-h-screen rounded-3xl md:h-screen overflow-y-hidden   ">
      <Link href={toProductPath("Aura Fragrances Vanilla Power Eau de Parfum 100ml")}
        style={{ display: "contents" }}
      >
        <div className="bg-image h-screen">
          <div className="">
            <img
              alt="Aura Fragrances Vanilla image"
              src={image1Src}
              fetchPriority="high"
              className="block cursor-pointer object-cover lg:hidden bg-no-repeat absolute bottom-0 top-0 right-0 left-0 w-full h-full"
            />
            <img
              alt="Aura Fragrances Vanilla image"
              src={image1mobSrc}
              fetchPriority="high"
              className="cursor-pointer object-cover hidden lg:block bg-no-repeat absolute bottom-0 top-0 right-0 left-0 w-full h-full"
            />
          </div>
        </div>
      </Link>
    </div>
  );
};
