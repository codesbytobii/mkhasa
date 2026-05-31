const css = `
body {
  overflow: hidden;
}
`;
export const Modal = ({ title, children }) => {
  return (
    <div className="fixed left-0 right-0 top-0 bottom-0 bg-[#00000020] z-[100] grid">
      <div className="bg-app-ash m-auto text-center rounded py-16 px-6 w-[min(90vw,600px)] sm:px-16">
        <h2 className="text-app-red font-bold     py-2 text-xl">{title}</h2>
        {children}
      </div>
      <style>{css}</style>
    </div>
  );
};
