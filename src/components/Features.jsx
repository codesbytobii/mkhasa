import cycle from "../assets/images/cycle.webp";
import bus from "../assets/images/bus.webp";
import pointer from "../assets/images/mouse-pointer.webp";
import { Wrapper } from "./ui/Wrapper";

export const Features = () => {
  return (
    <div className="bg-white">
      <Wrapper className="grid py-6 justify-center min-[520px]:py-12 grid-cols-3">
        <div className="py-7 flex justify-center items-center gap-2 text-[#323232] font-bold font-     min-[520px]:py-2">
          <img src={pointer} alt="Pointer icon" className="h-12 aspect-square" />
          <p className="hidden sm:block">
            One Click <br />
            Checkout
          </p>
        </div>
        <div className="py-7 flex justify-center items-center gap-2 text-[#323232] font-bold  font-    min-[520px]:py-2 border-app-red border-r-2 border-l-2 ">
          <img src={bus} alt="Bus icon" className="h-12 aspect-square" />
          <p className="hidden sm:block">
            Same Day <br />
            Delivery
          </p>
        </div>
        <div className="py-7 flex  justify-center items-center gap-2 text-[#323232] font-bold font-    min-[520px]:py-2">
          <img src={cycle} alt="Cycle icon" className="h-12 aspect-square" />
          <p className="hidden sm:block">
            7 Days Return <br />
            Policy
          </p>
        </div>
      </Wrapper>
    </div>
  );
};
