import image5 from "../assets/images/slide5desk.png";
import image5mob from "../assets/images/slide5mob.jpeg";
import Link from "next/link";
import { toProductPath } from "../utils/paths";
export const SwiperCard7 = () => {
  const image5Src = image5?.src || Amouage;
  const image5mobSrc = image5mob?.src || Amouage;

  return (

    <div className="max-h-screen w-full rounded-3xl md:h-screen overflow-y-hidden   ">
      <Link href={toProductPath("Amouage Jubilation 40 Extrait de Parfum 100ml")} style={{ display: "contents" }}>
        <div className="bg-fifth-card-image h-screen">
          <div className="">
            <img
              alt="Amouage Jubilation product image"
              src={image5Src}
              fetchPriority="high"
              className="block lg:block cursor-pointer object-cover bg-no-repeat absolute bottom-0 top-0 right-0 left-0 w-full h-full"
            />
            <img
              alt="Amouage Jubilation product image"
              src={image5mobSrc}
              fetchPriority="high"
              className="hidden lg:hidden cursor-pointer object-cover bg-no-repeat absolute bottom-0 top-0 right-0 left-0 w-full h-full"
            />
          </div>
        </div>
      </Link>
    </div>
  )
}
