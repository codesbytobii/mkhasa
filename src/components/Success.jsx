import Image from "next/image";
import success from "../assets/images/success_check.webp";

export const Success = ({ children }) => {
  return (
    <div className="flex flex-col items-center mx-auto my-10 w-fit">
      <Image
        src={success}
        alt="success-verification-message"
        width={200}
        height={200}
      />
      {children}
    </div>
  );
};
