import Link from "next/link";
import image2 from "../assets/images/slide2desk.png";
import image2mob from "../assets/images/slide2mob.jpeg";
import { toProductPath } from "../utils/paths";
// import amberDesktop from "../assets/images/hero section desktop (5).jpg";

export const SwiperCard = () => {
  const image2Src = image2?.src || Assaf;
  const image2mobSrc = image2mob?.src || Assaf;

  return (

    <div className="w-full max-h-screen rounded-3xl md:h-screen overflow-y-hidden   "> 
    <Link href={toProductPath("Assaf Tobacco Jam 50 Extrait de Parfum 100ml")} style={{ display: "contents" }}>     
     <div className="bg-image1 h-screen">
         <div className="">
           <img
             src={image2Src}
             fetchPriority="high"
             className="block lg:hidden cursor-pointer object-cover bg-no-repeat absolute bottom-0 top-0 right-0 left-0 w-full h-full"
             alt="Assaf product image"
             />
           <img
             src={image2mobSrc}
             alt="Assaf product image"
             fetchPriority="high"
             className="hidden lg:block cursor-pointer object-cover bg-no-repeat absolute bottom-0 top-0 right-0 left-0 w-full h-full"
           />
       </div>
         </div>
         </Link>
       </div>
  );
};
