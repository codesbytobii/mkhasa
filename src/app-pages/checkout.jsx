"use client";

// import { CartItems } from "../components/Cart";
import { CartItems as GuestCartItems } from "../components/GuestCart";
import { useCartContext } from "../hooks/utils/useCart";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/Button";
import { Navigation } from "../components/ui/Navigation";
import { Wrapper } from "../components/ui/Wrapper";
import { useCartQuery } from "../hooks/query/useCart";
import { Heading } from "../components/Heading";
import { OrderSummary } from "../components/OrderTotal";
import { CartItems } from "../components/Cart";
import { cn } from "../utils/cn";
import React, { useState, useEffect } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../hooks/utils/useAuth";
import axios from "../utils/axios";
import { useMutation } from "@tanstack/react-query";
import { Icon } from "@iconify/react";
import { Input } from "../components/Input";
import * as yup from "yup";
import { useFormik } from "formik";
import paystackImg from "../assets/images/paystack.svg";
import flutterImg from "../assets/images/flutter1.svg";

import { AddNewAddressModal } from "../components/ui/AddNewAddressModal";
import { Card } from "../components/card";
import { DeleteAddressModal } from "../components/ui/DeleteAddressModal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/accordion";

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
  const { data } = useCartQuery();


  const formik = useFormik({
    initialValues: {
      name: "",
      street1: "", // Add street1 for address
      email: "",
      phone: "",
      city: "",
      state: "",
      country: "",
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      // Concatenate street and city to create address
      const address = `${values.street1}, ${values.city}`;
      const payload = { ...values, address };
      delete payload.street1; // Remove street1 from the payload
      mutation.mutate(payload);
    },
  });


  const [provider, setProvider] = useState("monnify");
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(true);

  useEffect(() => {
    // Simulate loading or fetch data here
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Adjust this time as needed

    return () => clearTimeout(timer);
  }, []);
  // const {} = useAuth()

  const { getUserId, getUserWithId } = useAuth();

  const mutation = useMutation({
    mutationFn: (payload) => {
      sessionStorage.getItem("items_to_buy", JSON.stringify(data))
      return axios.post(`create/order/${getUserId()}`, {
        provider,
        ...payload,
      });
    },
    onSuccess: (res) => {
      const { paymentLink } = res.data;
      if (paymentLink) {
        window.location.href = paymentLink;
      } else {
        console.error("Payment link is missing from the response");
      }
    },
    onError: (error) => {
      console.error("Error creating order:", error);
      // Handle error appropriately (e.g., show error message to user)
    },
  });
  const fetchUser = async () => {
    try {
      const id = getUserId()
      const res = await getUserWithId(id)
      setUser(res.user)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchUser()
    axios.get(`/get/user/${getUserId()}`).then((res) => {
      // console.log('User data:', res.data.user);
      formik.setValues((prevValues) => ({
        ...prevValues, // Spread the previous values to retain any user input
        email: res.data.user.email,
        phone: res.data.user.phoneNumber,
        address: res.data.user.address,
        street1: res.data.user.street1,
        name: res.data.user.name,
        // Only override city, state, country if they haven't been set by the user
        city: prevValues.city || res.data.user.city,
        state: prevValues.state || res.data.user.state,
        country: prevValues.country || res.data.user.country,
      }));
    });
  }, []);

  useEffect(() => {
    if (formik.values.state) {
      formik.setFieldValue("country", "Nigeria");
    }
  }, [formik.values.state]);

  if (isLoading) {
    return <LoadingSpinner />;
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
              payStackSelected={provider == "paystack" ? true : false}
            />
          </div>
        </div>
      </Wrapper>
    </main>
  );
};



const CartSummary = ({ className, isPending, deliveryState, payStackSelected, data }) => {
  const { user } = useAuth();
  const { getCartFromLocalStorage, cartQuantityChanged } = useCartContext();
  const [coupon, setCoupon] = useState();
  const [submitting, setSubmitting] = useState(false);
  const [guestCart, setGuestCart] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      setGuestCart(getCartFromLocalStorage());
    }
  }, [cartQuantityChanged, user]);

  const submitCoupon = async () => {
    setSubmitting(true);
    try {
      const res = await axios.post("/coupon", { couponCode: coupon });
      console.log(res.data);
      router.push("/fake-success");
    } catch (error) {
      console.log(error);
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
        {user ? (
          <CartItems isCheckout />
        ) : (
          <GuestCartItems isCheckout />
        )}
        <OrderSummary state={deliveryState} payStackSelected={payStackSelected} />
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
          <Button className="btn">Apply</Button>
        </form>

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

const PersonalDetails = ({ className, formik }) => {
  return (
    <div className={cn("bg-white rounded-xl p-5", className)}>
      <div className="flex items-center gap-3 border-b-2 pb-4">
        <p className="bg-app-ash-1 w-8 aspect-square rounded-full grid place-items-center font-bold">
          1
        </p>
        <Heading className="text-black">Personal Details</Heading>
      </div>
      <div className="@container py-4 grid gap-3">
        <div>
          <Input
            placeholder="Your Full Name"
            formik={formik}
            name="name"
            className="rounded-sm border-none bg-app-ash-1"
          />
        </div>

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

const DeliveryDetails = ({ className, formik }) => {


  return (
    <div className={cn("bg-white rounded-xl p-5", className)}>
      <div className="flex items-center gap-3 border-b-2 pb-4">
        <p className="bg-app-ash-1 w-8 aspect-square rounded-full grid place-items-center font-bold">
          2
        </p>
        <Heading className="text-black">Delivery Details</Heading>
      </div>
      <div className="@container py-4 grid gap-3">
        <div className="grid gap-3 grid-cols-12">
          <div className="col-span-12 @sm:col-span-8">
            <Input
              type="text"
              placeholder="Street"
              formik={formik}
              name="street1"
              className="bg-app-ash-1 border-none rounded-sm"
            />
          </div>
          <div className="col-span-12 @sm:col-span-4">
            <Input
              type="text"
              placeholder="City"
              formik={formik}
              name="city"
              className="bg-app-ash-1 border-none rounded-sm"
            />
          </div>
        </div>

        <div className="grid gap-3 grid-cols-12">
          <div className="col-span-12 @sm:col-span-6">
            {/* <Input
              type="text"
              placeholder="State"
              formik={formik}
              name="state"
              className="bg-app-ash-1 rounded-sm"
            /> */}
            <div className="py-2 w-full bg-app-ash-1 md:mt-2">
              {formik && (
                <select
                  {...formik?.getFieldProps("state")}
                  className="bg-app-ash-1 rounded-sm  w-full py-1 px-6 outline-none"
                >
                  <option value="" selected>
                    Select State
                  </option>
                  {states.map(({ name, value }, i) => (
                    <option key={i} value={value} className="bg-app-ash-1 w-full">
                      {name}
                    </option>
                  ))}
                </select>
              )}

              {formik.touched.state && formik.errors.state && (
                <p className="text-app-red"> {formik.errors.state}</p>
              )}
            </div>
          </div>
          <div className="col-span-12 @sm:col-span-6">
            <Input
              type="text"
              placeholder="Country"
              formik={formik}
              name="country"
              className="bg-app-ash-1 border-none rounded-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};



export const SecondaryDeliveryDetails = ({ formik, user }) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Initialize addresses
  useEffect(() => {
    const defaultAddr = {
      id: "default",
      label: "Default Address",
      street1: user?.street1 || "",
      street2: user?.street2 || "",
      zipCode: user?.zipCode || "",
      city: user?.city || "",
      state: user?.state || "",
      country: user?.country || "",
      phone: user?.phoneNumber || "",
    };

    const savedAddresses = (user?.addresses || []).map((addr) => ({
      id: addr._id,
      label: "Saved Address",
      ...addr,
    }));

    const allAddresses = [defaultAddr, ...savedAddresses];
    setAddresses(allAddresses);
    setSelectedId(allAddresses[0]?.id);

    // Initialize Formik with default address
    if (allAddresses[0]) {
      handleSelectAddress(allAddresses[0], formik);
    }
  }, [user]);

  const handleSelectAddress = (addr, formikInstance = formik) => {
    setSelectedId(addr.id);

    formikInstance.setValues((prev) => ({
      ...prev,
      street1: addr.street1 || "",
      street2: addr.street2 || "",
      zipCode: addr.zipCode || "",
      city: addr.city || "",
      state: addr.state || "",
      country: addr.country || "",
      phone: addr.phone || "",
    }));
  };

  const handleAddAddress = (addresses) => {
    const formatted = addresses.map((addr, idx) => ({ id: addr._id, ...addr, label: idx == 0 ? "Default Address" : "Saved Address" }))
    setAddresses(formatted);
    setIsModalOpen(false)
  };
  const [openRemoveModal, setOpenRemoveModal] = useState(false)
  const [addressToDeleteId, setAddressToDeleteId] = useState(false)

  return (
    <div className="bg-white rounded-xl p-5">
      <div className="flex items-center gap-3 border-b-2 pb-4">
        <p className="bg-app-ash-1 w-8 aspect-square rounded-full grid place-items-center font-bold">
          3
        </p>
        <Heading className="text-black">Choose Delivery Details</Heading>
      </div>

      <div className="py-4 grid gap-4">
        {addresses.map((addr, index) => (
          <Accordion
            type="single"
            className="w-full"
            collapsible
            defaultValue={"default address"}
          >
            <AccordionItem value={addr.label.toLowerCase()}>
              <AccordionTrigger className="flex items-center gap-2 justify-between" >
                <div className="flex items-center gap-4">
                  <div
                    className="border-blue-500 rounded-full border flex  items-center justify-center h-8 w-8"
                    onClick={() => {
                      handleSelectAddress(addr)
                    }}
                  >
                    <label
                      key={addr.id}
                      className={`w-6 h-6 rounded-full ${selectedId === addr.id ? "bg-blue-500" : ""}`}

                    ></label>
                  </div>
                  <p className="font-semibold">{addr.label.toLowerCase() != "default address" ? `${addr.label} ${index}` : addr.label}</p>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Card className="flex flex-col gap-2 border p-3 rounded-md cursor-pointer transition-all duration-200">
                  <p className="font-semibold">{addr.label.toLowerCase() != "default address" ? `${addr.label} ${index}` : addr.label}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      formik={formik}
                      placeholder="Street 1"
                      value={addr.street1}
                      onChange={(e) => formik.setFieldValue("street1", e.target.value)}
                      className="bg-app-ash-1 border-none rounded-sm"
                    />
                    <Input
                      formik={formik}
                      placeholder="Street 2"
                      value={addr.street2}
                      onChange={(e) => formik.setFieldValue("street2", e.target.value)}
                      className="bg-app-ash-1 border-none rounded-sm"
                    />
                    <Input
                      formik={formik}
                      placeholder="Zip Code"
                      value={addr.zipCode}
                      onChange={(e) => formik.setFieldValue("zipCode", e.target.value)}
                      className="bg-app-ash-1 border-none rounded-sm"
                    />
                    <Input
                      formik={formik}
                      placeholder="City"
                      value={addr.city}
                      onChange={(e) => formik.setFieldValue("city", e.target.value)}
                      className="bg-app-ash-1 border-none rounded-sm"
                    />
                    <Input
                      formik={formik}
                      placeholder="State"
                      value={addr.state}
                      onChange={(e) => formik.setFieldValue("state", e.target.value)}
                      className="bg-app-ash-1 border-none rounded-sm"
                    />
                    <Input
                      formik={formik}
                      placeholder="Country"
                      value={addr.country}
                      onChange={(e) => formik.setFieldValue("country", e.target.value)}
                      className="bg-app-ash-1 border-none rounded-sm"
                    />
                    <Input
                      formik={formik}
                      placeholder="Phone"
                      value={addr.phone}
                      onChange={(e) => formik.setFieldValue("phone", e.target.value)}
                      className="bg-app-ash-1 border-none rounded-sm"
                    />
                  </div>
                  <p className="text-app-red underline mt-4" onClick={() => {
                    setOpenRemoveModal(true)
                    setAddressToDeleteId(addr.id)

                  }}>Remove this address</p>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>

      <Button onClick={() => setIsModalOpen(true)} className="mt-4 bg-black text-white w-full">
        + Add New Address
      </Button>

      {isModalOpen && (
        <AddNewAddressModal
          userId={user._id}
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddAddress}
        />
      )}

      {openRemoveModal && (
        <DeleteAddressModal
          userId={user._id}
          addressId={addressToDeleteId}
          onClose={() => setOpenRemoveModal(false)}
          onDelete={(deletedId) => {
            setAddresses(prev => prev.filter(addr => addr.id !== deletedId));
          }}
        />
      )}
    </div>
  );
};




const PaymentMethod = ({ className, setProvider, provider }) => {
  const handleProviderChange = (event) => {
    setProvider(event.target.value);
  };
  return (
    <div className={cn("bg-white rounded-xl p-5", className)}>
      <div className="flex items-center gap-3 border-b-2 pb-4">
        <p className="bg-app-ash-1 w-8 aspect-square rounded-full grid place-items-center font-bold">
          4
        </p>
        <Heading className="text-black">Payment Method</Heading>
      </div>
      <div className="py-4 grid gap-4">
        <div className="flex gap-6">
          <div className="hidden items-center gap-2">
            <input
              type="radio"
              id="flutterwave"
              name="paymentProvider"
              value="flutterwave"
              checked={provider === "flutterwave"}
              onChange={handleProviderChange}
            />
            <label htmlFor="flutterwave" className="flex items-center gap-2">
              <img
                src={flutterImg}
                className="w-18 h-18"
                alt="flutterwave-logo"
              />
            </label>
          </div>
          <div className={`flex items-center gap-2 p-2 rounded-lg ${provider === 'monnify' && 'bg-gray-100'}`}>
            <input
              type="radio"
              id="monnify"
              name="paymentProvider"
              value="monnify"
              checked={provider === "monnify"}
              onChange={handleProviderChange}
            />
            <label htmlFor="monnify" className="flex items-center gap-2">
              <img
                src={'/monnify-logo.png'}
                className="w-18 h-10"
                alt="monnify-logo"
              />
            </label>
          </div>
          <div className={`flex items-center p-2 rounded-lg gap-2  ${provider === 'paystack' && "bg-gray-100"}`}>
            <input
              type="radio"
              id="paystack"
              name="paymentProvider"
              value="paystack"
              checked={provider === "paystack"}
              onChange={handleProviderChange}
            />
            <label htmlFor="paystack" className="flex items-center gap-2">
              <img
                src={'/paystack-logo.png'}
                className="w-28 h-18"
                alt="paystack-logo"
              />
            </label>
          </div>
          
        </div>
      </div>
    </div>
  );
};
