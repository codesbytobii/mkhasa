"use client";

import { useEffect, useState } from "react";

export const useCanSubmitForm = (formik) => {
  if (!formik) throw new Error("No formik object provided");
  const [canSubmit, setCanSubmit] = useState(false);
  useEffect(() => {
    setCanSubmit(formik.isValid && formik.dirty);
  }, [formik]);
  return canSubmit;
};
