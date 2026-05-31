"use client";

import Link from "next/link";
import Image from "next/image";
import logoImg from "../../assets/images/logo.webp";

export const Logo = ({ backGroundColor } = {}) => {
  return (
    <Link href="/" aria-label="Navigate to home page">
      <div className="flex gap-x-2 items-center">
        <Image
          src={logoImg}
          alt="Mkhasa Logo"
          className="aspect-[40/37] w-8 min-[360px]:w-10 md:w-12 lg:w-14"
          width={56}
          height={52}
          priority
        />
        <p
          className={`font-fuzzy font-bold tracking-tighter text-sm pt-2 ${
            backGroundColor === "black" ? "text-white" : "text-app-red"
          } min-[360px]:text-lg md:text-xl lg:text-2xl`}
        >
          mkhasa
        </p>
      </div>
    </Link>
  );
};
