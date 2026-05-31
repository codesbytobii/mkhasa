"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Auth } from "../src/contexts/Auth.jsx";
import { Cart } from "../src/contexts/Cart.jsx";
import NotificationDialogProvider from "../src/contexts/NotificationProvider.jsx";
import StockNotification from "../src/components/StockNotification.jsx";

export default function AppProviders({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Auth>
        <Cart>
          <NotificationDialogProvider>
            <StockNotification />
            {children}
          </NotificationDialogProvider>
        </Cart>
      </Auth>
    </QueryClientProvider>
  );
}
