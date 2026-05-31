import Link from "next/link";
import { toCategoryPath } from "../utils/paths";

// import RollonImage from "../assets/images/topCategories/rollon.webp";

const categoriesImage={
  "Body Mist":"/topCategories/bodymist.webp",
  "Body Spray":"/topCategories/bodyspray2.webp",
  "Diffusers":"/topCategories/diffusers.webp",
  "Humidifiers":"/topCategories/humidifiers.webp",
  "Roll-on":"/topCategories/Roll-on.webp",
  "Perfumes":"/topCategories/Perfumes.webp",
  "Oil Perfumes":"/topCategories/oilperfumes.webp",
  "Air fresheners":"/topCategories/Airfreshener.webp",
  "Car Wash":"/topCategories/Car Wash.webp",
  "Car fragrances":"/topCategories/Car fragnances.webp"
}
export const CategoryCard = ({ category, numberOfProducts = Math.floor(Math.random()*11+1), image }) => {
  return (
    <Link href={toCategoryPath(category)}>
      <div className="relative aspect-[4/7] md:aspect-[5/7] w-[8rem] md:w-[13rem] overflow-hidden rounded-xl lg:rounded-sm">
        <img
          src={categoriesImage[category.trim()]||image||""}
          alt={category}
          className="object-cover object-center w-full h-full"
        />

        <div className="absolute bottom-0 left-0 right-0 z-10 h-28 md:h-32 px-4 pt-10 bg-gradient-to-t from-black">
          <h2 className="font-bold text-sm md:text-base text-white">{category}</h2>
          <p className="text-app-ash text-sm md:text-base">
            {numberOfProducts} Product{numberOfProducts > 1 ? "s" : ""}
          </p>
        </div>
      </div>
    </Link>
  );
};
// import Link from "next/link";
// import RollonImage from "../assets/images/topCategories/rollon.webp";
// import BodySprayImage from "../assets/images/topCategories/bodyspray1.webp";
// import BodyMistImage from "../assets/images/topCategories/bodymist.webp";
// import DiffusersImage from "../assets/images/topCategories/diffusers.webp";
// import ReedDiffusersImage from "../assets/images/topCategories/reed-diffusers.webp";
// import PerfumesImage from "../assets/images/topCategories/perfumes.webp";
// import OilPerfumesImage from "../assets/images/topCategories/oil-perfumes.webp";

// // Object containing category names as keys and corresponding image imports as values
// const categoryImages = {
//   "Rollon": RollonImage,
//   "BodySpray": BodySprayImage,
//   "BodyMist": BodyMistImage,
//   "diffusers": DiffusersImage,
//   "reed-diffusers": ReedDiffusersImage,
//   "perfumes": PerfumesImage,
//   "oil-perfumes": OilPerfumesImage,
// };

// export const CategoryCard = ({ category, numberOfProducts = 1 }) => {
//   // Find the image URL based on the category name
//   const image = categoryImages[category];

//   return (
//     <Link href={`/categories/${category}`}>
//       <div className="relative aspect-[5/7] w-[calc(220px+1vw)] rounded-2xl overflow-hidden">
//         <img
//           src={image}
//           alt=""
//           className="object-cover object-center w-full h-full"
//         />

//         <div className="absolute bottom-0 left-0 right-0 z-10 h-32 px-4 pt-10 bg-gradient-to-t from-black">
//           <h2 className="font-bold text-white">{category}</h2>
//           <p className="text-app-ash">
//             {numberOfProducts} Products{numberOfProducts > 1 ? "s" : ""}
//           </p>
//         </div>
//       </div>
//     </Link>
//   );
// };





// import Link from "next/link";

// // Assuming you have imported your images
// import bodymist from "../assets/images/body mist.svg";
// import bodyspray from "../assets/images/BodySpray.svg";
// import perfume from "../assets/images/Perfume.svg";
// import Rollon from "../assets/images/Rollon.png";

// export const CategoryCard = ({
//   category,
//   numberOfProducts = 1,
//   imageIndex,
// }) => {
//   // Array of images
//   const images = [bodymist, bodyspray, perfume];

//   return (
//     <Link href={`/categories/${category}`}>
//       <div className="relative aspect-[5/7] w-[calc(220px+1vw)] rounded-2xl overflow-hidden">
//         {/* Render image based on imageIndex */}
//         <img
//           src={images[imageIndex]}
//           alt=""
//           className="object-cover object-center w-full h-full"
//         />

//         <div className="absolute bottom-0 left-0 right-0 z-10 h-32 px-4 pt-10 bg-gradient-to-t from-black">
//           <h2 className="font-bold text-white">{category}</h2>
//           <p className="text-app-ash">
//             {numberOfProducts} Product{numberOfProducts !== 1 && "s"}
//           </p>
//         </div>
//       </div>
//     </Link>
//   );
// };
