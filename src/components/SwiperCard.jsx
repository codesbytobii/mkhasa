import Link from "next/link";
import amber from "../assets/images/amber.jpg";
import { toProductPath } from "../utils/paths";
// import amberDesktop from "../assets/images/hero section desktop (5).jpg";

export const SwiperCard = () => {
  const amberSrc = amber?.src || amber;

  return (

    <div className="w-full max-h-screen rounded-3xl md:h-screen overflow-y-hidden   "> 
    <Link href={toProductPath("French Avenue Amber Empire Extrait de Parfum 100ml")} style={{ display: "contents" }}>     
     <div className="bg-image1 h-screen">
         <div className="">
           <img
             src={amberSrc}
             fetchPriority="high"
             className="block lg:hidden cursor-pointer object-cover bg-no-repeat absolute bottom-0 top-0 right-0 left-0 w-full h-full"
             alt="amber product image"
             />
           <img
             src={amberSrc}
             alt="amber product image"
             fetchPriority="high"
             className="hidden lg:block cursor-pointer object-cover bg-no-repeat absolute bottom-0 top-0 right-0 left-0 w-full h-full"
           />
       </div>
         </div>
         </Link>
       </div>
  );
};
