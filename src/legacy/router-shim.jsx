"use client";

import { createContext, useContext } from "react";

const LoaderDataContext = createContext({});

export const LoaderDataProvider = ({ value, children }) => {
  const parent = useContext(LoaderDataContext);
  const merged =
    parent &&
    value &&
    typeof parent === "object" &&
    typeof value === "object" &&
    !Array.isArray(parent) &&
    !Array.isArray(value)
      ? { ...parent, ...value }
      : value ?? parent ?? {};

  return (
    <LoaderDataContext.Provider value={merged}>
      {children}
    </LoaderDataContext.Provider>
  );
};

export const useLoaderData = () => useContext(LoaderDataContext) || {};
