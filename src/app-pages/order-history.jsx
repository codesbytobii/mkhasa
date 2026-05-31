"use client";

import { useRouter } from "next/navigation";
// import { Icon } from "@iconify/react";
import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import { Heading } from "../components/Heading";
import { Wrapper } from "../components/ui/Wrapper";
import { Navigation } from "../components/ui/Navigation";
import axios from "../utils/axios";
import { useAuth } from "../hooks/utils/useAuth";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { useCartContext } from '../hooks/utils/useCart';
// import { isObject } from 'embla-carousel/components/utils';
import { Loader2 } from 'lucide-react';

export const Component = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCartContext()
  const [isReordering, setIsReordering] = useState("");
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const { getUserId } = useAuth();
  const fetchOrders = async () => {
    const res = await axios.get(`all/order/${getUserId()}`);
    return res.data;
  };

  const { data, status } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });

  const handleReorder = async (orderId, order) => {
    setIsReordering(orderId)
    try {
      order.items?.forEach(item => {
        addToCart({ itemId: item?.productId?._id, quantity: item.quantity, applyDiscount: item?.productId?.discount ?? false })
      })
      router.push("/cart")
    } catch (error) {
      console.log(error)
    } finally {
      setIsReordering("")
    }
  }


  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      
      <Wrapper className="py-4">
        <Heading>Order History</Heading>

        <div className="bg-white py-6 px-4 rounded-3xl my-4 md:px-8 border overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="font-bold border-b-2 pb-4">
                  <td className="py-3 px-4 text-left">Order No.</td>
                  <td className="py-3 px-4 text-center">Date</td>
                  <td className="py-3 px-4 text-center">Amount</td>
                  <td className="py-3 px-4 text-center">Status</td>
                  <td className="py-3 px-4 text-center">Action</td>
                </tr>
              </thead>
              {status === "pending" ? (
                <tbody>
                  <tr>
                    <td colSpan="5" className="py-8 text-center">
                      Loading orders...
                    </td>
                  </tr>
                </tbody>
              ) : status === "error" ? (
                <tbody>
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-red-500">
                      Error loading orders
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {data?.orders.map((order) => (
                    <tr key={order.code} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">{order.code}</td>
                      <td className="py-4 px-4 text-center">{order.date}</td>
                      <td className="py-4 px-4 text-center">
                        ₦{order?.total?.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-block rounded-full py-1 px-4 ${order.status === "pending"
                            ? "bg-orange-100 text-orange-800"
                            : order.status === "dispatched"
                              ? "bg-yellow-100 text-yellow-800"
                              : order.status === "delivered"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                        >
                          {order.status === "pending"
                            ? "Processing"
                            : order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => handleReorder(order._id, order)}
                          disabled={isReordering === order._id} className="bg-gray-100 hover:bg-gray-200 transition-colors px-4 py-2 rounded-lg text-sm font-medium">
                          {isReordering === order._id ? <Loader2 className='animate-spin' /> : "Reorder"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {status === "pending" ? (
              <div className="py-8 text-center">Loading orders...</div>
            ) : status === "error" ? (
              <div className="py-8 text-center text-red-500">
                Error loading orders
              </div>
            ) : (
              data?.orders.map((order) => (
                <div
                  key={order.code}
                  className="border rounded-xl p-4 bg-white shadow-sm"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-sm text-gray-500">Order No.</p>
                      <p className="font-semibold">{order.code}</p>
                    </div>
                    <span
                      className={`text-xs font-medium rounded-full py-1 px-3 ${order.status === "pending"
                        ? "bg-orange-100 text-orange-800"
                        : order.status === "dispatched"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                    >
                      {order.status === "pending"
                        ? "Processing"
                        : order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">{order.date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Amount</p>
                      <p className="font-medium">
                        ₦{order?.total?.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleReorder(order._id, order)}
                    disabled={isReordering === order._id} className="w-full bg-gray-100 hover:bg-gray-200 flex justify-center items-center text-center transition-colors py-2.5 rounded-lg text-sm font-medium">
                    {isReordering === order._id ? <Loader2 className='animate-spin' /> : "Reorder"}
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Empty State */}
          {status === "success" && (!data?.orders || data.orders.length === 0) && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                {/* You can add an icon here */}
                <div className="text-4xl mb-2">📦</div>
                <p className="text-gray-500">No orders found</p>
              </div>
            </div>
          )}
        </div>
      </Wrapper>
    </>
  );
};