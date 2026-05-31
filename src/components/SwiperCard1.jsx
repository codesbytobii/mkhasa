import Link from "next/link";
import arabiyat from "../assets/images/mashrabya.jpg";
import { toProductPath } from "../utils/paths";
// import afnan from "../assets/images/9pm.jpg";

export const SwiperCard1 = () => {
  const arabiyatSrc = arabiyat?.src || arabiyat;

  return (
    <div className="w-full max-h-screen rounded-3xl md:h-screen overflow-y-hidden   ">
      <Link href={toProductPath("Arabiyat Prestige Marwa Eau de Parfum 100ml")}
        style={{ display: "contents" }}
      >
        <div className="bg-image h-screen">
          <div className="">
            <img
              alt="arabiyat fragrance image"
              src={arabiyatSrc}
              fetchPriority="high"
              className="block cursor-pointer object-cover lg:hidden bg-no-repeat absolute bottom-0 top-0 right-0 left-0 w-full h-full"
            />
            <img
              alt="arabiyat fragrance image"
              src={arabiyatSrc}
              fetchPriority="high"
              className="cursor-pointer object-cover hidden lg:block bg-no-repeat absolute bottom-0 top-0 right-0 left-0 w-full h-full"
            />
          </div>
        </div>
      </Link>
    </div>
  );
};
