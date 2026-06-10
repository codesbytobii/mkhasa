"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import { Wrapper } from "../components/ui/Wrapper";
import { Navigation } from "../components/ui/Navigation";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ProductDetail } from "../components/ProductDetail";
import { Icon } from "@iconify/react";
import { Heading } from "../components/Heading";
import { Button } from "../components/ui/Button";
import { useCartContext } from "../hooks/utils/useCart";
import { useCartQuery } from "../hooks/query/useCart";
import { useAuth } from "../hooks/utils/useAuth";
import { format } from "../utils/lib";
import { Product } from "../components/ProductCard";
import useLongPress from "../hooks/utils/useLongPress";
import { icons } from "../data/Icons";
import { useRecentlyViewed } from "../hooks/utils/useRecentlyViewed";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/select";
import axios from "axios";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel";
import useEmblaCarousel from "embla-carousel-react";
import FBTList from "../components/FBTlist";
import { cn } from "../lib/utils";
import { useNotificationDialogContext } from "../contexts/NotificationProvider";
import { MoveLeft, Share2 } from "lucide-react";
import { toCategoryPath, toProductPath, toProductSlug } from "../utils/paths";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  "https://mkhasa-bfdb6fabd978.herokuapp.com/api/v1";

export const Component = ({
  initialProduct: serverProduct,
  initialSeriesProducts, // server-fetched series carousel items
  initialExploreBrands,  // server-fetched brand row items
}) => {
  const [product, setProduct] = useState(serverProduct || null);
  const { decreaseItem, increaseItem, addToCart, getCartFromLocalStorage } = useCartContext();
  const { getUserId } = useAuth();
  const [count, setCount] = useState(1);
  const { data } = useCartQuery();
  const router = useRouter();
  const ref = useRef();
  const { productName } = useParams();
  const { getHandlers, setElement } = useLongPress(ref.current);
  const [isLoading, setIsLoading] = useState(!serverProduct);
  const [showDiscount, setShowDiscount] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState();
  const [selectedQuantity, setSelectedQuantity] = useState();

  // Seeded from server — crawlers see these immediately in the HTML.
  // Client-side useEffects below will refresh them after hydration.
  const [seriesProducts, setSeriesProducts] = useState(initialSeriesProducts || []);
  const [exploreBrands, setExploreBrands] = useState(initialExploreBrands || []);

  const { toggleNotificationDialog } = useNotificationDialogContext();

  // Saves current product to localStorage; returns list excluding this product
  const recentlyViewed = useRecentlyViewed(product);

  const disVar = [
    { quantity: "1_2", packs: "1 - 2", dis: 0 },
    { quantity: "3_5", packs: "3 - 5", dis: 2.5 },
    { quantity: "6_8", packs: "6 – 8", dis: 5 },
    { quantity: "9_11", packs: "9 – 11", dis: 7.5 },
    { quantity: "12", packs: "12 and above", dis: 10 },
  ];

  const calculateDiscountedPrice = (price, discountPercentage) => {
    return price * (1 - discountPercentage / 100);
  };

  // Fetch product if not provided by server or if URL slug changed
  useEffect(() => {
    if (!productName) return;
    if (product && toProductSlug(product.name) === productName) {
      setIsLoading(false);
      return;
    }
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const nameFromSlug = decodeURIComponent(productName).replace(/-/g, " ");
        const response = await axios.get(`${BASE_URL}/product/name/${encodeURIComponent(nameFromSlug)}`);
        setProduct(response.data?.product || null);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [productName]);

  // Refreshes series carousel on the client after hydration
  const fetchSeriesProducts = useCallback(async () => {
    if (!product?.series) return;
    setCount(1);
    try {
      const response = await axios.get(`${BASE_URL}/product/series/${product.series}`);
      setSeriesProducts(response?.data?.products || []);
    } catch {
      setSeriesProducts([]);
    }
  }, [product?.series]);

  // Refreshes brand row on the client after hydration
  const fetchExploreBrands = useCallback(async () => {
    if (!product?.brand) return;
    try {
      const response = await axios.get(`${BASE_URL}/product/brand/${product.brand}?page=1&pageSize=10`);
      setExploreBrands(response?.data?.products || []);
    } catch {
      setExploreBrands([]);
    }
  }, [product?.brand]);

  useEffect(() => {
    fetchExploreBrands();
  }, [fetchExploreBrands]);

  useEffect(() => {
    if (product?.series) fetchSeriesProducts();
  }, [fetchSeriesProducts, product?.series]);

  useEffect(() => {
    setElement(ref.current);
  }, [setElement]);

  const selectDiscount = (text) => setSelectedDiscount(text);

  const isInCart = () => {
    const userId = getUserId();
    if (userId) {
      return data?.items?.find((item) => item.productId._id === product?._id);
    } else {
      const localCart = getCartFromLocalStorage();
      return localCart.find((item) => item.productId === product?._id);
    }
  };

  const increase = () => {
    const cartItem = isInCart();
    if (cartItem) {
      increaseItem({ itemId: product?._id, quantity: 1 });
    } else {
      setCount((v) => v + 1);
    }
  };

  const decrease = () => {
    const cartItem = isInCart();
    if (cartItem) {
      decreaseItem({ itemId: product?._id, quantity: 1 });
    } else {
      setCount((v) => (v <= 1 ? 1 : v - 1));
    }
  };

  const onClick = () => {
    if (count <= 0) return;
    addToCart({
      itemId: product?._id,
      quantity: count,
      price: product?.price,
      localCartImage: product?.mainImage,
      name: product?.name,
      applyDiscount: product?.discount === true,
      series: product?.series,
    });
    if (typeof window !== "undefined" && window.twq) {
      window.twq("event", "tw-pioaa-pioad", {
        value: product?.price * count,
        currency: "NGN",
        contents: [{
          content_type: "product",
          content_id: product?._id,
          content_name: product?.name,
          content_price: product?.price,
          num_items: count,
          content_group_id: product?.category || "general",
        }],
        status: "started",
        conversion_id: `cart-${Date.now()}`,
      });
    }
  };

  const onClickCheckout = () => {
    addToCart({ itemId: product?._id, quantity: count || 1, price: product?.price, localCartImage: product?.mainImage, name: product?.name });
    router.push("/checkout");
  };

  const images = [
    product?.mainImage,
    product?.firstImage,
    product?.secondImage,
    product?.thirdImage,
  ].filter(Boolean);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel();

  const scrollTo = useCallback((index) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [addingFbt, setAddingFbt] = useState(false);

  const handleSelectProducts = (checked, productId) => {
    if (checked) {
      setSelectedProducts((prev) => [...prev, { "": productId }]);
    } else {
      setSelectedProducts(selectedProducts.filter((p) => p !== productId));
    }
  };

  const handleAddManyToCart = async () => {
    setAddingFbt(true);
    const userId = getUserId();
    try {
      if (!userId) return;
      await axios.post(`${BASE_URL}/add/fbt/cart/${userId}`, {
        productIds: selectedProducts,
        quantity: 1,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setAddingFbt(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (!product) return (
    <Wrapper className="py-16 text-center">
      <p className="text-lg">Product not found.</p>
      <Link href="/all-products" className="underline text-app-red mt-4 inline-block">Browse all products</Link>
    </Wrapper>
  );

  return (
    <>
      {/*
        noscript removed: the component now SSRs so this was producing a
        duplicate h1 alongside the sr-only one in page.jsx.
        Crawler-visible links (category, similar products) are rendered
        in the main SSR output below.
      */}

      <Wrapper className="bg-white w-full js-enabled">
        <Link href={toCategoryPath(product?.category ?? "perfume")} className="flex items-center gap-1 text-sm text-[#555] mt-4">
          <MoveLeft className="w-4 h-4" />
          <span>Back to {product?.category}</span>
        </Link>
        <Navigation
          location={[
            { description: "Home", href: "/", title: "Go to Home Page" },
            { description: product?.category ?? "Perfume", href: toCategoryPath(product?.category ?? "Perfume") },
            { description: product?.name ?? "", href: "" },
          ]}
          className="text-[#A0A0A0] py-8 px-4"
          iconClassName="text-[#A0A0A0] mx-2"
          currentLocationClassName="text-app-black"
        />

        <div className="pb-6 bg-white px-4 md:px-6 md:py-6">
          <div className="grid gap-8 md:gap-12 md:grid-cols-2">
            {/* Images */}
            <div className="w-[90vw] m-auto relative md:w-full">
              {product?.available === false ? (
                <span className="absolute z-20 right-2 top-2 mt-2 mr-2 text-sm bg-[#00000060] rounded text-white px-2 py-[2px] w-fit ml-auto">Sold Out</span>
              ) : (
                <Share2 className="absolute z-20 right-2 top-2 mt-2 mr-2 cursor-pointer w-fit ml-auto" />
              )}

              {/* Carousel */}
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                  {images.map((img, index) => (
                    <div key={index} className="min-w-full flex justify-center">
                      <div className="rounded-2xl overflow-hidden bg-gray-200 w-full aspect-square">
                        <img
                          src={img}
                          alt={`${product?.name} product image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Indicator Dots */}
              <div className="flex justify-center gap-2 pt-4 mb-4">
                {images.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all border cursor-pointer ${selectedIndex === index ? "bg-[#3B9BCE]" : "bg-white"}`}
                    onClick={() => scrollTo(index)}
                  />
                ))}
              </div>

              {/* Series Products - Mobile */}
              {seriesProducts?.length > 0 && (
                <Carousel className="mt-8 m-auto w-[70vw]">
                  <CarouselContent className="gap-4">
                    {seriesProducts.map((item, index) => (
                      <CarouselItem
                        key={index}
                        className={`md:hidden items-center justify-center rounded-full flex bg-[#f7f7f7] p-2 max-w-[60px] h-[60px] ${item._id === product._id ? "border-2 border-[#979494]" : ""}`}
                      >
                        <Link href={toProductPath(item?.name)} className="w-[95%] m-auto h-[95%] flex items-center justify-center">
                          <img src={item?.mainImage} className="m-auto h-full w-full rounded-full object-cover" alt={item?.name} />
                        </Link>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="border-none md:hidden -left-10 w-6 h-6" />
                  <CarouselNext className="border-none w-6 h-6 -right-10 md:hidden rounded-full" />
                </Carousel>
              )}

              {/* Discount Section */}
              {product?.discount && (
                <div className="mt-4">
                  {!showDiscount ? (
                    <div
                      className="bg-black rounded-full md:rounded-none gap-6 flex justify-between items-center px-8 cursor-pointer hover:bg-[#333] transition-all text-white h-12 mt-4"
                      onClick={() => setShowDiscount(true)}
                    >
                      <img src={icons.Star} alt="Star" />
                      <span className="leading-4 text-sm text-center">Click Here To Find Better Deals</span>
                      <img src={icons.Star} alt="Star" />
                    </div>
                  ) : (
                    <div>
                      <h3 className="bg-[#C8FCF9] p-8 rounded-lg mb-4 text-2xl font-semibold text-center">
                        Equivalent purchase of different items in this collection attracts similar discounts.
                      </h3>
                      <Select onValueChange={selectDiscount}>
                        <SelectTrigger>
                          <SelectValue placeholder={
                            <div className="text-black w-full font-semibold flex justify-between">
                              <span>1 /</span> <span>Normal price</span>
                            </div>
                          } />
                        </SelectTrigger>
                        <SelectContent>
                          {disVar.map((dis) => (
                            <SelectItem key={dis.quantity} className="px-4 block cursor-pointer" value={dis.quantity}>
                              {dis.packs} / <span className="text-orange-400">₦{calculateDiscountedPrice(product?.price, dis.dis).toLocaleString()}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {selectedDiscount && (
                    <section>
                      <p className="text-center font-semibold text-sm mt-2">Select an option</p>
                      {["1_2", "3_5", "6_8", "9_11", "12"].map((key) => {
                        if (selectedDiscount !== key) return null;
                        const ranges = { "1_2": [1, 2], "3_5": [3, 4, 5], "6_8": [6, 7, 8], "9_11": [9, 10, 11], "12": [12, 13, 14, 15] };
                        return (
                          <div key={key} className="flex flex-wrap items-center gap-2 my-2">
                            {ranges[key].map((item) => (
                              <div
                                key={item}
                                className={`border cursor-pointer transition-all p-2 flex gap-1 text-sm ${selectedQuantity === item ? "bg-[#C8FCF9] font-semibold" : ""}`}
                                onClick={() => setSelectedQuantity(item)}
                              >
                                {item} <span>pcs</span>
                              </div>
                            ))}
                            {key === "12" && (
                              <div className="border cursor-pointer p-2 w-[100px]">
                                <input
                                  value={selectedQuantity > 15 ? selectedQuantity : ""}
                                  type="text"
                                  placeholder="16 & above"
                                  onChange={(e) => setSelectedQuantity(e.target.value)}
                                  className="border-none outline-none w-full"
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </section>
                  )}

                  <Button
                    disabled={!selectedQuantity}
                    className="capitalize cursor-pointer font-semibold border-2 border-black mt-4 text-black"
                    onClick={() => {
                      addToCart({
                        itemId: product?._id,
                        quantity: selectedQuantity,
                        applyDiscount: product?.discount === true,
                        name: product?.name,
                        price: product?.price,
                        localCartImage: product?.mainImage,
                        series: product?.series,
                      });
                      if (window?.twq) {
                        window.twq("event", "tw-pioaa-pioad", {
                          value: product?.price * selectedQuantity,
                          currency: "NGN",
                          contents: [{
                            content_type: "product",
                            content_id: product?._id,
                            content_name: product?.name,
                            content_price: product?.price,
                            num_items: selectedQuantity,
                            content_group_id: product?.category || "discounted",
                          }],
                          status: "started",
                          conversion_id: `discount-cart-${Date.now()}`,
                        });
                      }
                    }}
                  >
                    Add to Cart
                  </Button>
                </div>
              )}
            </div>

            {/* Product Details - Right */}
            <div>
              <div className="md:mt-6 py-3">
                <h3 className="md:text-4xl text-2xl font-medium text-[#020817]">{product?.name}</h3>
              </div>
              {product?.barcode && (
                <li className="mt-2 text-[#3E3C3C] font-inter font-medium text-sm">
                  <span className="text-[#606060] font-inter">{product?.barcode}</span>
                </li>
              )}
              {product?.fragranceType && (
                <li className="mt-2"><span className="capitalize text-[#555]">{product?.fragranceType}</span></li>
              )}
              {product?.fragranceFamily && (
                <li className="mt-2"><span className="capitalize text-[#555]">{product?.fragranceFamily}</span></li>
              )}

              <div className={cn("flex items-center justify-between gap-4 my-4", product?.available === false ? "hidden" : "flex")}>
                <div className="md:border-y-[1px] md:border-t-black">
                  <p className="md:text-3xl text-[24px] font-medium text-[#020817]">
                    ₦<span className="font-inter">{format(product?.price)}</span>
                  </p>
                </div>
                <div className="flex items-center bg-[#F5F5F5]">
                  <button onClick={decrease} className="h-12 w-14 aspect-square grid place-items-center font-medium">
                    <Icon icon="ic:round-minus" style={{ fontSize: 18 }} />
                  </button>
                  <span className="text-xl font-inter font-normal">{isInCart()?.quantity || count}</span>
                  <button onClick={increase} className="h-12 w-14 text-xl aspect-square grid place-items-center font-medium">
                    <Icon icon="ph:plus-bold" style={{ fontSize: 18 }} />
                  </button>
                </div>
              </div>

              {product?.available === false ? (
                <Button className="btn mt-8" onClick={() => toggleNotificationDialog(product?._id || product?.id)}>
                  Notify Me
                </Button>
              ) : (
                <div className="flex gap-8 md:space-x-4 mt-4">
                  <Button
                    variant="rectangle"
                    onClick={onClickCheckout}
                    className="bg-[#0FA958] text-white text-sm lg:text-xl py-1 lg:py-3 w-full font-semibold disabled:bg-[#848484] rounded-full"
                  >
                    Buy Now
                  </Button>
                  {!(data?.items?.find((item) => item?.productId?._id === product?._id)) ? (
                    <Button
                      disabled={!count}
                      variant="outline"
                      onClick={onClick}
                      className="w-full text-sm lg:text-xl py-3 disabled:bg-[#848484] bg-white rounded-full"
                    >
                      Add to Cart
                    </Button>
                  ) : (
                    <Link href="/cart" style={{ display: "contents" }}>
                      <Button
                        variant="rectangle"
                        className="text-sm lg:text-xl bg-transparent border-2 text-black border-black rounded-none py-3 w-full font-semibold"
                      >
                        Go to Cart
                      </Button>
                    </Link>
                  )}
                </div>
              )}

              <div className="mt-8 hidden md:block">
                <div className="flex border-y py-4 items-center gap-4 text-[#0F0C0C]">
                  <img src="/icons/return.png" width={52} height={52} alt="Return icon" />
                  <div>
                    <p className="font-medium text-[17px]">Return &amp; Refund</p>
                    <span className="text-sm">Easy return within 7 days for all eligible items.</span>
                  </div>
                </div>
                <div className="flex border-y py-4 items-center gap-4 text-[#0F0C0C]">
                  <img src="/icons/shipping.png" width={52} height={52} alt="Shipping icon" />
                  <div>
                    <p className="font-medium text-[17px]">Shipping</p>
                    <span className="text-sm">Orders are processed and shipped within 3 - 5 days.</span>
                  </div>
                </div>
                <div className="flex border-y py-4 items-center gap-4 text-[#0F0C0C]">
                  <img src="/icons/shipping_policy.png" width={26} height={26} alt="Shipping policy icon" className="ml-4 mr-2" />
                  <div>
                    <p className="font-medium text-[17px]">Shipping Policy</p>
                    <span className="text-sm">Freight cost of ₦2,500 across Nigeria.</span>
                  </div>
                </div>
                <div className="flex border-y py-4 items-center gap-4 text-[#0F0C0C]">
                  <img src="/icons/customer.png" width={40} height={40} alt="Customer icon" className="ml-2" />
                  <div>
                    <p className="font-medium text-[17px]">
                      Customer support and fragrance consultant{" "}
                      <a href="#footer" className="text-blue-500 text-sm">see details</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Series Products - Desktop */}
        {seriesProducts?.length > 0 && (
          <Carousel className="mt-8">
            <CarouselContent className="gap-4">
              {seriesProducts.map((item, index) => (
                <CarouselItem key={index} className="basis-[9%] hidden md:block items-center justify-center rounded-full p-2 bg-gray-50 border">
                  <Link href={toProductPath(item?.name)} className="w-full m-auto h-full">
                    <img src={item?.mainImage} className="w-full m-auto h-full object-cover rounded-full" alt={item?.name} />
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}
      </Wrapper>

      <div>
        <ProductDetail productId={product?._id} product={product} />
        <Wrapper>
          {/* Dupes — rendered from product.similar which is in initialProduct (SSR) */}
          {Array.isArray(product?.similar) && product.similar.length > 0 && (
            <div className="mb-4">
              <div className="flex justify-between gap-2 mt-8 overflow-hidden">
                <Heading className="text-lg font-bold text-app-black">Dupes</Heading>
              </div>
              <ul className="pt-8 w-full gap-4 flex sm:flex-nowrap overflow-auto sm:no-scrollbar" ref={ref}>
                {product.similar.map((item) => (
                  <li className="" key={item?._id}>
                    <Product
                      key={item?._id}
                      id={item?._id}
                      product={item?.name || "Product Title"}
                      name={item?.name || "Product Title"}
                      category={item?.category}
                      originalPrice={item?.price}
                      available={item?.available}
                      image={item?.productImage || item?.mainImage}
                      className="w-[13rem] md:w-[17rem]"
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Explore Brands — seeded from initialExploreBrands (SSR) */}
          {Array.isArray(exploreBrands) && exploreBrands.length > 0 && (
            <div className="mb-4">
              <div className="flex justify-between gap-2 mt-8 overflow-hidden">
                <Heading className="text-lg font-bold text-app-black">Explore Brands</Heading>
              </div>
              <ul className="pt-8 w-full gap-4 flex sm:flex-nowrap overflow-auto sm:no-scrollbar" ref={ref}>
                {exploreBrands.map((item) => (
                  <li className="" key={item?._id}>
                    <Product
                      key={item?._id}
                      id={item?._id}
                      product={item?.name || "Product Title"}
                      name={item?.name || "Product Title"}
                      category={item?.category}
                      originalPrice={item?.price}
                      available={item?.available}
                      image={item?.productImage || item?.mainImage}
                      className="w-[13rem] md:w-[17rem]"
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recently Viewed — client-only (localStorage), intentionally not SSR'd */}
          {Array.isArray(recentlyViewed) && recentlyViewed.length > 0 && (
            <div className="mb-4">
              <div className="flex justify-between gap-2 mt-8 overflow-hidden">
                <Heading className="text-lg font-bold text-app-black">Recently Viewed</Heading>
              </div>
              <ul className="pt-8 w-full gap-4 flex sm:flex-nowrap overflow-auto sm:no-scrollbar" ref={ref}>
                {recentlyViewed.map((item) => (
                  <li className="" key={item?._id}>
                    <Product
                      key={item?._id}
                      id={item?._id}
                      product={item?.name || "Product Title"}
                      name={item?.name || "Product Title"}
                      category={item?.category}
                      originalPrice={item?.price}
                      available={item?.available}
                      image={item?.productImage || item?.mainImage}
                      className="w-[13rem] md:w-[17rem]"
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* FBT */}
          {product?.FBT?.length > 0 && (
            <div className="mt-16 hidden md:w-[60%] max-w-[600px] md:text-center mx-auto my-8">
              <Heading className="mt-3 mb-8 font-bold text-app-black">Frequently Bought Together</Heading>
              <section className="hidden"><FBTList products={product?.FBT} /></section>
              <div className="hidden flex-col items-start gap-2 my-4">
                {product.FBT.map((item, index) => (
                  <div className="flex items-center gap-2" key={index}>
                    <input type="checkbox" id={`product-${item?._id}`} className="size-4"
                      onChange={(e) => handleSelectProducts(e.target.checked, item?._id)} />
                    <label htmlFor={`product-${item?._id}`} className="line-clamp-1 capitalize">{item?.name}</label>
                  </div>
                ))}
              </div>
              <Button
                disabled={selectedProducts?.length === 0 || addingFbt}
                className="bg-black hover:bg-[#333] border border-black mt-8 text-white"
                onClick={handleAddManyToCart}
              >
                {addingFbt ? <span>Adding...</span> : <span>Add To Cart</span>}
              </Button>
            </div>
          )}
        </Wrapper>
      </div>
    </>
  );
};