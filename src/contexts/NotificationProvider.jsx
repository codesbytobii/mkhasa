"use client";

import { createContext, useContext, useEffect, useState } from "react"

const notificationDialogContext = createContext()
export const useNotificationDialogContext = ()=> useContext(notificationDialogContext)
const NotificationDialogProvider = ({children}) => {
    const [openNotificationDialog, setOpenNotificationDialog] = useState("")
    
    // useEffect(()=>{
    //   console.lof(openNotificationDialog)
    // },[openNotificationDialog])
    const toggleNotificationDialog = (productId)=>{
        setOpenNotificationDialog(prev => prev ? "" : productId)
    }

    const value = {
        toggleNotificationDialog,
        openNotificationDialog
    }
  return (
    <notificationDialogContext.Provider value={value}>{children}</notificationDialogContext.Provider>
  )
}

export default NotificationDialogProvider
