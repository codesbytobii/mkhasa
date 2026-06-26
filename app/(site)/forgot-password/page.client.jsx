// "use client";

// import dynamic from "next/dynamic";

// const ForgotPasswordComponent = dynamic(
//   () => import("@/app-pages/forgot-password").then((mod) => mod.Component),
//   { ssr: false }
// );

// export default function ForgotPasswordClient() {
//   return <ForgotPasswordComponent />;
// }


"use client";

import dynamic from "next/dynamic";

const ForgotPasswordComponent = dynamic(
  () => import("@/app-pages/forgot-password").then((mod) => mod.ForgotPassword),
  { ssr: false }
);

export default function ForgotPasswordClient() {
  return <ForgotPasswordComponent />;
}