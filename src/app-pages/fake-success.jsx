"use client";

import Link from "next/link";
import { Wrapper } from "../components/ui/Wrapper";
import { Success } from "../components/Success";
import { BestSellers } from "../components/BestSellers";
import { LatestProducts } from "../components/LatestProducts";

export const Component = () => {
  

  return (
    <>
      
      <Wrapper className="py-8 ">
      <Success>
            <h2 className="mt-6 text-xl font-bold">Success</h2>
            <p className="mx-auto max-w-lg text-center">
              You have successfully placed your order, you can track your order
              status
              <Link href="/account/order-history" className="text-app-red px-2">
                here
              </Link>
              , below are related products that go with what you just purchased.
            </p>
          </Success>

        {/* <BestSellers horizontalOnSmallScreens />
        <LatestProducts horizontalOnSmallScreens /> */}
      </Wrapper>
    </>
  );
};
