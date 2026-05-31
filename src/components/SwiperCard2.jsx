import heroimg from "../assets/images/Getpaid.png";
import elipses from "../assets/images/Rectangle7.png";

export const SwiperCard2 = () => {
  return (
    <div>
      <div className="min-h-[410px] md:w-[1253px] w-full bg-swift       rounded-3xl overflow-hidden md:h-[560px]">
        <div>
          <div className="w-full  -px-10 title">
            <div className="flex flex-col gap-1 px-4 md:-mt-10 mt:15 pt:30 md:gap-2 md:px-28 md:pt-32      ">
              <h1 className="text-[#fff] lg:text-8xl text-2xl pt-32 -mt-10 md:text-3xl font-bold leading-tight md:-mt-24 md:pt-24 pl-16 md:pl-0 z-10">
                Swift & Fast
              </h1>
              <h1 className="text-[#fff] lg:text-8xl text-2xl -mt-2 md:text-3xl font-bold leading-tight md:-mt-28 md:pt-24 pl-16 md:pl-0 z-10">
                Delivery
              </h1>
              <span className="hidden md:block text-white sm:text-xs md:text-sm md:z-[5] ">
                Swift delivery,seamless service, bringing convenience to your
              </span>
              <span className="hidden md:block text-white sm:text-xs md:text-sm md:z-[5]">
                doorstep.
              </span>
            </div>
            <div className="md:px-36 px-16">
              <img
              alt="Slipese image"
                src={elipses}
                className="absolute top-0 right-0 md:z-[1] md:w-[395px] w-[145px]"
              />
              <img
              alt="Slipese image"
                src={heroimg}
                className="absolute md:bottom-0 md:right-0 bottom-2 pl-44 md:pl-0 md:w-[475px] w-[295px] h-[85%] md:z-[3]"
              />
            </div>
            <div className="px-2 pt-2 mr-10 md:px-24">
              <button className="text-xs md:text-sm px-4 py-2 font-semibold text-white bg-[#A40001] rounded-full md:px-16 md:py-4 ml-16 md:ml-0 z-10">
                Explore Collection
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
