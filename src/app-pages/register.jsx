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
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { useCartContext } from "../hooks/utils/useCart";

// ✅ States array
const states = [
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

export const Component = ({ backGroundColor }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mergeCartsOnLogin } = useCartContext();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
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
    state: yup.string().required("State is required"),
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

        const combinedValues = {
          ...values,
          street: `${values.street1} ${values.street2}`.trim(),
        };

        const response = await axios.post(`user/send/verification`, combinedValues, {
          headers: { "Content-Type": "application/json" },
        });

        if (response?.status === 200) {
          setIsSubmitting(false);
          const userId = response?.data.userId;
          await mergeCartsOnLogin(userId);
          router.push(`/confirm-otp?email=${encodeURIComponent(values.email)}`);
        }
      } catch (error) {
        setIsSubmitting(false);
      }
    },
  });

  const canSubmit = useCanSubmitForm(formik);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Wrapper className="max-w-xl flex flex-col items-center py-12">
      <Heading>Create Your Account</Heading>
      <p className="text-xl font-bold mt-1">
        welcome to{" "}
        <span
          className={`font-fuzzy font-extrabold tracking-tighter text-sm pt-2 ${
            backGroundColor === "black" ? "text-white" : "text-app-red"
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
            <Input name="name" formik={formik} />
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input name="email" formik={formik} />
          </div>
          <div>
            <Label htmlFor="phoneNumber">Mobile Number</Label>
            <Input name="phoneNumber" formik={formik} type="tel" />
          </div>
          <div>
            <Label htmlFor="street1">Street 1</Label>
            <Input name="street1" formik={formik} />
          </div>
          <div>
            <Label htmlFor="street2">Street 2 (Optional)</Label>
            <Input name="street2" formik={formik} />
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input name="city" formik={formik} />
          </div>

          {/* ✅ State dropdown */}
          <div>
            <Label htmlFor="state">State</Label>
            <select
              id="state"
              name="state"
              value={formik.values.state}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">Select your state</option>
              {states.map(({ name, value }) => (
                <option key={value} value={value}>
                  {name}
                </option>
              ))}
            </select>
            {/* ✅ Show validation error just like the other inputs */}
            {formik.touched.state && formik.errors.state && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.state}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <PInput name="password" formik={formik} />
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
              <Icon icon="svg-spinners:6-dots-rotate" style={{ fontSize: 20 }} />
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
  );
};
