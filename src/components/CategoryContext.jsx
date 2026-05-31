"use client";

import React, { createContext, useState, useContext } from "react";

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const toggleCategoryPanel = () => {
    setIsPanelOpen((prev) => !prev);
  };

  return (
    <CategoryContext.Provider value={{ isPanelOpen, toggleCategoryPanel }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategoryContext = () => {
  return useContext(CategoryContext);
};

