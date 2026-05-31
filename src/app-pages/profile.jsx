"use client";

import { Icon } from "@iconify/react";
import { Heading } from "../components/Heading";
import * as yup from "yup";
import { Wrapper } from "../components/ui/Wrapper";
import { Navigation } from "../components/ui/Navigation";
import { cn } from "../utils/cn";
import { Button } from "../components/ui/Button";
import { useAuth } from "../hooks/utils/useAuth";
import { PInput } from "../components/Input";
import { useFormik } from "formik";
import { useMutation } from "@tanstack/react-query";
import axios from "../utils/axios";
import React, { useState, useEffect, useRef } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';

export const Component = () => {
  const {username, getUserId, getUserAddress} = useAuth();

  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    street1: "", 
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading or fetch data here
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Adjust this time as needed

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    axios.get(`/get/user/${getUserId()}`).then((res) => {
      setUserDetails({
        name: res.data.user.name,
        email: res.data.user.email,
        phone: res.data.user.phoneNumber,
        address: res.data.user.address,
        street1: res.data.user.street1,
      });
    });
  }, []);

  const [editMode, setEditMode] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [val, setVal] = useState(username);
  const toggle = () => {
    setEditMode((v) => !v);
  };
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShow(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);


  const updateProfileMutation = useMutation({
    mutationFn: async (values) => {
      try {
        if (values.username) {
          await axios.post(`user/update/${getUserId()}`, { username: values.username }, {
            headers: { "Content-Type": "application/json" },
          });
          setUserDetails(prev => ({ ...prev, name: values.username }));
        } else if (values.currentPassword && values.newPassword) {
          await axios.post(`user/change/password/${getUserId()}`, values, {
            headers: { "Content-Type": "application/json" },
          });
        }
      } catch (error) {
      }
    },
  });

  // Use this mutation for both name and password updates
  const handleNameUpdate = () => {
    updateProfileMutation.mutate({ username: val });
    toggle();
  };

  const handlePasswordUpdate = (values) => {
    updateProfileMutation.mutate(values);
  };

  const schema = yup.object().shape({
    currentPassword: yup
      .string()
      .trim()
      .required("Required field")
      .matches(/(?=.*[A-Z])/, "must contain uppercase")
      .matches(/^(?=.*[a-z])/, "Must contain lowercase")
      .min(6, "must be at least 6 characters long")
      .max(50, "must be at most 50 characters long"),
    newPassword: yup
      .string()
      .trim()
      .required("Required field")
      .matches(/(?=.*[A-Z])/, "must contain uppercase")
      .matches(/^(?=.*[a-z])/, "Must contain lowercase")
      .min(6, "must be at least 6 characters long")
      .max(50, "must be at most 50 characters long")
      .notOneOf(
        [yup.ref("currentPassword"), null],
        "Passwords must be different"
      ),
  });

  const formik = useFormik({
    initialValues: { newPassword: "", currentPassword: "" },
    validationSchema: schema,
    onSubmit: async (values) => {
      handlePasswordUpdate(values);
    },
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      
      <Wrapper className="py-4">

        <Heading className="pl-3 md:pl-0">My Profile</Heading>

        <div className="grid gap-6 md:gap-20 py-6 md:grid-cols-2">
          <div className={cn("bg-white rounded-xl p-3 md:px-0")}>
            <div className="flex items-center gap-3 border-b-2 pb-4">
              <Heading>Personal Details</Heading>
            </div>
            <div className="pt-6">
              <div>
                <p className="font-bold">Name:</p>
                <div className="flex justify-between gap-6">
                  {editMode ? (
                    <>
                      <input
                        type="text"
                        value={val}
                        className="outline-none"
                        onChange={(e) => {
                          setVal(e.target.value);
                        }}
                      />

                      <button onClick={handleNameUpdate}>
                        <Icon
                          icon="mingcute:check-2-fill"
                          style={{ fontSize: 32 }}
                        />
                      </button>
                    </>
                  ) : (
                    <>
                      <p>{userDetails.name}</p>
                      <button onClick={toggle}>
                        <Icon
                          icon="lucide:edit"
                          style={{ fontSize: 32 }}
                          className="text-app-ash-2"
                        />
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="py-4">
                <p className="font-bold">Email:</p>
                <p>{userDetails.email}</p>
              </div>
              <div className="py-4">
                <p className="font-bold">Address:</p>
                <p>{userDetails.street1}</p>
              </div>

            </div>
          </div>

          <div className={cn("bg-white rounded-xl p-3 md:px-0")}>
            <div className="flex items-center gap-3 border-b-2 pb-4">
              <Heading >Reset Password</Heading>
            </div>

            <form onSubmit={formik.handleSubmit} className="pt-6 text-center md:text-left">
              <div className="grid gap-6">
                <PInput
                  placeholder="Enter Current Password"
                  formik={formik}
                  name="currentPassword"
                  className="bg-app-ash-1"
                />
                <PInput
                  placeholder="Enter New Password"
                  formik={formik}
                  name="newPassword"
                  className="bg-app-ash-1"
                />
              </div>
              <Button
                type="submit"
                className="bg-app-black text-white mt-6 w-28 h-10"
              >
                {updatingPassword ? (
                  <Icon
                    icon="svg-spinners:6-dots-rotate"
                    style={{ fontSize: 20 }}
                    className="mx-auto"
                  />
                ) : (
                  "Reset"
                )}
              </Button>
            </form>
          </div>
        </div>
      </Wrapper>
    </>
  );
};
