"use client";



// import Link from "next/link";
// import { Icon1, Icon2, Icon3, Icon4 } from "../components/Icon";
// import { Icon, iconExists } from "@iconify/react";
// import { Button } from "./ui/Button";
// import { useState } from "react";
// export const CategoryPanel = () => {
//   const { categories = [], status, error } = useLoaderData();
//   const [expand, setExpand] = useState(false);
//   const icons = [
//     <Icon1 key={iconExists} />,
//     <Icon2 key={iconExists} />,
//     <Icon3 key={iconExists} />,
//     <Icon4 key={iconExists} />,
//   ];

//   const toggle = () => setExpand((v) => !v);

//   return (
//     <div className="hidden bg-white relative z-50 md:block">
//       <h2 className="px-6"></h2>
//       <Button
//         className="px-0 text-nowrap md:px-5 md:bg-app-ash"
//         aria-label="Profile drop down"
//         onClick={toggle}
//       >
//         <div className="flex items-center md:gap-4">
//           <p>All Categories</p>
//           <Icon
//             icon="fa6-solid:angle-down"
//             vFlip={expand}
//             style={{ fontSize: 24 }}
//             className="hidden text-app-black min-[512px]:block"
//           />
//         </div>
//       </Button>
//       {status === "pending" ? (
//         "Loading..."
//       ) : status === "error" ? (
//         `An error has occurred ${error.message}`
//       ) : (
//         <ul
//           className={`absolute min-w-full right-0 pb-6 pt-3 bg-white rounded-md shadow-lg top-[calc(100%+1.5rem)] z-50 ${
//             expand ? "" : "hidden"
//           }`}
//         >
//           <>
//             {categories.map(({ name }, index) => (
//               <li
//                 key={index}
//                 className="first:pt-2 last:pb-2 px-8 hover:bg-gray-200"
//               >
//                 <Link
//                   to={`/categories/${encodeURIComponent(name)}`}
//                   className="flex items-center gap-2 text-nowrap py-2 hover:text-app-red"
//                   onClick={() => setExpand(false)}
//                 >
//                   {name}
//                 </Link>
//               </li>
//             ))}
//           </>
//         </ul>
//       )}
//     </div>
//   );
// };


import Link from "next/link";
import { Button } from "./ui/Button";
import { useCategoryContext } from "./CategoryContext";
import { toCategoryPath } from "../utils/paths";
import { useLoaderData } from "@/legacy/router-shim";
export const CategoryPanel = () => {
  const { categories = [], status, error } = useLoaderData();
  // const { isPanelOpen } = useCategoryContext();

  return (
    // <div style={{ display: isPanelOpen ? "block" : "none" }}>
      <div>
      <div className="hidden bg-white relative  md:block      ">
      <h2 className="px-6"></h2>
      <div className="flex items-center md:gap-4      ">
        <Button
          className="px-0 text-nowrap md:px-5 md:bg-app-ash"
          aria-label="Profile drop down"
        >
          <p>Categories</p>
       
        </Button>
        {status === "pending" ? (
          "Loading..."
        ) : status === "error" ? (
          `An error has occurred ${error.message}`
        ) : (
          <div className="flex space-x-4 overflow-x-auto">
            {categories.map(({ name }, index) => (
              <div key={index} className="py-2 px-2 border-r border-gray-200 text-base italic text-center">
                <Link href={toCategoryPath(name)}
                  className="flex items-center gap-1 text-xs hover:text-app-red"
                >
                  {name}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </div>
    
  );
};



