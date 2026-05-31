
import elipses from "../assets/images/elipses.svg";
import white from "../assets/images/ads.png";
import White from "../assets/images/Ellipse-white.svg";

import { Wrapper } from "./ui/Wrapper";
export const Sales = () => {
  return (
    <div className="w-full h-full    ">
      

      <img src={white} className="object-cover rounded-2xl" alt="White"/>
        {/* <div className="flex justify-center">
          <div className="flex flex-col items-start md:items-center md:justify-center gap-2 pt-10 relative">

            <h1 className="text-4xl  md:text-6xl  font-bold text-white md:pl-36">
              NEW SALES
            </h1>
            <div className="flex md:gap-2 text-2xl md:text-2xl md:pr-12">
              <span className="text-white">UP TO</span>
              <span className="inline-block text-white bg-black"><span className="font-NimbusSan">50</span>% off</span>
            </div>
          </div>

          <div className="hidden md:block absolute right-0 bottom-0 ">
          <img src={elipses} alt="elipses-for-sales" className="w-20 md:w-56" />
        </div>

          <div className="block md:hidden absolute right-0 bottom-0">
          <img src={White} alt="elipses-for-sales" className="w-20 md:w-56" />
        </div> */}

          {/* <div className=" absolute md:right-32 md:bottom-28 md:pt-4  bottom-12 right-12">
          <img src={white} className="w-4 md:w-14 " />
        </div> */}
        {/* </div> */}
        {/* <button className="hidden md:block bg-black px-6 py-2 text-white rounded-full text-base absolute right-12 bottom-12">
          Shop now
        </button> */}
      
    </div>
  );
};
