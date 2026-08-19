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
import { DeleteAddressModal } from "../components/ui/DeleteAddressModal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/accordion";

const BASE_URL_V2 = 'https://mkhasa-bfdb6fabd978.herokuapp.com/api/v2';
const BASE_URL_V1 = process.env.NEXT_PUBLIC_BASE_URL || 'https://mkhasa-bfdb6fabd978.herokuapp.com/api/v1';

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

// ─── Monnify Bank Transfer Screen ─────────────────────────────────────────────

const MonnifyTransferScreen = ({ accountDetails, paymentReference, onPaid }) => {
  const [monnifyStatus, setMonnifyStatus] = useState<"pending" | "paid" | "expired">("pending");
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // Countdown timer
  useEffect(() => {
    if (!accountDetails?.expiresAt) return;

    const tick = () => {
      const diff = new Date(accountDetails.expiresAt).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft("Expired");
        setMonnifyStatus("expired");
        if (countdownRef.current) clearInterval(countdownRef.current);
        if (pollingRef.current) clearInterval(pollingRef.current);
        return;
      }
      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${m}m ${s.toString().padStart(2, "0")}s`);
    };

    tick();
    countdownRef.current = setInterval(tick, 1000);
    return () => { if (countdownRef.current) clearInterval(countdownRef.current); };
  }, [accountDetails?.expiresAt]);

  // Poll for payment status every 5 seconds
  useEffect(() => {
    if (!paymentReference) return;

    const poll = async () => {
      try {
        const res = await axios.get(`${BASE_URL_V1}/payment/monnify/status/${paymentReference}`);
        const data = res.data;
        if (data.paymentStatus === "paid") {
          setMonnifyStatus("paid");
          if (pollingRef.current) clearInterval(pollingRef.current);
          if (countdownRef.current) clearInterval(countdownRef.current);
          onPaid?.();
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    };

    pollingRef.current = setInterval(poll, 5000);
    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, [paymentReference]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  // ── Paid state ──
  if (monnifyStatus === "paid") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <Icon icon="mdi:check-circle" className="text-green-600 text-4xl" />
        </div>
        <h2 className="text-2xl font-bold text-green-600">Payment Confirmed!</h2>
        <p className="text-gray-600">Your order has been placed successfully.</p>
        <Button
          onClick={() => router.push("/account/order-history")}
          className="bg-black text-white px-8 py-3 rounded-full mt-2"
        >
          View My Orders
        </Button>
      </div>
    );
  }

  // ── Expired state ──
  if (monnifyStatus === "expired") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
          <Icon icon="mdi:clock-alert" className="text-red-500 text-4xl" />
        </div>
        <h2 className="text-2xl font-bold text-red-500">Transfer Account Expired</h2>
        <p className="text-gray-600">The temporary account has expired. Please retry checkout.</p>
        <Button
          onClick={() => router.push("/checkout")}
          className="bg-black text-white px-8 py-3 rounded-full mt-2"
        >
          Retry Checkout
        </Button>
      </div>
    );
  }

  // ── Pending state — show transfer details ──
  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-full bg-yellow-50 flex items-center justify-center mx-auto mb-3">
          <Icon icon="mdi:bank-transfer" className="text-yellow-600 text-3xl" />
        </div>
        <h2 className="text-xl font-bold">Complete Your Transfer</h2>
        <p className="text-sm text-gray-500 mt-1">Transfer the exact amount to the account below</p>
      </div>

      <div className="bg-gray-50 rounded-2xl p-6 space-y-4 border">

        {/* Amount */}
        <div className="text-center pb-4 border-b">
          <p className="text-sm text-gray-500 mb-1">Amount to Transfer</p>
          <p className="text-3xl font-bold text-black">
            ₦{accountDetails?.amount?.toLocaleString()}
          </p>
        </div>

        {/* Bank name */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Bank Name</span>
          <span className="font-semibold text-sm">{accountDetails?.bankName}</span>
        </div>

        {/* Account number with copy */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Account Number</span>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg tracking-widest">{accountDetails?.accountNumber}</span>
            <button
              onClick={() => handleCopy(accountDetails?.accountNumber)}
              className="text-xs bg-black text-white px-2 py-1 rounded"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        {/* Account name */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Account Name</span>
          <span className="font-semibold text-sm">{accountDetails?.accountName}</span>
        </div>

        {/* USSD code */}
        {accountDetails?.ussdCode && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">USSD Code</span>
            <span className="font-mono text-sm font-semibold">{accountDetails?.ussdCode}</span>
          </div>
        )}

        {/* Expiry countdown */}
        <div className="flex justify-between items-center pt-4 border-t">
          <span className="text-sm text-gray-500">Expires In</span>
          <span className={`font-bold text-sm ${timeLeft === "Expired" ? "text-red-500" : "text-orange-500"}`}>
            {timeLeft || "Loading..."}
          </span>
        </div>
      </div>

      {/* Waiting indicator */}
      <div className="flex items-center justify-center gap-2 mt-6 text-gray-500 text-sm">
        <Icon icon="svg-spinners:6-dots-rotate" style={{ fontSize: 18 }} />
        <span>Waiting for payment confirmation...</span>
      </div>

      <p className="text-xs text-gray-400 text-center mt-3">
        This page will update automatically once your transfer is received.
      </p>
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────

export const Component = () => {
  const schema = yup.object().shape({
    email: yup.string().email().required(),
    phone: yup.string().required(),
    city: yup.string().required(),
    state: yup.string().required(),
    country: yup.string().required(),
    name: yup.string().required(),
    street1: yup.string().required(),
  });

  const { data, refetch } = useCartQuery();
  const [couponCode, setCouponCode] = useState(null);

  // Monnify bank transfer state
  const [monnifyScreen, setMonnifyScreen] = useState(false);
  const [monnifyAccountDetails, setMonnifyAccountDetails] = useState(null);
  const [monnifyReference, setMonnifyReference] = useState("");
  const [monnifyPaid, setMonnifyPaid] = useState(false);

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
      const address = `${values.street1}, ${values.city}`;
      const payload = { ...values, address, ...(couponCode && { couponCode }) };
      delete payload.street1;
      mutation.mutate(payload);
    },
  });

  const [provider, setProvider] = useState("monnify");
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const { getUserId, getUserWithId } = useAuth();

  const mutation = useMutation({
    mutationFn: (payload) => {
      sessionStorage.getItem("items_to_buy", JSON.stringify(data));
      return axios.post(`${BASE_URL_V2}/orders/create/${getUserId()}`, {
        provider,
        // For monnify, lock to bank transfer
        ...(provider === "monnify" && { paymentMethod: "ACCOUNT_TRANSFER" }),
        ...payload,
      });
    },
    onSuccess: (res) => {
      const responseData = res.data;

      // ── Monnify bank transfer flow ──
      if (provider === "monnify") {
        const accountDetails = responseData?.payment?.accountDetails;
        const paymentReference = responseData?.code || responseData?.payment?.paymentReference;

        if (accountDetails) {
          // Show inline bank transfer screen
          setMonnifyAccountDetails(accountDetails);
          setMonnifyReference(paymentReference);
          setMonnifyScreen(true);
          return;
        }

        // Fallback: accountDetails missing but paymentLink exists
        if (responseData?.paymentLink) {
          window.location.href = responseData.paymentLink;
          return;
        }

        // Both missing — show error
        console.error("Monnify: no account details or payment link returned");
        return;
      }

      // ── All other providers — redirect to payment link ──
      const { paymentLink } = responseData;
      if (paymentLink) {
        window.location.href = paymentLink;
      } else {
        console.error("Payment link is missing from the response");
      }
    },
    onError: (error) => {
      console.error("Error creating order:", error);
    },
  });

  const fetchUser = async () => {
    try {
      const id = getUserId();
      const res = await getUserWithId(id);
      setUser(res.user);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
    axios.get(`/get/user/${getUserId()}`).then((res) => {
      formik.setValues((prevValues) => ({
        ...prevValues,
        email: res.data.user.email,
        phone: res.data.user.phoneNumber,
        address: res.data.user.address,
        street1: res.data.user.street1,
        name: res.data.user.name,
        city: prevValues.city || res.data.user.city,
        state: prevValues.state || res.data.user.state,
        country: prevValues.country || res.data.user.country || "Nigeria",
      }));
    });
  }, []);

  useEffect(() => {
    if (formik.values.state) {
      formik.setFieldValue("country", "Nigeria");
    }
  }, [formik.values.state]);

  if (isLoading) return <LoadingSpinner />;

  // ── Show Monnify bank transfer screen after order creation ──
  if (monnifyScreen) {
    return (
      <Wrapper className="py-8">
        <MonnifyTransferScreen
          accountDetails={monnifyAccountDetails}
          paymentReference={monnifyReference}
          onPaid={() => setMonnifyPaid(true)}
        />
      </Wrapper>
    );
  }

  return (
    <main>
      <Wrapper className="py-4">
        <div className="grid gap-6 md:grid-cols-12">
          <form
            onSubmit={formik.handleSubmit}
            id="checkout-form"
            className="grid md:col-span-6 lg:col-span-7 xl:col-span-8"
          >
            <PersonalDetails formik={formik} />
            <DeliveryDetails formik={formik} />
            <SecondaryDeliveryDetails formik={formik} user={user} />
            <PaymentMethod setProvider={setProvider} provider={provider} />
          </form>
          <div className="md:col-span-6 lg:col-span-5 xl:col-span-4">
            <CartSummary
              data={data}
              isPending={mutation.isPending}
              deliveryState={formik.values.state}
              payStackSelected={provider === "paystack"}
              refetchCart={refetch}
              onCouponVerified={setCouponCode}
            />
          </div>
        </div>
      </Wrapper>
    </main>
  );
};

// ─── Cart Summary ──────────────────────────────────────────────────────────────

const CartSummary = ({ className, isPending, deliveryState, payStackSelected, data, refetchCart, onCouponVerified }) => {
  const { user } = useAuth();
  const { getCartFromLocalStorage, cartQuantityChanged } = useCartContext();
  const [coupon, setCoupon] = useState();
  const [submitting, setSubmitting] = useState(false);
  const [couponMessage, setCouponMessage] = useState(null);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [guestCart, setGuestCart] = useState([]);

  useEffect(() => {
    if (!user) setGuestCart(getCartFromLocalStorage());
  }, [cartQuantityChanged, user]);

  const submitCoupon = async () => {
    if (!coupon) return;
    setSubmitting(true);
    setCouponMessage(null);
    try {
      const res = await axios.post("/coupon", { couponCode: coupon });
      if (res.data?.success) {
        setCouponMessage({ type: "success", text: res.data.message });
        setDiscountPercent(res.data.discount ?? 0);
        onCouponVerified?.(coupon);
        await refetchCart();
      } else {
        setCouponMessage({ type: "error", text: res.data?.message || "Invalid coupon" });
        setDiscountPercent(0);
      }
    } catch (error) {
      setCouponMessage({ type: "error", text: error.response?.data?.message || "Failed to apply coupon" });
      setDiscountPercent(0);
    } finally {
      setSubmitting(false);
    }
  };

  const hasItems = user ? (data?.items?.length > 0) : (guestCart?.length > 0);

  return (
    <div className={cn("bg-white rounded-xl p-5", className)}>
      <div className="flex items-center gap-3 border-b-2 pb-4">
        <Heading className="text-app-black">Item(s)</Heading>
      </div>
      <div>
        {user ? <CartItems isCheckout /> : <GuestCartItems isCheckout />}
        <OrderSummary state={deliveryState} payStackSelected={payStackSelected} discountPercent={discountPercent} />
        <form
          onSubmit={(e) => { e.preventDefault(); submitCoupon(); }}
          className="flex justify-between items-end gap-6 my-4"
        >
          <div>
            <label htmlFor="CouponCode" className="font-semibold">Coupon Code</label>
            <input
              placeholder="CouponCode"
              id="CouponCode"
              onChange={(e) => setCoupon(e.target.value)}
              className="border-black border p-2"
            />
          </div>
          <Button className="btn" disabled={submitting}>
            {submitting ? <Icon icon="svg-spinners:6-dots-rotate" style={{ fontSize: 16 }} /> : "Apply"}
          </Button>
        </form>
        {couponMessage && (
          <p className={couponMessage.type === "success" ? "text-green-600" : "text-app-red"}>
            {couponMessage.text}
          </p>
        )}
        {hasItems && (
          <Button
            type="submit"
            form="checkout-form"
            variant="rectangle"
            className="bg-[#27D34C] text-white md:px-8 rounded-none md:py-3 w-full px-10 focus:outline-none font-bold mt-6"
          >
            {isPending ? (
              <Icon icon="svg-spinners:6-dots-rotate" style={{ fontSize: 20 }} className="text-center" />
            ) : (
              "Pay Now"
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

// ─── Personal Details ──────────────────────────────────────────────────────────

const PersonalDetails = ({ className, formik }) => (
  <div className={cn("bg-white rounded-xl p-5", className)}>
    <div className="flex items-center gap-3 border-b-2 pb-4">
      <p className="bg-app-ash-1 w-8 aspect-square rounded-full grid place-items-center font-bold">1</p>
      <Heading className="text-black">Personal Details</Heading>
    </div>
    <div className="@container py-4 grid gap-3">
      <Input placeholder="Your Full Name" formik={formik} name="name" className="rounded-sm border-none bg-app-ash-1" />
      <div className="grid w-full gap-3 @md:grid-cols-2">
        <Input placeholder="Your Email" formik={formik} name="email" className="rounded-sm border-none bg-app-ash-1" />
        <Input placeholder="Your Phone" formik={formik} name="phone" className="rounded-sm border-none bg-app-ash-1" />
      </div>
    </div>
  </div>
);

// ─── Delivery Details ──────────────────────────────────────────────────────────

const DeliveryDetails = ({ className, formik }) => (
  <div className={cn("bg-white rounded-xl p-5", className)}>
    <div className="flex items-center gap-3 border-b-2 pb-4">
      <p className="bg-app-ash-1 w-8 aspect-square rounded-full grid place-items-center font-bold">2</p>
      <Heading className="text-black">Delivery Details</Heading>
    </div>
    <div className="@container py-4 grid gap-3">
      <div className="grid gap-3 grid-cols-12">
        <div className="col-span-12 @sm:col-span-8">
          <Input type="text" placeholder="Street" formik={formik} name="street1" className="bg-app-ash-1 border-none rounded-sm" />
        </div>
        <div className="col-span-12 @sm:col-span-4">
          <Input type="text" placeholder="City" formik={formik} name="city" className="bg-app-ash-1 border-none rounded-sm" />
        </div>
      </div>
      <div className="grid gap-3 grid-cols-12">
        <div className="col-span-12 @sm:col-span-6">
          <div className="py-2 w-full bg-app-ash-1 md:mt-2">
            {formik && (
              <select {...formik?.getFieldProps("state")} className="bg-app-ash-1 rounded-sm w-full py-1 px-6 outline-none">
                <option value="">Select State</option>
                {states.map(({ name, value }, i) => (
                  <option key={i} value={value} className="bg-app-ash-1 w-full">{name}</option>
                ))}
              </select>
            )}
            {formik.touched.state && formik.errors.state && (
              <p className="text-app-red">{formik.errors.state}</p>
            )}
          </div>
        </div>
        <div className="col-span-12 @sm:col-span-6">
          <Input type="text" placeholder="Country" formik={formik} name="country" className="bg-app-ash-1 border-none rounded-sm" />
        </div>
      </div>
    </div>
  </div>
);

// ─── Secondary Delivery Details ────────────────────────────────────────────────

export const SecondaryDeliveryDetails = ({ formik, user }) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openRemoveModal, setOpenRemoveModal] = useState(false);
  const [addressToDeleteId, setAddressToDeleteId] = useState(false);

  useEffect(() => {
    // const defaultAddr = {
    //   id: "default", label: "Default Address",
    //   street1: user?.street1 || "", street2: user?.street2 || "",
    //   zipCode: user?.zipCode || "", city: user?.city || "",
    //   state: user?.state || "", country: user?.country || "",
    //   phone: user?.phoneNumber || "",
    // };
    const defaultAddr = {
      id: "default", label: "Default Address",
      street1: user?.street1 || "", street2: user?.street2 || "",
      zipCode: user?.zipCode || "", city: user?.city || "",
      state: user?.state || "", country: user?.country || "Nigeria",
      phone: user?.phoneNumber || "",
    };
    const savedAddresses = (user?.addresses || []).map((addr) => ({ id: addr._id, label: "Saved Address", ...addr }));
    const allAddresses = [defaultAddr, ...savedAddresses];
    setAddresses(allAddresses);
    setSelectedId(allAddresses[0]?.id);
    if (allAddresses[0]) handleSelectAddress(allAddresses[0], formik);
  }, [user]);

  const handleSelectAddress = (addr, formikInstance = formik) => {
    setSelectedId(addr.id);
    formikInstance.setValues((prev) => ({
      ...prev,
      street1: addr.street1 || "", street2: addr.street2 || "",
      zipCode: addr.zipCode || "", city: addr.city || "",
      state: addr.state || "", country: addr.country || prev.country || "Nigeria",
      phone: addr.phone || "",
    }));
  };

  const handleAddAddress = (addresses) => {
    const formatted = addresses.map((addr, idx) => ({ id: addr._id, ...addr, label: idx === 0 ? "Default Address" : "Saved Address" }));
    setAddresses(formatted);
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white rounded-xl p-5">
      <div className="flex items-center gap-3 border-b-2 pb-4">
        <p className="bg-app-ash-1 w-8 aspect-square rounded-full grid place-items-center font-bold">3</p>
        <Heading className="text-black">Choose Delivery Details</Heading>
      </div>
      <div className="py-4 grid gap-4">
        {addresses.map((addr, index) => (
          <Accordion type="single" className="w-full" collapsible defaultValue={"default address"} key={addr.id}>
            <AccordionItem value={addr.label.toLowerCase()}>
              <AccordionTrigger className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-4">
                  <div className="border-blue-500 rounded-full border flex items-center justify-center h-8 w-8" onClick={() => handleSelectAddress(addr)}>
                    <label key={addr.id} className={`w-6 h-6 rounded-full ${selectedId === addr.id ? "bg-blue-500" : ""}`} />
                  </div>
                  <p className="font-semibold">{addr.label.toLowerCase() !== "default address" ? `${addr.label} ${index}` : addr.label}</p>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Card className="flex flex-col gap-2 border p-3 rounded-md cursor-pointer transition-all duration-200">
                  <p className="font-semibold">{addr.label.toLowerCase() !== "default address" ? `${addr.label} ${index}` : addr.label}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { placeholder: "Street 1", field: "street1", value: addr.street1 },
                      { placeholder: "Street 2", field: "street2", value: addr.street2 },
                      { placeholder: "Zip Code", field: "zipCode", value: addr.zipCode },
                      { placeholder: "City", field: "city", value: addr.city },
                      { placeholder: "State", field: "state", value: addr.state },
                      // { placeholder: "Country", field: "country", value: addr.country },
                      { placeholder: "Country", field: "country", value: formik.values.country || addr.country || "Nigeria" }, // 👈 reads formik first
                      { placeholder: "Phone", field: "phone", value: addr.phone },
                    ].map(({ placeholder, field, value }) => (
                      <Input key={field} formik={formik} placeholder={placeholder} value={value}
                        onChange={(e) => formik.setFieldValue(field, e.target.value)}
                        className="bg-app-ash-1 border-none rounded-sm" />
                    ))}
                  </div>
                  <p className="text-app-red underline mt-4" onClick={() => { setOpenRemoveModal(true); setAddressToDeleteId(addr.id); }}>
                    Remove this address
                  </p>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
      <Button onClick={() => setIsModalOpen(true)} className="mt-4 bg-black text-white w-full">+ Add New Address</Button>
      {isModalOpen && <AddNewAddressModal userId={user._id} onClose={() => setIsModalOpen(false)} onAdd={handleAddAddress} />}
      {openRemoveModal && (
        <DeleteAddressModal
          userId={user._id}
          addressId={addressToDeleteId}
          onClose={() => setOpenRemoveModal(false)}
          onDelete={(deletedId) => setAddresses(prev => prev.filter(addr => addr.id !== deletedId))}
        />
      )}
    </div>
  );
};

// ─── Payment Method ────────────────────────────────────────────────────────────

const PaymentMethod = ({ className, setProvider, provider }) => {
  const handleProviderChange = (event) => setProvider(event.target.value);

  return (
    <div className={cn("bg-white rounded-xl p-5", className)}>
      <div className="flex items-center gap-3 border-b-2 pb-4">
        <p className="bg-app-ash-1 w-8 aspect-square rounded-full grid place-items-center font-bold">4</p>
        <Heading className="text-black">Payment Method</Heading>
      </div>
      <div className="py-4 grid gap-4">
        <div className="flex gap-6">
          <div className={`flex items-center gap-2 p-2 rounded-lg ${provider === "monnify" && "bg-gray-100"}`}>
            <input type="radio" id="monnify" name="paymentProvider" value="monnify" checked={provider === "monnify"} onChange={handleProviderChange} />
            <label htmlFor="monnify" className="flex items-center gap-2">
              <img src="/monnify-logo.jpeg" className="w-18 h-10" alt="monnify-logo" />
            </label>
          </div>
          <div className={`flex items-center p-2 rounded-lg gap-2 ${provider === "opay" && "bg-gray-100"}`}>
            <input type="radio" id="opay" name="paymentProvider" value="opay" checked={provider === "opay"} onChange={handleProviderChange} />
            <label htmlFor="opay" className="flex items-center gap-2">
              <img src="/opay-logo.png" className="w-28 h-18" alt="opay-logo" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
