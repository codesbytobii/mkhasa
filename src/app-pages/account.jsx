"use client";

import { Icon } from "@iconify/react";
import { Heading } from "../components/Heading";
import { Wrapper } from "../components/ui/Wrapper";
import Link from "next/link";
import { Navigation } from "../components/ui/Navigation";
import { Logout } from "../components/Logout";
import { useAuth } from "../hooks/utils/useAuth";
import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import axios from "../utils/axios";
import { MoveRight } from "lucide";

export const Component = () => {
  const { getUserEmail, getUserId } = useAuth();

  const [userDetails, setUserDetails] = useState({
    name: "",
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
      });
    }).catch((err) => {
      console.error("Error fetching user details:", err);
    });
  }, [getUserId]);

  const [orderdata, setOrderData] = useState({})
  useEffect(() => {
    axios.get(`/count/user/orders/${getUserId()}`).then((res) => {

      setOrderData(res.data)
    }).catch((err) => {
      // console.log(err)
    })

  }, [])

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      
      <Wrapper className="py-4">
        {/* <Navigation
          location={[
            { description: "Home", href: "/", title: "Go to Home Page" },
            { description: "My Account", href: "" },
          ]}
          className="text-[#3338] py-4"
          iconClassName="text-[#3339] text-2xl"
          currentLocationClassName="text-app-black"
        /> */}
        <div className="flex flex-col-reverse md:flex-row justify-between gap-4 md:gap-8 items-center py-4">
          <Heading className="text-app-black"> Hi {userDetails.name || getUserEmail()}</Heading>
          <Logout
            className="w-fit bg-transparent bg-app-red rounded-sm border-app-red border text-nowrap py-2 px-4 font-medium text-white"
            toggle={() => { }}
          />
        </div>

        <p>
          Welcome to your account, you can manage your orders and profile
          details.
        </p>

        <div className="grid gap-6 py-6 md:grid-cols-2">
          <Link href="/account/order-history">
            <div className="bg-white rounded-xl flex items-center gap-4 px-4 py-2">
              <Icon
                icon="system-uicons:box"
                style={{ fontSize: 132 }}
                className="text-app-red"
              />
              <div>
                <Heading>ORDERS</Heading>
                <div className="flex items-center gap-x-4 gap-y-2 flex-wrap pt-2">
                  <p className="p-1 rounded-md text-sm text-nowrap text-orange-400 font-bold bg-yellow-50">
                    {orderdata?.pending || 0} Processing order
                  </p>
                  <p className="p-1 rounded-md text-sm text-nowrap text-yellow-500 font-bold bg-green-50">
                    {orderdata?.dispatched || 0} Dispacthed
                  </p>
                  <p className="p-1 rounded-md text-sm text-nowrap text-green-500 font-bold bg-green-50">
                    {orderdata?.delivered || 0} Delivered
                  </p>
                </div>
                {/* <Link href="/account/order-history" className="flex gap-4 items-center"><span>View orders</span> </Link><MoveRight/> */}
              </div>
            </div>
          </Link>
          <Link href="/account/profile">
            <div className="bg-white rounded-xl flex items-center gap-4 px-4 py-2">
              <Icon
                icon="mingcute:user-1-line"
                style={{ fontSize: 132 }}
                className="text-app-red"
              />
              <div>
                <Heading>Profile</Heading>
                <p>Manage your Profile and Password</p>
              </div>
            </div>
          </Link>
        </div>
      </Wrapper>
    </>
  );
};
