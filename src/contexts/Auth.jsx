"use client";

import { createContext, useState, useEffect } from "react";
import { prefix } from "../utils/lib";
import axios from "../utils/axios";

export const AuthContext = createContext();

export const Auth = ({ children }) => {
  const username = "Mkhasa User";

  // Start null; populated after first client render reads localStorage
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(prefix("user")));
      if (stored?.id && stored?.token) {
        setUser(stored);
      }
    } catch {
      // malformed storage — leave user as null
    } finally {
      setAuthReady(true);
    }
  }, []);

  const getAccessToken = () => user?.token;
  const getUserId = () => user?.id;
  const getUserEmail = () => user?.email;
  const getUserAddress = () => user?.address;
  const getUserPhone = () => user?.phoneNumber;

  const getUserWithId = async (id) => {
    try {
      const res = await axios(`${process.env.NEXT_PUBLIC_BASE_URL}/get/user/${id}`);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authReady,
        getAccessToken,
        setUser,
        getUserId,
        getUserEmail,
        getUserWithId,
        username,
        getUserAddress,
        getUserPhone,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};




