import error from "../assets/images/wrong.svg"

export const Error = ({ children }) => {
  return (
    <div className="flex flex-col items-center mx-auto my-10 w-fit">
      <img src={error} alt="error-verification-message" className="w-32 h-32" />
      {children}
    </div>
  );
};
