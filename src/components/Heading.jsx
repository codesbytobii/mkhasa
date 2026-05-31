import { cn } from "../utils/cn";

export const Heading = ({ children, className = "" }) => {
  return (
    <h2 className={cn("font-bold font-    text-app-black text-2xl md:text-3xl", className)}>
      {children}
    </h2>
  );
};
