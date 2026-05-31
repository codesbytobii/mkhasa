import lataffa from "../assets/images/tomford.jpg";
import Link from "next/link";
import { toProductPath } from "../utils/paths";
export const SwiperCard7 = () => {
  const lataffaSrc = lataffa?.src || lataffa;

  return (

    <div className="max-h-screen w-full rounded-3xl md:h-screen overflow-y-hidden   ">
      <Link href={toProductPath("Lattafa Musamam White Intense Eau de Parfum 100ml")} style={{ display: "contents" }}>
        <div className="bg-fifth-card-image h-screen">
          <div className="">
            <img
              alt="Lataffa perfume product image"
              src={lataffaSrc}
              fetchPriority="high"
              className="block lg:hidden cursor-pointer object-cover bg-no-repeat absolute bottom-0 top-0 right-0 left-0 w-full h-full"
            />
            <img
              alt="Lataffa perfume product image"
              src={lataffaSrc}
              fetchPriority="high"
              className="hidden lg:block cursor-pointer object-cover bg-no-repeat absolute bottom-0 top-0 right-0 left-0 w-full h-full"
            />
          </div>
        </div>
      </Link>
    </div>
  )
}
