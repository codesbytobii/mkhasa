"use client";

import AppealProducts from "@/app-pages/appeal/appeal";

export default function AppealPageClient({ initialAppealName, initialAppealData }) {
  return (
    <AppealProducts
      initialAppealName={initialAppealName}
      initialAppealData={initialAppealData}
    />
  );
}
