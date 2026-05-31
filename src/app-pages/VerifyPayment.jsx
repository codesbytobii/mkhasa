"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Wrapper } from "../components/ui/Wrapper";
import { Success } from "../components/Success";
import { useEffect, useState } from "react";
import axios from "../utils/axios";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Error } from "../components/Error";
import { BestSellers } from "../components/BestSellers";
import { LatestProducts } from "../components/LatestProducts";

export const Verifypayment = () => {
  const searchParams = useSearchParams();
  const provider = searchParams.get("provider");
  const [verification, setVerification] = useState("pending");
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined' && verification === "successful") {
      const transactionId = transaction_id || tx_ref || "";
      const value =
        Number(
          JSON.parse(sessionStorage.getItem("items_to_buy"))?.subTotal || 1
        ) || 1;
      window.gtag && window.gtag('event', 'conversion', {
        send_to: 'AW-17033587521/JtG-CP3hgOAaEMHWn7o_',
      });
      window.gtag && window.gtag('event', 'conversion', { send_to: 'AW-17261904158/o7h5COCn16obEJ6Cj6dA', value, 'currency': 'NGN', transaction_id: transactionId });

      console.log("✅ Google Ads conversions sent:", {
        value,
        currency: "NGN",
        transactionId,
      });

      // <script>  </script>
    }
  }, [verification]);

  const status = searchParams.get("status");

  const tx_ref =
    provider === "paystack"
      ? searchParams.get("txref")
      : provider === "flutterwave"
        ? searchParams.get("tx_ref")
        : "";

  const transaction_id =
    provider === "paystack"
      ? searchParams.get("reference")
      : provider === "flutterwave"
        ? searchParams.get("transaction_id")
        : provider === "monnify" ? searchParams.get("paymentReference") : "";
  // const transaction_id = provider === "paystack"? searchParams.get("transaction_id");

  useEffect(() => {
    const MAX_RETRIES = 3;

    const attemptVerification = async (retryCount = 1) => {
      try {
        let res;
        if (provider === "flutterwave" && status === "successful") {
          res = await axios.post(`/verify/payment/${tx_ref}/${transaction_id}`);
        } else if(provider === 'monnify'){ 
          res = await axios.post(`/verify/monnify/payment/${transaction_id}`);
        } else {
          res = await axios.post(`/verify/paystack/payment/${transaction_id}`);
        }

        if (res.status === 200 && res.data) {
          setVerification("successful");

          // Only run twq if Paystack was used
          if (provider === "paystack" && typeof window !== "undefined" && window.twq) {
            const itemsToBuy = JSON.parse(sessionStorage.getItem("items_to_buy"));

            const configuredContent = {
              content_type: "product",
              content_id: itemsToBuy._id || itemsToBuy.id || "",
              subTotal: `₦${itemsToBuy.subTotal.toLocaleString()}`,
              deliveryFee: "₦2,500",
              value:
                "₦" + (Number(itemsToBuy.subTotal) + 100).toLocaleString(),
              currency: "NGN",
              contents: itemsToBuy.items.map((item) => ({
                content_name: item.name || item.title || "Product",
                content_type: "product",
                content_id: item.productId._id,
                content_price: item.price,
                num_items: item.quantity,
              })),
            };

            window.twq("event", "tw-pioaa-pioad", configuredContent);
          }

        } else {
          throw new Error("Verification unsuccessful");
        }

      } catch (error) {
        if (retryCount < MAX_RETRIES) {
          console.log("retrying...")
          // setTimeout(() => attemptVerification(retryCount + 1), 1500); // Wait 1.5 seconds then retry
        } else {
          setVerification("failed");
        }
      }
    };

    attemptVerification();
  }, []);
  // console.log((!status || !provider))

  if (!status || !provider) {
    router.push("/")
  }


  return (
    <>
      
      <Wrapper className="py-8 ">
        {verification === "pending" ? (
          <>Your Payment is being Processed ...</>
        ) : verification === "successful" ? (
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
        ) : verification === "failed" ? (
          <Error>
            <h2 className="mt-6 text-xl font-bold">Failed</h2>
            <p className="mx-auto max-w-lg text-center ">
              Sorry, your transaction failed. Please check that you have not
              been debited and contact your bank. Click
              <Link href="/" className="text-app-red px-2">
                here
              </Link>
              to return to home.
            </p>
          </Error>
        ) : (
          <Icon
            icon="svg-spinners:6-dots-rotate"
            style={{ fontSize: 100, display: "grid", placeItems: "center" }}
            className="text-center"
          />
        )}

        <BestSellers horizontalOnSmallScreens />
        <LatestProducts horizontalOnSmallScreens />
      </Wrapper>
    </>
  );
};
