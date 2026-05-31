import success from "../assets/images/success_check.webp";

export const Success = ({ children }) => {
  return (
    <div className="flex flex-col items-center mx-auto my-10 w-fit">
      <img src={success} alt="success-verification-message" />
      {children}
    </div>
  );
};
