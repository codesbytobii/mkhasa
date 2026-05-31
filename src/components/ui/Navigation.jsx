"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import { cn } from "../../utils/cn";

export const Navigation = ({
  location,
  className = "",
  iconClassName = "",
  currentLocationClassName = "",
}) => {
  if (!location || !Array.isArray(location) || location.length === 0) return null;

  return (
    <p className={cn("inline-flex flex-wrap items-center text-[#ffffff96] font-medium", className)}>
      {location.map((part, index) => {
        const isLast = index === location.length - 1;
        // Support both `href` (new) and `to` (legacy) prop names
        const linkHref = part.href || part.to || "/";
        return isLast ? (
          <span key={index} title={part?.title || ""} className={cn(currentLocationClassName)}>
            {part.description}
          </span>
        ) : (
          <Link href={linkHref} key={index} className="inline-flex items-center" title={part?.title || ""}>
            {part.description}{" "}
            <Icon icon="mi:chevron-right" className={cn("text-white", iconClassName)} />
          </Link>
        );
      })}
    </p>
  );
};
