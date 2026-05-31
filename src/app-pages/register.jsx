"use client";

import { useRouter } from "next/navigation";

import * as yup from "yup";
import { useFormik } from "formik";
import Link from "next/link";

import { Heading } from "../components/Heading";
import { Wrapper } from "../components/ui/Wrapper";
import { Button } from "../components/ui/Button";
import { Input, PInput } from "../components/Input";
import { useCanSubmitForm } from "../hooks/utils/useCanSubmitFormik";
import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import { Icon } from "@iconify/react";
import axios from "../utils/axios";
// import { ToastContainer, toast } from "react-toastify";
// // import 'react-toastify/dist/ReactToastify.css';
import { Label } from "../components/ui/label"
import { Checkbox } from "../components/ui/checkbox"
import { useCartContext } from "../hooks/utils/useCart";

export const Component = ({ backGroundColor }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mergeCartsOnLogin } = useCartContext();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading or fetch data here
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Adjust this time as needed

    return () => clearTimeout(timer);
  }, []);

  const schema = yup.object().shape({
    name: yup.string().required("Name is required").min(3, "Must be at least 3 characters"),
    email: yup.string().email("Invalid email address").required("Email is required"),
    phoneNumber: yup
      .string()
      .required("Mobile number is required")
      .matches(/^\d+$/, "Mobile number must contain only digits"),
    street1: yup.string().required("Street 1 is required").min(3, "Must be at least 3 characters"),
    street2: yup.string().min(3, "Must be at least 3 characters"),
    city: yup.string().required("City is required").min(2, "Must be at least 2 characters"),
    state: yup.string().required("State is required").min(2, "Must be at least 2 characters"),
    password: yup
      .string()
      .trim()
      .required("Password is required")
      .matches(/(?=.*[A-Z])/, "Password must contain an uppercase letter")
      .matches(/^(?=.*[a-z])/, "Password must contain a lowercase letter")
      .min(6, "Password must be at least 6 characters long")
      .max(50, "Password must be at most 50 characters long"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phoneNumber: "",
      street1: "",
      street2: "",
      city: "",
      state: "",
      password: "",
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);

        // Combine street1 and street2 into a single street field
        const combinedValues = {
          ...values,
          street: `${values.street1} ${values.street2}`.trim()
        };

        const response = await axios.post(`user/send/verification`, combinedValues, {
          headers: { "Content-Type": "application/json" },
        });
        if (response?.status === 200) {
          setIsSubmitting(false);

          // Assuming the response includes the user ID of the newly registered user
          const userId = response?.data.userId;

          // Merge local cart with server cart
          await mergeCartsOnLogin(userId);

          router.push(`/confirm-otp?email=${encodeURIComponent(values.email)}`);
        }
      } catch (error) {
        setIsSubmitting(false);
        // console.log(error.response?.data.message);
        // toast.error(error.response?.data.message);
      }
    },
  });

  const canSubmit = useCanSubmitForm(formik);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      
      <Wrapper className="max-w-xl flex flex-col items-center py-12">
        <Heading>Create Your Account</Heading>
        <p className="text-xl font-bold mt-1">
          welcome to {""}
          <span
            className={`font-fuzzy font-extrabold tracking-tighter text-sm pt-2 ${backGroundColor === "black" ? "text-white" : "text-app-red"
              } min-[360px]:text-lg md:text-xl lg:text-2xl`}

          >
            Mkhasa
          </span>
        </p>


        <form
          onSubmit={formik.handleSubmit}
          className="w-full max-w-xl bg-white rounded-3xl p-4"
        >
          <div className="w-[90%] md:w-[60%] mx-auto gap-10">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                name="name"
                formik={formik}
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                name="email"
                formik={formik}
              />
            </div>
            <div>
              <Label htmlFor="phoneNumber">Mobile Number</Label>
              <Input
                name="phoneNumber"
                formik={formik}
                type="tel"
              />
            </div>
            <div>
              <Label htmlFor="street1">Street 1</Label>
              <Input
                name="street1"
                formik={formik}
              />
            </div>
            <div>
              <Label htmlFor="street2">Street 2 (Optional)</Label>
              <Input
                name="street2"
                formik={formik}
              />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                name="city"
                formik={formik}
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                name="state"
                formik={formik}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <PInput
                name="password"
                formik={formik}
              />
            </div>

            <div className="flex items-center space-x-2 mt-1 justify-center">
              <Checkbox id="terms" />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I Accept All Terms & Conditions
              </label>
            </div>
            <Button
              className="w-full rounded-none py-[10px] flex justify-center bg-app-red hover:bg-red-500 text-base text-white font-bold mt-8 sm:hover:bg-black disabled:bg-[#999999] hover:disabled:bg-[#999999] sm:bg-app-black"
              type="submit"
              disabled={!canSubmit}
            >
              {isSubmitting ? (
                <Icon
                  icon="svg-spinners:6-dots-rotate"
                  style={{ fontSize: 20 }}
                />
              ) : (
                "Sign Up"
              )}
            </Button>

            <p className="text-[#666666] py-4 text-center text-sm">
              Already have an account?
              <Link href="/login" className="text-app-black font-semibold ml-2 underline">
                Sign In
              </Link>
            </p>
          </div>
        </form>

      </Wrapper>
      {/* <ToastContainer /> */}
    </>
  );
};


