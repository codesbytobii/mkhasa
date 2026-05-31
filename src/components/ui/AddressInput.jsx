"use client";

// ModalInput.jsx
export const ModalInput = ({ value, onChange, onBlur, placeholder, type = "text" }) => {
  return (
    <div className="py-2 w-full">
      <input
        type={type}
        className="w-full py-[10px] px-6 outline-none border border-black rounded-sm"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
      />
    </div>
  );
};
