"use client";

import { CartItems as GuestCartItems } from "../components/GuestCart";
import { useCartContext } from "../hooks/utils/useCart";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/Button";
import { Wrapper } from "../components/ui/Wrapper";
import { useCartQuery } from "../hooks/query/useCart";
import { Heading } from "../components/Heading";
import { OrderSummary } from "../components/OrderTotal";
import { CartItems } from "../components/Cart";
import { cn } from "../utils/cn";
import React, { useState, useEffect, useRef } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../hooks/utils/useAuth";
import axios from "../utils/axios";
import { useMutation } from "@tanstack/react-query";
import { Icon } from "@iconify/react";
import { Input } from "../components/Input";
import * as yup from "yup";
import { useFormik } from "formik";
import flutterImg from "../assets/images/flutter1.svg";
import { AddNewAddressModal } from "../components/ui/AddNewAddressModal";
import { Card } from "../components/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/accordion";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL_V2 =
  "https://mkhasa-bfdb6fabd978.herokuapp.com/api/v2";

const BASE_URL_V1 =
  process.env.NEXT_PUBLIC_BASE_URL ||
  "https://mkhasa-bfdb6fabd978.herokuapp.com/api/v1";

/*
|--------------------------------------------------------------------------
| Nigerian States
|--------------------------------------------------------------------------
*/

export const states = [
  { name: "Abia", value: "abia" },
  { name: "Adamawa", value: "adamawa" },
  { name: "Akwa Ibom", value: "akwa_ibom" },
  { name: "Anambra", value: "anambra" },
  { name: "Bauchi", value: "bauchi" },
  { name: "Bayelsa", value: "bayelsa" },
  { name: "Benue", value: "benue" },
  { name: "Borno", value: "borno" },
  { name: "Cross River", value: "cross_river" },
  { name: "Delta", value: "delta" },
  { name: "Ebonyi", value: "ebonyi" },
  { name: "Edo", value: "edo" },
  { name: "Ekiti", value: "ekiti" },
  { name: "Enugu", value: "enugu" },
  { name: "FCT - Abuja", value: "fct_abuja" },
  { name: "Gombe", value: "gombe" },
  { name: "Imo", value: "imo" },
  { name: "Jigawa", value: "jigawa" },
  { name: "Kaduna", value: "kaduna" },
  { name: "Kano", value: "kano" },
  { name: "Katsina", value: "katsina" },
  { name: "Kebbi", value: "kebbi" },
  { name: "Kogi", value: "kogi" },
  { name: "Kwara", value: "kwara" },
  { name: "Lagos", value: "lagos" },
  { name: "Nasarawa", value: "nasarawa" },
  { name: "Niger", value: "niger" },
  { name: "Ogun", value: "ogun" },
  { name: "Ondo", value: "ondo" },
  { name: "Osun", value: "osun" },
  { name: "Oyo", value: "oyo" },
  { name: "Plateau", value: "plateau" },
  { name: "Rivers", value: "rivers" },
  { name: "Sokoto", value: "sokoto" },
  { name: "Taraba", value: "taraba" },
  { name: "Yobe", value: "yobe" },
  { name: "Zamfara", value: "zamfara" },
];

/*
|--------------------------------------------------------------------------
| State Helpers
|--------------------------------------------------------------------------
*/

/*
 * Converts:
 *
 * Lagos       -> lagos
 * LAGOS       -> lagos
 * Akwa Ibom   -> akwa_ibom
 * FCT - Abuja -> fct_abuja
 *
 * But it does NOT blindly convert an unknown value into a delivery state.
 */
const normalizeState = (state) => {
  if (!state) {
    return "";
  }

  const value = String(state)
    .trim()
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/\s+/g, " ");

  const matchedState = states.find((item) => {
    const normalizedName = item.name
      .toLowerCase()
      .replace(/-/g, " ")
      .replace(/\s+/g, " ");

    const normalizedValue = item.value
      .toLowerCase()
      .replace(/-/g, " ")
      .replace(/\s+/g, " ");

    return (
      normalizedName === value ||
      normalizedValue === value
    );
  });

  return matchedState?.value || "";
};

/*
 * Resolve the state that should be used for delivery calculation.
 *
 * IMPORTANT:
 * Your user data previously had:
 *
 * city:  Lagos
 * state: Nigeria
 *
 * "Nigeria" is NOT a delivery state, so it cannot be used by
 * OrderSummary if OrderSummary expects values such as "lagos".
 *
 * Therefore:
 * 1. Try the actual state first.
 * 2. If the state isn't a recognized Nigerian state, check whether
 *    the city itself happens to be a recognized state.
 * 3. Otherwise return empty string and let Formik validation handle it.
 */
const resolveDeliveryState = (address) => {
  if (!address) {
    return "";
  }

  const state = normalizeState(address.state);

  if (state) {
    return state;
  }

  const city = normalizeState(address.city);

  if (city) {
    return city;
  }

  return "";
};

/*
|--------------------------------------------------------------------------
| Monnify Bank Transfer Screen
|--------------------------------------------------------------------------
*/

const MonnifyTransferScreen = ({
  accountDetails,
  paymentReference,
  onPaid,
}) => {
  const [monnifyStatus, setMonnifyStatus] = useState("pending");
  const [timeLeft, setTimeLeft] = useState("");
  const [copied, setCopied] = useState(false);

  const pollingRef = useRef(null);
  const countdownRef = useRef(null);

  const router = useRouter();

  /*
   * Countdown timer
   */
  useEffect(() => {
    if (!accountDetails?.expiresAt) {
      return;
    }

    const tick = () => {
      const diff =
        new Date(accountDetails.expiresAt).getTime() -
        Date.now();

      if (diff <= 0) {
        setTimeLeft("Expired");
        setMonnifyStatus("expired");

        if (countdownRef.current) {
          clearInterval(countdownRef.current);
        }

        if (pollingRef.current) {
          clearInterval(pollingRef.current);
        }

        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor(
        (diff % 60000) / 1000
      );

      setTimeLeft(
        `${minutes}m ${seconds
          .toString()
          .padStart(2, "0")}s`
      );
    };

    tick();

    countdownRef.current = setInterval(tick, 1000);

    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, [accountDetails?.expiresAt]);

  /*
   * Poll payment status every 5 seconds
   */
  useEffect(() => {
    if (!paymentReference) {
      return;
    }

    const poll = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL_V1}/payment/monnify/status/${paymentReference}`
        );

        const responseData = res.data;

        if (responseData.paymentStatus === "paid") {
          setMonnifyStatus("paid");

          if (pollingRef.current) {
            clearInterval(pollingRef.current);
          }

          if (countdownRef.current) {
            clearInterval(countdownRef.current);
          }

          onPaid?.();
        }
      } catch (error) {
        console.error(
          "Polling error:",
          error
        );
      }
    };

    pollingRef.current = setInterval(
      poll,
      5000
    );

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [paymentReference, onPaid]);

  /*
   * Cleanup
   */
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }

      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

  const handleCopy = async (text) => {
    if (!text) {
      return;
    }

    try {
      await navigator.clipboard.writeText(text);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(
        "Failed to copy:",
        error
      );
    }
  };

  /*
   * Paid
   */
  if (monnifyStatus === "paid") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <Icon
            icon="mdi:check-circle"
            className="text-green-600 text-4xl"
          />
        </div>

        <h2 className="text-2xl font-bold text-green-600">
          Payment Confirmed!
        </h2>

        <p className="text-gray-600">
          Your order has been placed successfully.
        </p>

        <Button
          onClick={() =>
            router.push(
              "/account/order-history"
            )
          }
          className="bg-black text-white px-8 py-3 rounded-full mt-2"
        >
          View My Orders
        </Button>
      </div>
    );
  }

  /*
   * Expired
   */
  if (monnifyStatus === "expired") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
          <Icon
            icon="mdi:clock-alert"
            className="text-red-500 text-4xl"
          />
        </div>

        <h2 className="text-2xl font-bold text-red-500">
          Transfer Account Expired
        </h2>

        <p className="text-gray-600">
          The temporary account has expired.
          Please retry checkout.
        </p>

        <Button
          onClick={() =>
            router.push("/checkout")
          }
          className="bg-black text-white px-8 py-3 rounded-full mt-2"
        >
          Retry Checkout
        </Button>
      </div>
    );
  }

  /*
   * Pending
   */
  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-full bg-yellow-50 flex items-center justify-center mx-auto mb-3">
          <Icon
            icon="mdi:bank-transfer"
            className="text-yellow-600 text-3xl"
          />
        </div>

        <h2 className="text-xl font-bold">
          Complete Your Transfer
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Transfer the exact amount to the
          account below
        </p>
      </div>

      <div className="bg-gray-50 rounded-2xl p-6 space-y-4 border">
        <div className="text-center pb-4 border-b">
          <p className="text-sm text-gray-500 mb-1">
            Amount to Transfer
          </p>

          <p className="text-3xl font-bold text-black">
            ₦
            {Number(
              accountDetails?.amount || 0
            ).toLocaleString()}
          </p>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Bank Name
          </span>

          <span className="font-semibold text-sm">
            {accountDetails?.bankName}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Account Number
          </span>

          <div className="flex items-center gap-2">
            <span className="font-bold text-lg tracking-widest">
              {accountDetails?.accountNumber}
            </span>

            <button
              type="button"
              onClick={() =>
                handleCopy(
                  accountDetails?.accountNumber
                )
              }
              className="text-xs bg-black text-white px-2 py-1 rounded"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Account Name
          </span>

          <span className="font-semibold text-sm">
            {accountDetails?.accountName}
          </span>
        </div>

        {accountDetails?.ussdCode && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              USSD Code
            </span>

            <span className="font-mono text-sm font-semibold">
              {accountDetails.ussdCode}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t">
          <span className="text-sm text-gray-500">
            Expires In
          </span>

          <span
            className={`font-bold text-sm ${
              timeLeft === "Expired"
                ? "text-red-500"
                : "text-orange-500"
            }`}
          >
            {timeLeft || "Loading..."}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mt-6 text-gray-500 text-sm">
        <Icon
          icon="svg-spinners:6-dots-rotate"
          style={{ fontSize: 18 }}
        />

        <span>
          Waiting for payment confirmation...
        </span>
      </div>

      <p className="text-xs text-gray-400 text-center mt-3">
        This page will update automatically once
        your transfer is received.
      </p>
    </div>
  );
};

/*
|--------------------------------------------------------------------------
| Main Checkout Component
|--------------------------------------------------------------------------
*/

export const Component = () => {
  const schema = yup.object().shape({
    email: yup
      .string()
      .email()
      .required(),

    phone: yup
      .string()
      .required(),

    city: yup
      .string()
      .required(),

    state: yup
      .string()
      .required(),

    country: yup
      .string()
      .required(),

    name: yup
      .string()
      .required(),

    street1: yup
      .string()
      .required(),
  });

  const { data, refetch } =
    useCartQuery();

  const [couponCode, setCouponCode] =
    useState(null);

  /*
   * Monnify
   */
  const [monnifyScreen, setMonnifyScreen] =
    useState(false);

  const [
    monnifyAccountDetails,
    setMonnifyAccountDetails,
  ] = useState(null);

  const [monnifyReference, setMonnifyReference] =
    useState("");

  /*
   * Payment provider
   */
  const [provider, setProvider] =
    useState("monnify");

  const [isLoading, setIsLoading] =
    useState(true);

  const [user, setUser] =
    useState(null);

  const router = useRouter();

  const {
    getUserId,
    getUserWithId,
  } = useAuth();

  /*
   * Formik
   */
  const formik = useFormik({
    initialValues: {
      name: "",
      street1: "",
      email: "",
      phone: "",
      city: "",
      state: "",
      country: "Nigeria",
    },

    validationSchema: schema,

    onSubmit: async (values) => {
      /*
       * Make sure the state sent to the backend
       * is the normalized state currently selected.
       */
      const deliveryState =
        normalizeState(values.state);

      const address =
        `${values.street1}, ${values.city}`;

      const payload = {
        ...values,

        /*
         * This guarantees the order payload receives
         * the same state used by OrderSummary.
         */
        state: deliveryState,

        address,

        ...(couponCode && {
          couponCode,
        }),
      };

      /*
       * street1 is converted into address above.
       */
      delete payload.street1;

      mutation.mutate(payload);
    },
  });

  /*
   * Small loading delay used by the original page.
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  /*
   * Create order
   */
  const mutation = useMutation({
    mutationFn: (payload) => {
      sessionStorage.setItem(
        "items_to_buy",
        JSON.stringify(data)
      );

      return axios.post(
        `${BASE_URL_V2}/orders/create/${getUserId()}`,
        {
          provider,

          ...(provider === "monnify" && {
            paymentMethod:
              "ACCOUNT_TRANSFER",
          }),

          ...payload,
        }
      );
    },

    onSuccess: (res) => {
      const responseData = res.data;

      /*
       * Monnify bank transfer
       */
      if (provider === "monnify") {
        const accountDetails =
          responseData?.payment?.accountDetails;

        const paymentReference =
          responseData?.code ||
          responseData?.payment
            ?.paymentReference;

        if (accountDetails) {
          setMonnifyAccountDetails(
            accountDetails
          );

          setMonnifyReference(
            paymentReference || ""
          );

          setMonnifyScreen(true);

          return;
        }

        /*
         * Fallback payment link
         */
        if (responseData?.paymentLink) {
          window.location.href =
            responseData.paymentLink;

          return;
        }

        console.error(
          "Monnify: no account details or payment link returned"
        );

        toast.error(
          "Unable to initialize payment. Please try again."
        );

        return;
      }

      /*
       * Other payment providers
       */
      const { paymentLink } =
        responseData;

      if (paymentLink) {
        window.location.href =
          paymentLink;
      } else {
        console.error(
          "Payment link is missing from the response"
        );

        toast.error(
          "Payment link could not be created."
        );
      }
    },

    onError: (error) => {
      console.error(
        "Error creating order:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Unable to create order. Please try again."
      );
    },
  });

  /*
   * Fetch logged-in user
   */
  const fetchUser = async () => {
    try {
      const id = getUserId();

      const res =
        await getUserWithId(id);

      setUser(res.user);
    } catch (error) {
      console.error(
        "Failed to fetch user:",
        error
      );
    }
  };

  /*
   * Load user data
   */
  useEffect(() => {
    fetchUser();

    axios
      .get(`/get/user/${getUserId()}`)
      .then((res) => {
        const userData =
          res.data?.user;

        if (!userData) {
          return;
        }

        /*
         * Resolve the user's state before putting
         * it into Formik.
         */
        const resolvedState =
          resolveDeliveryState(
            userData
          );

        formik.setValues(
          (previousValues) => ({
            ...previousValues,

            email:
              userData.email || "",

            phone:
              userData.phoneNumber || "",

            street1:
              userData.street1 || "",

            name:
              userData.name || "",

            city:
              userData.city || "",

            state:
              resolvedState,

            country:
              userData.country ||
              "Nigeria",
          })
        );
      })
      .catch((error) => {
        console.error(
          "Failed to load checkout user:",
          error
        );
      });
  }, []);

  /*
   * Always keep country as Nigeria when a state
   * is selected.
   */
  useEffect(() => {
    if (
      formik.values.state &&
      formik.values.country !==
        "Nigeria"
    ) {
      formik.setFieldValue(
        "country",
        "Nigeria",
        false
      );
    }
  }, [
    formik.values.state,
    formik.values.country,
  ]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  /*
   * Monnify screen
   */
  if (monnifyScreen) {
    return (
      <>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          newestOnTop
        />

        <Wrapper className="py-8">
          <MonnifyTransferScreen
            accountDetails={
              monnifyAccountDetails
            }
            paymentReference={
              monnifyReference
            }
            onPaid={() => {}}
          />
        </Wrapper>
      </>
    );
  }

  return (
    <main>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
      />

      <Wrapper className="py-4">
        <div className="grid gap-6 md:grid-cols-12">

          <form
            onSubmit={formik.handleSubmit}
            id="checkout-form"
            className="grid md:col-span-6 lg:col-span-7 xl:col-span-8"
          >
            <PersonalDetails
              formik={formik}
            />

            <SecondaryDeliveryDetails
              formik={formik}
              user={user}
            />

            <PaymentMethod
              setProvider={setProvider}
              provider={provider}
            />
          </form>

          <div className="md:col-span-6 lg:col-span-5 xl:col-span-4">
            <CartSummary
              data={data}
              isPending={
                mutation.isPending
              }

              deliveryState={
                formik.values.state
              }

              payStackSelected={
                provider === "paystack"
              }

              refetchCart={refetch}
              onCouponVerified={
                setCouponCode
              }
            />
          </div>
        </div>
      </Wrapper>
    </main>
  );
};

/*
|--------------------------------------------------------------------------
| Cart Summary
|--------------------------------------------------------------------------
*/

const CartSummary = ({
  className,
  isPending,
  deliveryState,
  payStackSelected,
  data,
  refetchCart,
  onCouponVerified,
}) => {
  const { user } = useAuth();

  const {
    getCartFromLocalStorage,
    cartQuantityChanged,
  } = useCartContext();

  const [coupon, setCoupon] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const [
    couponMessage,
    setCouponMessage,
  ] = useState(null);

  const [
    discountPercent,
    setDiscountPercent,
  ] = useState(0);

  const [guestCart, setGuestCart] =
    useState([]);

  /*
   * Guest cart
   */
  useEffect(() => {
    if (!user) {
      setGuestCart(
        getCartFromLocalStorage()
      );
    }
  }, [
    cartQuantityChanged,
    user,
  ]);

  /*
   * Coupon
   */
  const submitCoupon = async () => {
    if (!coupon?.trim()) {
      toast.error(
        "Please enter a coupon code."
      );

      return;
    }

    setSubmitting(true);
    setCouponMessage(null);

    try {
      const res = await axios.post(
        "/coupon",
        {
          couponCode:
            coupon.trim(),
        }
      );

      if (res.data?.success) {
        setCouponMessage({
          type: "success",
          text:
            res.data.message ||
            "Coupon applied successfully.",
        });

        setDiscountPercent(
          res.data.discount ?? 0
        );

        onCouponVerified?.(
          coupon.trim()
        );

        await refetchCart();

        toast.success(
          res.data.message ||
            "Coupon applied successfully."
        );
      } else {
        setCouponMessage({
          type: "error",
          text:
            res.data?.message ||
            "Invalid coupon",
        });

        setDiscountPercent(0);

        toast.error(
          res.data?.message ||
            "Invalid coupon."
        );
      }
    } catch (error) {
      const message =
        error?.response?.data
          ?.message ||
        "Failed to apply coupon";

      setCouponMessage({
        type: "error",
        text: message,
      });

      setDiscountPercent(0);

      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const hasItems = user
    ? data?.items?.length > 0
    : guestCart?.length > 0;

  return (
    <div
      className={cn(
        "bg-white rounded-xl p-5",
        className
      )}
    >
      <div className="flex items-center gap-3 border-b-2 pb-4">
        <Heading className="text-app-black">
          Item(s)
        </Heading>
      </div>

      <div>
        {user ? (
          <CartItems isCheckout />
        ) : (
          <GuestCartItems isCheckout />
        )}

        <OrderSummary
          state={deliveryState}
          payStackSelected={
            payStackSelected
          }
          discountPercent={
            discountPercent
          }
        />

        <form
          onSubmit={(event) => {
            event.preventDefault();
            submitCoupon();
          }}
          className="flex justify-between items-end gap-6 my-4"
        >
          <div>
            <label
              htmlFor="CouponCode"
              className="font-semibold"
            >
              Coupon Code
            </label>

            <input
              placeholder="CouponCode"
              id="CouponCode"
              value={coupon}
              onChange={(event) =>
                setCoupon(
                  event.target.value
                )
              }
              className="border-black border p-2"
            />
          </div>

          <Button
            type="submit"
            className="btn"
            disabled={submitting}
          >
            {submitting ? (
              <Icon
                icon="svg-spinners:6-dots-rotate"
                style={{
                  fontSize: 16,
                }}
              />
            ) : (
              "Apply"
            )}
          </Button>
        </form>

        {couponMessage && (
          <p
            className={
              couponMessage.type ===
              "success"
                ? "text-green-600"
                : "text-app-red"
            }
          >
            {couponMessage.text}
          </p>
        )}

        {hasItems && (
          <Button
            type="submit"
            form="checkout-form"
            variant="rectangle"
            className="bg-[#27D34C] text-white md:px-8 rounded-none md:py-3 w-full px-10 focus:outline-none font-bold mt-6"
            disabled={isPending}
          >
            {isPending ? (
              <Icon
                icon="svg-spinners:6-dots-rotate"
                style={{
                  fontSize: 20,
                }}
                className="text-center"
              />
            ) : (
              "Pay Now"
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

/*
|--------------------------------------------------------------------------
| Personal Details
|--------------------------------------------------------------------------
*/

const PersonalDetails = ({
  className,
  formik,
}) => {
  return (
    <div
      className={cn(
        "bg-white rounded-xl p-5",
        className
      )}
    >
      <div className="flex items-center gap-3 border-b-2 pb-4">
        <p className="bg-app-ash-1 w-8 aspect-square rounded-full grid place-items-center font-bold">
          1
        </p>

        <Heading className="text-black">
          Personal Details
        </Heading>
      </div>

      <div className="@container py-4 grid gap-3">
        <Input
          placeholder="Your Full Name"
          formik={formik}
          name="name"
          className="rounded-sm border-none bg-app-ash-1"
        />

        <div className="grid w-full gap-3 @md:grid-cols-2">
          <Input
            placeholder="Your Email"
            formik={formik}
            name="email"
            className="rounded-sm border-none bg-app-ash-1"
          />

          <Input
            placeholder="Your Phone"
            formik={formik}
            name="phone"
            className="rounded-sm border-none bg-app-ash-1"
          />
        </div>
      </div>
    </div>
  );
};

/*
|--------------------------------------------------------------------------
| Secondary Delivery Details
|--------------------------------------------------------------------------
*/

export const SecondaryDeliveryDetails = ({
  formik,
  user,
}) => {
  const [addresses, setAddresses] =
    useState([]);

  const [selectedId, setSelectedId] =
    useState(null);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  /*
   * Delete modal
   */
  const [
    addressToDelete,
    setAddressToDelete,
  ] = useState(null);

  const [
    showDeleteModal,
    setShowDeleteModal,
  ] = useState(false);

  const [isDeleting, setIsDeleting] =
    useState(false);

  /*
   * Build addresses when user loads.
   */
  useEffect(() => {
    if (!user) {
      return;
    }

    /*
     * Default address comes from the user's
     * main profile.
     */
    const defaultAddress = {
      id: "default",

      label: "Default Address",

      name:
        user.name || "",

      phone:
        user.phoneNumber || "",

      street1:
        user.street1 || "",

      street2:
        user.street2 || "",

      zipCode:
        user.zipCode || "",

      city:
        user.city || "",

      /*
       * IMPORTANT:
       * Resolve the actual delivery state.
       */
      state:
        resolveDeliveryState(user),

      country:
        user.country || "Nigeria",

      isDefault: true,
    };

    /*
     * Saved addresses
     */
    const savedAddresses =
      (user.addresses || [])
        .filter(
          (address) =>
            address?._id !== "default"
        )
        .map(
          (address, index) => ({
            id:
              address._id ||
              `saved-${index}`,

            label:
              address.label ||
              `Saved Address ${
                index + 1
              }`,

            name:
              address.name ||
              user.name ||
              "",

            phone:
              address.phone ||
              address.phoneNumber ||
              user.phoneNumber ||
              "",

            street1:
              address.street1 ||
              address.address ||
              "",

            street2:
              address.street2 ||
              "",

            zipCode:
              address.zipCode ||
              "",

            city:
              address.city ||
              "",

            /*
             * Resolve state here too.
             */
            state:
              resolveDeliveryState(
                address
              ),

            country:
              address.country ||
              "Nigeria",

            ...address,

            state:
              resolveDeliveryState(
                address
              ),
          })
        );

    const allAddresses = [
      defaultAddress,
      ...savedAddresses,
    ];

    setAddresses(
      allAddresses
    );

    /*
     * Automatically select default address.
     */
    if (allAddresses.length > 0) {
      setSelectedId(
        allAddresses[0].id
      );

      handleSelectAddress(
        allAddresses[0],
        formik
      );
    }
  }, [user]);

 
  const handleSelectAddress = (
    address,
    formikInstance = formik
  ) => {
    if (!address) {
      return;
    }

    const resolvedState =
      resolveDeliveryState(
        address
      );

    setSelectedId(
      address.id
    );

    formikInstance.setValues(
      (previousValues) => ({
        ...previousValues,

        name:
          address.name ||
          user?.name ||
          "",

        phone:
          address.phone ||
          address.phoneNumber ||
          user?.phoneNumber ||
          "",

        street1:
          address.street1 ||
          address.address ||
          "",

        street2:
          address.street2 ||
          "",

        zipCode:
          address.zipCode ||
          "",

        city:
          address.city ||
          "",

        /*
         * THIS is what OrderSummary eventually
         * receives.
         */
        state:
          resolvedState,

        country:
          address.country ||
          "Nigeria",
      })
    );
  };

  const handleAddAddress = async (newAddress) => {
  if (!user?._id) {
    toast.error(
      "Unable to add address. User information is missing."
    );
    return;
  }

  try {
    // Only send the NEW address.
    // Do not send the existing addresses array.
    const payload = {
      street1: newAddress.street1 || "",
      street2: newAddress.street2 || "",
      zipCode: newAddress.zipCode || "",
      city: newAddress.city || "",
      state: normalizeState(newAddress.state),
      country: newAddress.country || "Nigeria",
      phone:
        newAddress.phone ||
        user.phoneNumber ||
        "",
    };

    console.log("Address being sent:", payload);

    await axios.post(
      `${BASE_URL_V1}/add/sa/${user._id}`,
      payload
    );

    toast.success(
      "Address added successfully!"
    );

    setIsModalOpen(false);

    // Reload so the newly saved address is
    // fetched from the backend.
    setTimeout(() => {
      window.location.reload();
    }, 800);
  } catch (error) {
    console.error(
      "Failed to add address:",
      error?.response?.data || error
    );

    toast.error(
      error?.response?.data?.message ||
        "Failed to add address. Please try again."
    );
  }
};

  const handleDeleteClick = (
    address
  ) => {
    if (!address?._id && !address?.id) {
      return;
    }

    /*
     * Never allow the default profile address
     * to be deleted.
     */
    if (
      address.id === "default"
    ) {
      return;
    }

    setAddressToDelete(
      address
    );

    setShowDeleteModal(true);
  };

  /*
   * Delete address
   */
  const handleConfirmDelete =
    async () => {
      const addressId =
        addressToDelete?._id ||
        addressToDelete?.id;

      if (
        !addressId ||
        !user?._id
      ) {
        toast.error(
          "Unable to delete address."
        );

        return;
      }

      try {
        setIsDeleting(true);

        await axios.post(
          `${BASE_URL_V1}/remove/sa/${user._id}/${addressId}`
        );

        /*
         * Remove deleted address from UI immediately.
         */
        setAddresses(
          (previousAddresses) =>
            previousAddresses.filter(
              (address) =>
                (
                  address._id ||
                  address.id
                ) !== addressId
            )
        );

        
        if (
          selectedId === addressId
        ) {
          const defaultAddress =
            addresses.find(
              (address) =>
                address.id ===
                "default"
            );

          if (defaultAddress) {
            handleSelectAddress(
              defaultAddress
            );
          }
        }

        setShowDeleteModal(
          false
        );

        setAddressToDelete(
          null
        );

        /*
         * Toast notification
         */
        toast.success(
          "Address deleted successfully!"
        );
      } catch (error) {
        console.error(
          "Failed to delete address:",
          error?.response?.data ||
            error
        );

        toast.error(
          error?.response?.data?.message ||
            "Failed to delete address. Please try again."
        );
      } finally {
        setIsDeleting(false);
      }
    };

  return (
    <div className="rounded-xl bg-white p-5">
      <div className="flex items-center gap-3 border-b-2 pb-4">
        <p className="grid aspect-square w-8 place-items-center rounded-full bg-app-ash-1 font-bold">
          3
        </p>

        <Heading className="text-black">
          Choose Delivery Details
        </Heading>
      </div>

      <div className="grid gap-4 py-4">
        {addresses.map((address, index) => {
            const addressTitle =
                address.id === "default"
                    ? "Default Address"
                    : address.label || `Address ${index}`;


        const isSelected = selectedId === address.id;

        const fullAddress = [
            address.street1,
            address.street2,
            address.city,
            address.state,
            address.country,
        ]
            .filter(Boolean)
            .join(", ");

        return (
            <div
                key={address.id}
                onClick={() => handleSelectAddress(address)}
                className={cn(
                    "relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200",
                    isSelected
                        ? "border-black bg-gray-50"
                        : "border-gray-200 bg-white hover:border-gray-400"
                )}
            >
                {/* Top section */}
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">

                        {/* Radio */}
                        <div
                            className={cn(
                                "mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2",
                                isSelected
                                    ? "border-black"
                                    : "border-gray-300"
                            )}
                        >
                            {isSelected && (
                                <div className="h-2.5 w-2.5 rounded-full bg-black" />
                            )}
                        </div>

                        {/* Address title and location */}
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <h4 className="font-semibold text-gray-900">
                                    {addressTitle}
                                </h4>

                                {address.id === "default" && (
                                    <span className="rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-semibold text-green-700">
                                        Primary
                                    </span>
                                )}

                                {isSelected && (
                                    <span className="rounded-full bg-black px-2.5 py-1 text-[11px] font-semibold text-white">
                                        Selected
                                    </span>
                                )}
                            </div>

                            <p className="mt-1 text-sm text-gray-500">
                              {address.city
                                ? address.city.replace(/\b\w/g, (char) => char.toUpperCase())
                                : "City not provided"}
                              {address.state &&
                                `, ${address.state.replace(/\b\w/g, (char) => char.toUpperCase())}`}
                            </p>
                        </div>
                    </div>

                    {/* Edit / Remove area */}
                    {address.id !== "default" && (
                        <button
                            type="button"
                            onClick={(event) => {
                                event.stopPropagation();
                                handleDeleteClick(address);
                            }}
                            className="shrink-0 text-sm font-medium text-red-500 hover:text-red-700"
                        >
                            Remove
                        </button>
                    )}
                </div>

                {/* Address details */}
                <div className="mt-4 ml-8">
                    <p className="text-sm leading-6 text-gray-700">
                        {fullAddress || "No delivery address provided"}
                    </p>

                    {address.phone && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                            <Icon
                                icon="mdi:phone-outline"
                                className="text-base"
                            />

                            <span>
                                {address.phone}
                            </span>
                        </div>
                    )}
                </div>

                {/* Selected action */}
                <div className="mt-4 ml-8 flex items-center justify-between gap-3 border-t pt-3">
                    <button
                        type="button"
                        onClick={(event) => {
                            event.stopPropagation();
                            handleSelectAddress(address);
                        }}
                        className={cn(
                            "text-sm font-semibold transition-colors",
                            isSelected
                                ? "text-black"
                                : "text-gray-500 hover:text-black"
                        )}
                    >
                        {isSelected
                            ? "✓ Deliver to this address"
                            : "Use this address"}
                    </button>

                    {address.zipCode && (
                        <span className="text-xs text-gray-400">
                            {address.zipCode}
                        </span>
                    )}
                </div>
            </div>
        );
    })}


    </div>

    <Button
    type="button"
    onClick={() => setIsModalOpen(true)}
    className="mt-2 w-full bg-black text-white"

    >    
    + Add New Address
    </Button>

        {/* here */}
      {isModalOpen && (
        <AddNewAddressModal
          onClose={() =>
            setIsModalOpen(false)
          }
          onAdd={
            handleAddAddress
          }
        />
      )}

      {showDeleteModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-address-title"
        >
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <h2
                id="delete-address-title"
                className="text-lg font-semibold text-gray-900"
              >
                Delete Address
              </h2>

              <button
                type="button"
                onClick={() => {
                  if (!isDeleting) {
                    setShowDeleteModal(
                      false
                    );

                    setAddressToDelete(
                      null
                    );
                  }
                }}
                disabled={
                  isDeleting
                }
                aria-label="Close modal"
                className="text-2xl leading-none text-gray-500 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                &times;
              </button>
            </div>

            <p className="mt-4 text-sm leading-6 text-gray-600">
              Are you sure you want to
              delete this address? This
              action cannot be undone.
            </p>

            {addressToDelete && (
              <div className="mt-4 rounded-lg bg-gray-50 p-3">
                <p className="text-sm font-semibold text-gray-900">
                  {addressToDelete.name ||
                    "Saved Address"}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {[
                    addressToDelete.street1,
                    addressToDelete.city,
                    addressToDelete.state,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(
                    false
                  );

                  setAddressToDelete(
                    null
                  );
                }}
                disabled={
                  isDeleting
                }
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleConfirmDelete
                }
                disabled={
                  isDeleting
                }
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting
                  ? "Deleting..."
                  : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/*
|--------------------------------------------------------------------------
| Payment Method
|--------------------------------------------------------------------------
*/

const PaymentMethod = ({
  className,
  setProvider,
  provider,
}) => {
  const handleProviderChange = (
    event
  ) => {
    setProvider(
      event.target.value
    );
  };

  return (
    <div
      className={cn(
        "bg-white rounded-xl p-5",
        className
      )}
    >
      <div className="flex items-center gap-3 border-b-2 pb-4">
        <p className="bg-app-ash-1 w-8 aspect-square rounded-full grid place-items-center font-bold">
          4
        </p>

        <Heading className="text-black">
          Payment Method
        </Heading>
      </div>

      <div className="py-4 grid gap-4">
        <div className="flex gap-6">

          <div
            className={`flex items-center gap-2 p-2 rounded-lg ${
              provider === "monnify"
                ? "bg-gray-100"
                : ""
            }`}
          >
            <input
              type="radio"
              id="monnify"
              name="paymentProvider"
              value="monnify"
              checked={
                provider ===
                "monnify"
              }
              onChange={
                handleProviderChange
              }
            />

            <label
              htmlFor="monnify"
              className="flex items-center gap-2"
            >
              <img
                src="/monnify-logo.jpeg"
                className="w-18 h-10"
                alt="monnify-logo"
              />
            </label>
          </div>

          <div
            className={`flex items-center p-2 rounded-lg gap-2 ${
              provider === "opay"
                ? "bg-gray-100"
                : ""
            }`}
          >
            <input
              type="radio"
              id="opay"
              name="paymentProvider"
              value="opay"
              checked={
                provider === "opay"
              }
              onChange={
                handleProviderChange
              }
            />

            <label
              htmlFor="opay"
              className="flex items-center gap-2"
            >
              <img
                src="/opay-logo.png"
                className="w-28 h-18"
                alt="opay-logo"
              />
            </label>
          </div>

        </div>
      </div>
    </div>
  );
};