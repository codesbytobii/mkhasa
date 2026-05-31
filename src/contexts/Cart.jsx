"use client";




import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createContext, useState } from "react";
import axios from "../utils/axios";
import { useAuth } from "../hooks/utils/useAuth";
import { getSingleSeries } from "../utils/productApi";
import { v4 as uuid } from "uuid"
export const CartContext = createContext();

const isBrowser = typeof window !== "undefined";

export const getCartFromLocalStorage = () => {
  if (!isBrowser) return [];
  const cart = localStorage.getItem('guestCart');
  const parsedCart = cart ? JSON.parse(cart) : [];

  // find any discounted series and apply discount logic
  // parsedCart.forEach(async (item) => {
  //   const series = await getSingleProduct(item.productId).series
  //   const seriesDetails = await getSingleSeries(series)
  //   if (seriesDetails.discount) {
  //     const discountPercentage = seriesDetails.discountPercentage || 0;
  //     const discountAmount = (discountPercentage / 100) * item.price;
  //     item.price = item.price - discountAmount;
  //   }
  // });
  return parsedCart;
}

export const Cart = ({ children }) => {
  const [cartQuantity, setCartQuantity] = useState(0)
  const [cartQuantityChanged, setCartQuantityChanged] = useState(false)
  const [updatingCart, setupdatingCart] = useState(true)
  const [canRefetch, setCanRefetch] = useState(false);


  function isLoggedIn(userId) {
    return !!userId;
  }

  const { getUserId } = useAuth();
  const queryClient = useQueryClient();

  const hasItem = async (itemId) => {
    const userId = getUserId();
    if (isLoggedIn(userId)) {
      const cart = await queryClient.ensureQueryData({
        queryKey: ["cart"],
        queryFn: getCart,
      });
      return cart ? cart.items.find((item) => item.productId._id === itemId) : undefined;
    } else {
      const localCart = getCartFromLocalStorage();
      return localCart.find(item => item.productId === itemId);
    }
  };



  const saveCartToLocalStorage = (cartItems) => {
    if (!isBrowser) return;
    localStorage.setItem('guestCart', JSON.stringify(cartItems));
  };

  const clearLocalStorageCart = () => {
    if (!isBrowser) return;
    localStorage.removeItem('guestCart');
  };

  const getCart = async () => {
    let userId = getUserId()
    try {
      if (!userId) {
        userId = getOrGenerateSessionId()
      }
      if (!userId) {
        setCartQuantity(0)
        return
      }
      const response = await axios.get(`cart/${userId}`)
      setCartQuantity(response?.data?.items?.length)
    } catch (error) {
      console.log(error)
    }
  }

  const getDiscountPercentage = (quantity) => {
    if (quantity <= 2) return 0;
    if (quantity <= 5) return 2.5;
    if (quantity <= 8) return 5;
    if (quantity <= 11) return 7.5;
    return 10; // quantity >= 12
  };

  const calculateDiscountForGuest = (quantity, originalPrice) => {
    const discountAmount = getDiscountPercentage(quantity) / 100 * originalPrice
    return originalPrice - discountAmount
  }

  const getOrGenerateSessionId = () => {
    if (!isBrowser) return null
    let sessionId = localStorage.getItem("sessionId")
    if (!sessionId) {
      sessionId = uuid()
      localStorage.setItem("sessionId", sessionId)
    }
    return sessionId
  }



  // const addToCart = async ({ itemId, quantity, applyDiscount, name, price, localCartImage, series }) => {
  //   const userId = getUserId() || getOrGenerateSessionId();
  //   setCartQuantity(prev => prev + 1);
  //   try {
  //     await add.mutateAsync({ userId, itemId, quantity, applyDiscount });
  //   } finally {
  //     getCart();
  //   }
  //   queryClient.invalidateQueries({ queryKey: ["cart"] });
  //   return true;
  // };

  const addToCart = async ({ itemId, quantity, applyDiscount, name, price, localCartImage, series }) => {
  const userId = getUserId();
  
  if (!userId) {
    // Guest: save to localStorage instead of API
    const localCart = getCartFromLocalStorage();
    const existingIndex = localCart.findIndex(item => item.productId === itemId);
    
    if (existingIndex !== -1) {
      localCart[existingIndex].quantity += quantity;
    } else {
      localCart.push({ productId: itemId, quantity, name, price, localCartImage, series, applyDiscount });
    }
    
    saveCartToLocalStorage(localCart);
    setCartQuantity(localCart.length);
    setCartQuantityChanged(true);
    return true;
  }

  // Logged-in user: hit the API
  setCartQuantity(prev => prev + 1);
  try {
    await add.mutateAsync({ userId, itemId, quantity, applyDiscount });
  } finally {
    getCart();
  }
  queryClient.invalidateQueries({ queryKey: ["cart"] });
  return true;
};


  const checkIsDiscountedSeries = async (seriesName) => {
    const series = await getSingleSeries(seriesName)
    return series?.discount || false
  }

  const increaseItem = async ({ itemId, quantity, applyDiscount, productPrice, series }) => {
    const userId = getUserId() || getOrGenerateSessionId();
    increase.mutate({ userId, itemId, quantity });
  };


  const decreaseItem = async ({ itemId, quantity, productPrice, series }) => {
    const userId = getUserId() || getOrGenerateSessionId();
    decrease.mutate({ userId, itemId, quantity });
  };

  const removeFromCart = (itemId) => {
    const userId = getUserId() || getOrGenerateSessionId();
    setCartQuantity(prev => prev - 1)
    remove.mutate({ userId, itemId });
    setCanRefetch(true);
    queryClient.invalidateQueries({ queryKey: ["cart"] });
  };

  const clearCart = () => {
    const userId = getUserId() || getOrGenerateSessionId();
    clear.mutate({ userId });
    queryClient.invalidateQueries({ queryKey: ["cart"] });
  };

  const mergeCartsOnLogin = async (userId) => {
    const localCart = getCartFromLocalStorage();
    if (localCart.length > 0) {
      for (const item of localCart) {
        try {
          await add.mutateAsync({ userId, itemId: item.productId, quantity: item.quantity });
        } catch (error) {
          console.error("Error adding item to server cart:", error);
        }
      }
      clearLocalStorageCart();
    }
  };

  const clear = useMutation({
    mutationFn: ({ userId }) => axios.post(`clear/cart/${userId}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      // toast.success("Cart Cleared", { duration: 2000 });  // Set duration to 2 seconds
    },
  });

  const remove = useMutation({
    mutationFn: ({ userId, itemId }) =>
      axios.post(`remove/cart/${userId}/${itemId}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      getCart()
    },
  });

  const add = useMutation({
    mutationFn: ({ userId, itemId, quantity, applyDiscount }) =>
      axios.post(`add/cart/${userId}/${itemId}`, { quantity, applyDiscount }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const increase = useMutation({
    mutationFn: ({ userId, itemId, quantity }) =>
      axios.post(`cart/increase/quantity/${userId}/${itemId}`, {
        quantityToAdd: quantity,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const decrease = useMutation({
    mutationFn: ({ userId, itemId, quantity }) =>
      axios.post(`cart/decrease/quantity/${userId}/${itemId}`, {
        quantityToSubtract: quantity,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  return (
    <CartContext.Provider
      value={{
        addToCart,
        removeFromCart,
        increaseItem,
        decreaseItem,
        clearCart,
        hasItem,
        mergeCartsOnLogin,
        getCart,
        setCartQuantityChanged,
        setCartQuantity,
        cartQuantityChanged,
        getCartFromLocalStorage,
        cartQuantity,
        updatingCart,
        canRefetch,
        getOrGenerateSessionId,
        setCanRefetch
      }}
    >
      {children}
    </CartContext.Provider>
  );
};



