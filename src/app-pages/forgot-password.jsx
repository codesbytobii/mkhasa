"use client";

import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as yup from "yup";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Heading } from "../components/Heading";
import { Button } from "../components/ui/Button";
import { Input, PInput } from "../components/Input";
import { useCanSubmitForm } from "../hooks/utils/useCanSubmitFormik";
import { Wrapper } from "../components/ui/Wrapper";
import { Icon } from "@iconify/react";
import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import axios from "../utils/axios";
import { Label } from "../components/ui/label"

export const ForgotPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    email: yup.string().email().required(),
  });

  const request = async (values) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(`user/forget/password`, values, {
        headers: { "Content-Type": "application/json" },
      });
      if (response?.status === 200) {
        setIsSubmitting(false);
        router.push(`/reset-password?email=${encodeURIComponent(values.email)}`);
      }
      // console.log(response)
    } catch (error) {
      setIsSubmitting(false);
      // console.log(error?.response?.data?.message);
    }
  };

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: schema,
    onSubmit: async (values, { }) => {
      await request(values);
    },
  });

  const canSubmit = useCanSubmitForm(formik);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      
      <Wrapper className="flex flex-col items-center max-w-lg py-12">
        <LockIcon />
        <Heading>Forgot Password</Heading>
        <p className="pt-4 text-[#666666] text-sm text-center pb-2">
          Enter The Email You Used To Create Your Account So We Can Send You A Link To Reset Your Password.
        </p>

        <form
          onSubmit={formik.handleSubmit}
          className="w-full max-w-lg p-4 bg-white rounded-3xl"
        >
          <div className="w-[90%] md:w-[60%] mx-auto flex flex-col gap-3">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                name="email"
                formik={formik}
              />
            </div>

            <Button
              className="w-full rounded-none text-base py-[10px] flex justify-center bg-app-red hover:bg-red-500 text-white font-bold sm:hover:bg-black disabled:bg-[#999999] hover:disabled:bg-[#999999] sm:bg-app-black"
              type="submit"
              disabled={!canSubmit}
            >
              {isSubmitting ? (
                <Icon
                  icon="svg-spinners:6-dots-rotate"
                  style={{ fontSize: 20 }}
                />
              ) : (
                "Send"
              )}
            </Button>

            <Link href="/login" className="w-full rounded-none border border-black py-[10px] flex justify-center text-base font-bold mt-2">
              Back To Login
            </Link>
          </div>


        </form>
      </Wrapper>
    </>
  );
};

export const ResetPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = decodeURIComponent(searchParams.get("email") || "");
  const schema = yup.object().shape({
    otp: yup
      .string()
      .required()
      .matches(/^[0-9]{4}$/, "must be 4 digit"),
    password: yup
      .string()
      .trim()
      .required()
      .matches(/(?=.*[A-Z])/, "must contain uppercase")
      .matches(/^(?=.*[a-z])/, "Must contain lowercase")
      .min(6, "must be at least 6 characters long")
      .max(50, "must be at most 50 characters long"),
    confirm_password: yup
      .string()
      .trim()
      .required("Confirm Password is required")
      .oneOf([yup.ref("password")], "Password Mismatch!"),
  });

  const formik = useFormik({
    initialValues: { password: "", otp: "", confirm_password: "" },
    validationSchema: schema,
    onSubmit: async ({ password, otp }, { }) => {
      setIsSubmitting(true);
      try {
        const response = await axios.post(
          `user/reset/password`,
          { email, token: otp, password },
          { headers: { "Content-Type": "application/json" } }
        );
        // console.log(response)
        if (response?.status === 200) {
          setIsSubmitting(false);
          router.push(`/login`);
        }
        // console.log(response)
      } catch (error) {
        setIsSubmitting(false);
        // console.error(error);
      }
    },
  });


  const canSubmit = useCanSubmitForm(formik);

  const resendOtp = async () => {
    setIsRequestingOtp(true);
    try {
      const response = await axios.post(
        "resend-otp",
        { email, actionType: 2 },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response?.status === 200) {
        setIsRequestingOtp(false);
        // console.log(response);
      }
    } catch (error) {
      setIsRequestingOtp(false);
      console.error(error);
    }
  };

  return (
    <>
      
      <Wrapper className="flex flex-col items-center max-w-lg py-12">
        <Heading>Password Reset</Heading>
        <p className="pt-4 text-[#666666] text-center">
          Enter new password and otp sent to{" "}
          <span className="font-medium text-app-red">{email}</span> email
          address.
        </p>
        <p className="text-[#666666] pb-4 text-center">
          Remember your password?
          <Link href="/login" className="ml-2 text-app-black">
            Login Here
          </Link>
        </p>

        <form
          onSubmit={formik.handleSubmit}
          className="w-[90%] md:w-[60%] mx-auto gap-10"
        >
          <Label htmlFor="password">New Password</Label>
          <PInput
            name="password"
            formik={formik}
          />
          <Label htmlFor="password">Confirm Password</Label>
          <PInput
            name="confirm_password"
            formik={formik}
          />
          <div>
            <Label htmlFor="password">OTP</Label>
            <Input
              name="otp"
              formik={formik}
            />
            <div className="flex justify-end">
              {isRequestingOtp ? (
                <div className="flex justify-end w-28">
                  <Icon
                    icon="svg-spinners:6-dots-rotate"
                    style={{ fontSize: 20 }}
                  />
                </div>
              ) : (
                <button
                  onClick={resendOtp}
                  className="rounded flex justify-end w-28 hover:underline"
                  type="button"
                >
                  Resend
                </button>
              )}
            </div>
          </div>

          <Button
            className="w-full rounded-none py-[10px] flex justify-center bg-app-red hover:bg-red-500 text-base  text-white font-bold mt-4 sm:hover:bg-black disabled:bg-[#999999] hover:disabled:bg-[#999999] sm:bg-app-black"
            type="submit"
            disabled={!canSubmit}
          >
            {isSubmitting ? (
              <Icon
                icon="svg-spinners:6-dots-rotate"
                style={{ fontSize: 20 }}
              />
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </Wrapper>
    </>
  );
};

function LockIcon() {
  return (
    <svg width="50" height="50" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M25.0013 91.6665C22.7096 91.6665 20.7485 90.8512 19.118 89.2207C17.4874 87.5901 16.6707 85.6276 16.668 83.3332V41.6665C16.668 39.3748 17.4846 37.4137 19.118 35.7832C20.7513 34.1526 22.7124 33.3359 25.0013 33.3332H29.168V24.9998C29.168 19.2359 31.1999 14.3235 35.2638 10.2623C39.3277 6.20123 44.2402 4.16928 50.0013 4.16651C55.7624 4.16373 60.6763 6.19567 64.743 10.2623C68.8096 14.329 70.8402 19.2415 70.8346 24.9998V33.3332H75.0013C77.293 33.3332 79.2555 34.1498 80.8888 35.7832C82.5221 37.4165 83.3374 39.3776 83.3346 41.6665V83.3332C83.3346 85.6248 82.5194 87.5873 80.8888 89.2207C79.2582 90.854 77.2957 91.6693 75.0013 91.6665H25.0013ZM50.0013 70.8332C52.293 70.8332 54.2555 70.0179 55.8888 68.3873C57.5221 66.7568 58.3374 64.7943 58.3346 62.4998C58.3319 60.2054 57.5166 58.2443 55.8888 56.6165C54.261 54.9887 52.2985 54.1721 50.0013 54.1665C47.7041 54.1609 45.743 54.9776 44.118 56.6165C42.493 58.2554 41.6763 60.2165 41.668 62.4998C41.6596 64.7832 42.4763 66.7457 44.118 68.3873C45.7596 70.029 47.7207 70.8443 50.0013 70.8332ZM37.5013 33.3332H62.5013V24.9998C62.5013 21.5276 61.286 18.5762 58.8555 16.1457C56.4249 13.7151 53.4735 12.4998 50.0013 12.4998C46.5291 12.4998 43.5777 13.7151 41.1471 16.1457C38.7166 18.5762 37.5013 21.5276 37.5013 24.9998V33.3332Z" fill="black" />
    </svg>
  );
}
