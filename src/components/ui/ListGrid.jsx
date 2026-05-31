// export const ListGrid = ({ children }) => {
//   return (
//     <ul className="pt-8 grid gap-4 justify-center grid-flow-row auto-rows-fr grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
//       {children}
//     </ul>
//   );
// };
// import { cn } from "../../utils/cn";
// export const ListGrid = ({ children, horizontalOnSmallScreens = false }) => {
//   return (
//     <ul
//       className={cn(
//         "pt-8 grid gap-4 justify-center",
//         horizontalOnSmallScreens
//           ? "grid-flow-col auto-cols-[minmax(0,_1fr)] sm:grid-flow-row max-w-full sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5"
//           : "grid-flow-row auto-rows-fr grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
//       )}
//     >
//       {children}
//     </ul>
//   );
// };

// import { cn } from "../../utils/cn";

// export const ListGrid = ({ children, horizontalOnSmallScreens = false }) => {
//   return (
//     <ul
//       className={cn(
//         "pt-8 gap-4 justify-center",
//         horizontalOnSmallScreens
//           ? "flex overflow-x-auto sm:overflow-visible flex-nowrap sm:flex-wrap no-scrollbar sm:grid sm:grid-flow-row sm:auto-rows-fr sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5"
//           : "grid grid-flow-row auto-rows-fr grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
//       )}
//     >
//       {children}
//     </ul>
//   );
// };
import { cn } from "../../utils/cn";

export const ListGrid = ({ children, horizontalOnSmallScreens = false }) => {
  return (
    <ul
      className={cn(
        "pt-8 gap-4 justify-center mb-8",
        horizontalOnSmallScreens
          ? "flex overflow-x-auto flex-nowrap sm:grid sm:grid-flow-row sm:auto-rows-fr sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 no-scrollbar px-4"
          : "grid grid-flow-row auto-rows-fr grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
      )}
    >
      {children}
    </ul>
  );
};


