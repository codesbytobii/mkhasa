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
import toast from "react-hot-toast";

export const Component = () => {
  const searchParams = useSearchParams();
  const provider = searchParams.get("provider");
  const [verification, setVerification] = useState("pending");
  const router = useRouter();

  // --- Parameter extraction per provider ---

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
        : provider === "opay"
          ? null  // OPay doesn't use transaction_id
          : searchParams.get("paymentReference"); // monnify

  // OPay sends back ?provider=opay&reference=<orderCode>
  const opayReference = provider === "opay" ? searchParams.get("reference") : null;

  const status = searchParams.get("status");

  // --- Google Ads conversion tracking ---
  useEffect(() => {
    if (typeof window !== "undefined" && verification === "successful") {
      const transactionId = transaction_id || tx_ref || opayReference || "";
      const value = (() => {
        try {
          return Number(JSON.parse(sessionStorage.getItem("items_to_buy"))?.subTotal || 1) || 1;
        } catch {
          return 1;
        }
      })();

      window.gtag &&
        window.gtag("event", "conversion", {
          send_to: "AW-17033587521/JtG-CP3hgOAaEMHWn7o_",
        });
      window.gtag &&
        window.gtag("event", "conversion", {
          send_to: "AW-17261904158/o7h5COCn16obEJ6Cj6dA",
          value,
          currency: "NGN",
          transaction_id: transactionId,
        });

      console.log("Google Ads conversions sent:", {
        value,
        currency: "NGN",
        transactionId,
      });
    }
  }, [verification]);

  // --- Verification logic ---
  useEffect(() => {
    const MAX_RETRIES = 3;

    const attemptVerification = async (retryCount = 1) => {
      try {
        let res;

        if (provider === "opay") {
          // OPay
          if (!opayReference) {
            console.error("OPay reference missing from callback URL");
            setVerification("failed");
            return;
          }
          res = await axios.post(`/verify/opay/payment/${opayReference}`);

        } else if (!provider) {
          // No provider = Monnify
          res = await axios.post(`/verify/monnify/payment/${transaction_id}`);

        } else if (provider === "flutterwave" && status === "successful") {
          res = await axios.post(`/verify/payment/${tx_ref}/${transaction_id}`);

        } else {
          // Paystack
          res = await axios.post(`/verify/paystack/payment/${transaction_id}`);
        }

        if (res.status === 200 || res.data) {
          setVerification("successful");
          toast.success("Payment verified successfully!");

          console.log(itemsToBuy);
          console.log(itemsToBuy?.items);

          // Twitter/X pixel — Paystack only
          if (
            provider === "paystack" &&
            typeof window !== "undefined" &&
            window.twq
          ) {
            const itemsToBuy = (() => {
              try {
                return JSON.parse(sessionStorage.getItem("items_to_buy"));
              } catch {
                return null;
              }
            })();

            if (!itemsToBuy) return;

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
          console.log("Retrying verification...");
          // setTimeout(() => attemptVerification(retryCount + 1), 1500);
        } else {
          setVerification("failed");
        }
      }
    };

    attemptVerification();
  }, [provider, transaction_id, tx_ref, status, opayReference]);

  useEffect(() => {
    const isOkay =
    (provider === "opay" && opayReference) ||  // OPay
    (!provider && transaction_id) ||            // Monnify
    (provider === "flutterwave" && status && tx_ref) || // Flutterwave
    (provider === "paystack" && transaction_id); // Paystack

    if (!isOkay) {
        router.push("/");
    }
  }, [provider, transaction_id, tx_ref, status, opayReference, router]);

  return (
    <>
      <Wrapper className="py-8">
        {verification === "pending" ? (
          <>Your payment is being processed...</>
        ) : verification === "successful" ? (
          <Success>
            <h2 className="mt-6 text-xl font-bold">Success</h2>
            <p className="mx-auto max-w-lg text-center">
              You have successfully placed your order. You can track your order
              status{" "}
              <Link href="/account/order-history" className="text-app-red px-2">
                here
              </Link>
              . Below are related products that go with what you just purchased.
            </p>
          </Success>
        ) : verification === "failed" ? (
          <Error>
            <h2 className="mt-6 text-xl font-bold">Failed</h2>
            <p className="mx-auto max-w-lg text-center">
              Sorry, your transaction failed. Please check that you have not
              been debited and contact your bank. Click{" "}
              <Link href="/" className="text-app-red px-2">
                here
              </Link>{" "}
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
