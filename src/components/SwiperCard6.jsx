import armafimg from "../assets/images/armaf1.webp";
import Link from "next/link";
import { toProductPath } from "../utils/paths";
export const SwiperCard6 = () => {
  return (

    <div className="min-h-screen w-full rounded-3xl md:h-screen overflow-y-hidden   ">
      <div className="bg-fourth-card-image max-h-screen">
      <div className="">
      <Link href={toProductPath("Armaf Club De Nuit Intense Man Eau de Toilette 105ml")}>
        <img
        alt="Armaf Image"
          src={armafimg}
          // fetchpriority="high"
          className="block cursor-pointer object-cover bg-no-repeat absolute bottom-8 top-0 right-0 left-0 w-full h-60"
        />
      </Link>
    </div>
      </div>
    </div>
  );
};
