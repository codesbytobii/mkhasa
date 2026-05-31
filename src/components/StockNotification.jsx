"use client";

import { Bell, Mail, ThumbsUp, X } from "lucide-react";
import { useNotificationDialogContext } from "../contexts/NotificationProvider";
import { cn } from "../lib/utils";
import { Button } from "../../components/ui/button";
import * as yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useState } from "react";
import axios from "../utils/axios";

const formShema = yup.object({
  email: yup.string().email("Enter a valid email.").required("Email is required.")
})

const StockNotification = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(formShema) })
  const { openNotificationDialog, toggleNotificationDialog } = useNotificationDialogContext()
  const [saving, setSaving] = useState(false)
  const [notificationSaved, setNotificationSaved] = useState(false)
  const saveNotification = async (data) => {
    setSaving(true)
    try {
      const res = await axios.post(`/notify/me/${openNotificationDialog}`, data)
      if(res.status === 200){
        setNotificationSaved(true)
      }
    } catch (error) {
      console.log(error)
    } finally{
      setSaving(false)
      
    }
  }
  return (
    <div className={cn("fixed top-0 z-[90] rounded-lg  w-[80vw] max-w-[500px]  bg-gray-100 left-[50%] translate-x-[-50%] p-4 transition-all duration-1000", openNotificationDialog ? "translate-y-[100%]" : "-translate-y-[100%]")}>
      {
        !notificationSaved ? (
          <div className="flex flex-col items-center text-center gap-4">
            <X onClick={toggleNotificationDialog} className="absolute right-8" />
            <Bell className="mx-auto" color="#43BEFF" fill="#43beff" />
            <p className="capitalize text-sm">
              Kindly enter your email address to be notified when this product is in
              stock
            </p>
            <form onSubmit={handleSubmit(saveNotification)}>
              <div className="flex items-center w-[90%] mx-auto transparent rounded-full border p-2 bg-white">
                <Mail fill="#626161" stroke="#fff" />
                <input className="outline-none transparent w-full" placeholder="Enter your email" {...register("email")} />
              </div>
              <p className="text-start w-[90%] text-red-500 text-sm">{errors.email && errors.email.message}</p>
              <Button disabled={saving} className="btn disabled:bg-gray-50 disabled:text-black cursor-not-allowed w-[80%] mt-4 bg-white border-none text-black hover:text-white">{saving ? "Saving..." : "Save"}</Button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center ">
            <ThumbsUp className="mx-auto mb-4 size-6" stroke="#0FA958" fill="#0FA958" />
            <h3 className="capitalize font-semibold text-lg mb-[5px]">
              Thank You For Your Response
            </h3>
            <p className="text-sm text-[#6C6C6C]">You'll be notified when this product is in stock</p>
            <Button className="btn w-[80%] mt-4 bg-white border-none text-black hover:text-white" onClick={toggleNotificationDialog}>Continue Shopping</Button>
          </div>
        )
      }
    </div>
  );
};

export default StockNotification;