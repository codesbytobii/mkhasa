"use client";

import React, { useState } from 'react';
import { Wrapper } from "../../components/ui/Wrapper";
import { Heading } from '../../components/Heading';
import { Button } from "../../components/ui/Button";
import { Label } from "../../components/ui/label";
import { Input, PInput } from "../../components/Input";
import { useFormik } from "formik";
import * as yup from "yup";
import { useCanSubmitForm } from "../../hooks/utils/useCanSubmitFormik";
import { Icon } from "@iconify/react";

const AdminLogin = () => {
  const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup
      .string()
      .trim()
      .required()
      .matches(/(?=.*[A-Z])/, "must contain uppercase")
      .matches(/^(?=.*[a-z])/, "Must contain lowercase")
      .min(6, "must be at least 6 characters long")
      .max(50, "must be at most 50 characters long"),
  });

const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: schema,
    onSubmit: async (values) => {
      setError(""); // Clear any previous errors
      mutation.mutate(values);
    },
  });

  const canSubmit = useCanSubmitForm(formik);

  return (
    <Wrapper className="flex flex-col items-center max-w-lg py-12">
        
      <Heading>Welcome !</Heading>
      <p className='text-sm mt-2 text-center'>Enter Your Email Address And Password To Access <span className=' text-app-red'>Mkhasa</span> Admin Panel</p>
      <form onSubmit={formik.handleSubmit} className="w-[90%] md:w-[60%] mx-auto mt-5 gap-3 flex flex-col">
        <div className="text-left md:text-center">
          <Label htmlFor="email">Email</Label>
          <Input name="email" formik={formik} />
        </div>
        <div className="text-left md:text-center">
          <Label htmlFor="password">Password</Label>
          <PInput name="password" formik={formik} />
        </div>

        <Button
          className="w-full rounded-none py-[10px] flex justify-center bg-app-red hover:bg-red-500 text-base text-white font-bold mt-5 sm:hover:bg-black disabled:bg-[#999999] hover:disabled:bg-[#999999] sm:bg-app-black"
          type="submit"
          disabled={!canSubmit}
        >
          Log In
        </Button>
      </form>
    </Wrapper>
  );
};

export default AdminLogin;
