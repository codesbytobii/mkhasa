import { cn } from "../../utils/cn";

export const SectionHeader = ({ header, className }) => {
  return (
    <div>
      <h2 className={cn("text-app-black capitalize font-bold text-lg", className)}>
        {header}
      </h2>
      <div className="mt-1 rounded-full h-2 w-16 bg-app-red">
        <div className="h-full bg-black w-10/12 rounded-full" />
      </div>
    </div>
  );
};
