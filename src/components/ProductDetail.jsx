"use client";

import { Icon } from "@iconify/react";
import { Button } from "./ui/Button";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/utils/useAuth";
import * as yup from "yup";
import { useFormik } from "formik";
import axios from "../utils/axios";
import { Input } from "./Input";
import { useCanSubmitForm } from "../hooks/utils/useCanSubmitFormik";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { CategoryPanel } from "./CategoryPanel";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/ToolTip";
import { Wrapper } from "./ui/Wrapper";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion";
import { BookText, FileBadge, Truck, Undo2 } from "lucide-react";

const getStoredUser = () => {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem("mkhasa_user"));
  } catch {
    return null;
  }
};

export const ProductDetail = ({ productId, product }) => {
  const { getUserId } = useAuth();
  const schema = yup.object().shape({
    email: yup.string().email().required(),
    name: yup.string().trim().required(),
    review: yup.string().trim().required(),
  });
  const user = getStoredUser();

  const formik = useFormik({
    validationSchema: schema,
    initialValues: {
      name: user?.name,
      email: "",
      review: "",
    },
    onSubmit: handleSubmitReview,
  });

  const mutation = useMutation({
    mutationFn: (values) => {
      return axios.post(`/add/review/${getUserId()}/${productId}`, values, {
        headers: { "Content-Type": "application/json" },
      });
    },
  });

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const onClick = (rate) => {
    setRating(rate);
  };
  const searchParams = useSearchParams();
  const [tab, setTab] = useState(searchParams.get("tab") || "description");
  const onTabClick = (tab) => {
    if (!tab) return;
    // tab state managed locally
    setTab(tab);
  };

  const canSubmit = useCanSubmitForm(formik, rating > 0);

  async function handleSubmitReview(values, { resetForm }) {
    if (rating < 1) {
      return alert("Please select rating");
    }
    mutation.mutate(
      { rating, ...values },
      {
        onSuccess: () => {
          resetForm();
          setRating(0);
        },
        onError: () => {
        },
      }
    );
  }

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`/review/${productId}`);
        setReviews(response?.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [productId]);

  return (
    <div className="bg-white px-6 py-4 mb-6 mt-2">
      <CategoryPanel />
      <div className="my-8 md:hidden">

        <div className="flex border-y py-4 items-center gap-4 text-[#0F0C0C] text-[1rem]">
          <img src="/icons/return.png" width={52} height={52} alt={"Return icon"} />
          <div>
            <p className="font-medium text-[17px]">Return & Refund</p>
            <span className="text-sm">Easy return within 7 days for all eligible items.</span>
          </div>
        </div>
        <div className="flex border-y py-4 items-center gap-4 text-[#0F0C0C] text-[1rem]">
          <img src="/icons/shipping.png" width={52} height={52} alt="Shipping Icon" />
          <div>
            <p className="font-medium text-[17px]">Shipping</p>
            <span className="text-sm">Orders are processed and shipped within 3 - 5days.</span>
          </div>
        </div>
        <div className="flex border-y py-4 items-center gap-4 text-[#0F0C0C] text-[1rem]">
          <img src="/icons/shipping_policy.png" width={26} height={26} alt="Shipping policy icon" className="ml-4 mr-2" />
          <div>
            <p className="font-medium text-[17px]">Shipping Policy</p>
            <span className="text-sm">Freight cost of ₦2,500 across Nigeria.</span>
          </div>
        </div>
        <div className="flex border-y py-4 items-center gap-4 text-[#0F0C0C] text-[1rem]">
          <img src="/icons/customer.png" width={40} height={40} alt="Customer Icon" className="ml-2" />
          <div>
            <p className="font-medium text-[17px]">Customer support and fragrance consultant <a href="#footer" className="text-blue-500 text-sm">see details</a></p>
          </div>
        </div>

      </div >
   

      {/* Tab switch for mobile and tablet */}
      <div className="md:hidden">
        <div className="border-b-2 flex">
          <button
            className={`py-2 ${tab == "description" && "font-bold bg-[#C8FFE2]"}  w-full`}
            onClick={() => onTabClick("description")}
          >
            Description
          </button>
          <button
            className={`py-2 ${tab == "reviews" && "font-bold bg-[#C8FFE2]"}  w-full`}
            onClick={() => onTabClick("reviews")}
          >
            Reviews
          </button>
        </div>
      </div>

      {/* Content for mobile and tablet */}
      <div className="md:hidden">
        {
          tab == "description" ? (
            <DescriptionContent product={product} />
          ) : (
            <ReviewsContent
              reviews={reviews}
              rating={rating}
              setRating={setRating}
              formik={formik}
              canSubmit={canSubmit}
              getUserId={getUserId}
              handleSubmitReview={handleSubmitReview}
            />
          )
        }
      </div>

      {/* Content for laptop and desktop */}
      <div className="hidden md:block">
        <DescriptionContent product={product} />
        <ReviewsContent
          reviews={reviews}
          rating={rating}
          setRating={setRating}
          formik={formik}
          canSubmit={canSubmit}
          getUserId={getUserId}
          handleSubmitReview={handleSubmitReview}
        />
      </div>
    </div>
  );
};

export const DescriptionContent = ({ product, accordion }) => {
  return (
    <div className="mt-5">
      {/* Heading for mobile */}
      {/* <h2 className="text-2xl md:hidden font-bold mb-2">Description</h2> */}
      {/* Heading for tab and laptop */}
      <div className={`relative hidden ${!accordion && "md:inline-block"}  border w-full bg-[#C8FFE2] p-2`}>
        <h2 className="text-2xl font-bold ">Description</h2>
      </div>
      <hr className="h-px mb-5 bg-gray-200  hidden md:block border-0 dark:bg-gray-700" />

      <Wrapper>
        <div className="border-b md:border-none ">
          {product?.description && (
            <p className="py-1">{product.description}</p>
          )}
          {product?.appeal && (
            <p className="py-1 capitalize">
              <span className="font-bold">APPEAL:</span> {product.appeal}
            </p>
          )}
          {product?.type && (
            <p className="py-1 capitalize">
              <span className="font-bold">TYPE:</span>{" "}
              {product.type.replace(/-/g, " ")}
            </p>
          )}
          {product?.volume && (
            <p className="py-1 capitalize">
              <span className="font-bold">VOLUME:</span> {product.volume}
            </p>
          )}
        </div>
        <div className="mt-3 border-b-2 md:border-none border-gray-500 pb-3">
          {(product?.topNotes ||
            product?.topNotes === null ||
            product?.topNotes === "undefined") && (
              <p className="py-1">
                <span className="font-bold capitalize">Top Notes:</span>{" "}
                {product.topNotes}
              </p>
            )}
          {product?.middleNotes && (
            <p className="py-1">
              <span className="font-bold capitalize">Middle Notes:</span>{" "}
              {product.middleNotes}
            </p>
          )}
          {product?.baseNotes && (
            <p className="py-1">
              <span className="font-bold capitalize">Base Notes:</span>{" "}
              {product.baseNotes}
            </p>
          )}
        </div>
      </Wrapper>
    </div >
  );
};
// SHIPPING CHARGES
export const ShippingChargesContent = () => {
  return (
    <div className="mt-5">
      <hr className="h-px mb-5 bg-gray-200  hidden md:block border-0 dark:bg-gray-700" />

      <Wrapper>
        <div >
          <p className="py-1 capitalize">
            <span className="font-bold">Delivery Cost:</span> ₦2,500.00 across Nigeria
          </p>
          <p className="py-1 capitalize">
            <span className="font-bold">Delivery Time:</span>
            <p> - 3 days max within Lagos</p>
            <p> - 5 days max outside Lagos</p>
            <p> - Orders placed after 4 pm will begin processing the next business day.</p>
          </p>
          <p>Customers may occasionally be required to pick up their package from a designated office address..</p>
        </div>

      </Wrapper>
    </div>
  );
};
export const ShippingPolicyContent = () => {
  return (
    <div className="mt-5">
      <hr className="h-px mb-5 bg-gray-200  hidden md:block border-0 dark:bg-gray-700" />

      <Wrapper>
        <div className="border-none space-y-4 ">
          <div className="space-y-2">
            <p className="py-1 capitalize">
              <span className="font-bold block">General Information</span>
            </p>
            <p>We highly value every order from our esteemed customers and are grateful for the business opportunity offered to us.</p>
            <p>Thank you! Swift and safe delivery of your goods is crucial to us as it ensures better customer satisfaction and appraisal.</p>
            <p>To maintain the quality of our service, we have carefully selected our courier partners.</p>
          </div>
          <div className="space-y-2">
            <p className="py-1 capitalize">
              <span className="font-bold block">Please note:</span>
            </p>
            <p> - All deliveries must be signed for. If you are unavailable, kindly inform us of an alternative recipient, such as a colleague or neighbor.</p>
            <p> - Sundays and public holidays are excluded from delivery schedules and may affect delivery times.</p>
          </div>

          <div className="space-y-2">
            <p className="py-1 capitalize">
              <span className="font-bold block">Important Information:</span>
            </p>
            <p> - Mkhasa is not responsible for any damages caused after delivery.</p>
            <p> - Mkhasa bears no responsibility for goods signed by an alternative person.</p>
            <p> - All claims for shortages or damages must be reported to customer service on the day of delivery.</p>
            <p> - We are unable to redirect orders once items have been shipped.</p>
          </div>

        </div>
        <p className="mt-8">If you have any further queries regarding Mkhasa delivery, please contact our Support Team at customercare@mkhasa.com from Monday to Saturday, 8.00 am - 6.00 pm.</p>

      </Wrapper>
    </div>
  );
};

export const ReturnRefundContent = () => {
  return (
    <div className="mt-5">
      <hr className="h-px mb-5 bg-gray-200  hidden md:block border-0 dark:bg-gray-700" />

      <Wrapper>
        <div className="border-none space-y-4 ">
          <div className="space-y-2">
            <p className="py-1 capitalize">
              <span className="font-bold block">Return & Refund</span>
            </p>
            <p> - Merchandise must be returned within 7 days in new condition.</p>
            <p> - Return requests after 7 days will not be accepted.</p>
            <p> - Merchandise must not be worn, used, altered, or washed and must be in its original packaging with all tags attached, including seals and security tags.</p>
            <p> - Perfumes must include the original packaging in its original condition, without packing tape or postal labels.</p>
            <p> - Final Sale items are not eligible to be returned.</p>
          </div>
          <div className="space-y-2">
            <p className="py-1 capitalize">
              <span className="font-bold block">How To Initiate A Return</span>
            </p>
            <div>
              <span className="font-semibold"> - Start you return online: </span>
              <span>Reach out via WhatsApp, SMS, or Instagram (IG) to initiate a return.</span>
            </div>
            <div>
              <span className="font-semibold"> - Refund account details: </span>
              <span>Payment of returned items will be made to the account given during the chat.</span>
            </div>
            <div>
              <span className="font-semibold"> - Pack up your items: </span>
              <span>Merchandise must be returned in the original packaging. No labels or tape on product packaging.</span>
            </div>
            <div>
              <span className="font-semibold"> - Drop off your package: </span>
              <span>Items are sent via the customer’s preferred freight company to a location given by the customer care representative.</span>
            </div>

          </div>
          <div className="space-y-2">
            <p className="py-1 capitalize">
              <span className="font-bold block">How To Track Your Return</span>
            </p>
            <div>
              <span> - You can track your return via your freight agent, and you will be notified upon pickup</span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="py-1 capitalize">
              <span className="font-bold block">When You'll Receive Your Refund</span>
            </p>
            <div>
              <span className="font-semibold"> - FAST REFUNDS: </span>
              <span>For eligible orders, your refund will be issued within 24 hours of pickup.</span>
              <span>Eligible refunds are issued immediately.</span>
              <span>Refunds for some customers can take up to 3 days.</span>
            </div>
          </div>
        </div>

      </Wrapper>
    </div>
  );
};

const ReviewsContent = ({
  reviews,
  rating,
  setRating,
  formik,
  canSubmit,
  getUserId,
  handleSubmitReview,
}) => {
  const user = getStoredUser();
  // console.log(reviews)
  return (
    <div className="mt-8">
      {/* Heading for mobile */}
      <h2 className="text-2xl md:hidden font-bold mb-4 ">Reviews</h2>
      {/* Heading for tab and laptop */}
      <div className="relative hidden md:inline-block  w-full bg-[#C8FFE2] p-2">
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 h-0.5 w-full bg-black"></div>
      </div>
      <hr className="h-px mb-5 hidden md:block bg-gray-200 border-0 dark:bg-gray-700" />
      <Wrapper>
        <div className="flex gap-4 items-end">
          <p className="font-medium text-4xl">4.5</p>
          <p>Average Ratings</p>
        </div>
        <ul className="grid gap-2 pt-4 max-h-[480px] overflow-y-auto">
          {reviews?.map(({ review, name, rating }, i) => (
            <li key={i}>
              <Review review={review} reviewer={name} rating={rating} />
            </li>
          ))}
        </ul>

        {getUserId() ? (
          <div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <p>Your Rating</p>
                  <Rating
                    rating={rating}
                    onClick={(newRating) => setRating(newRating)}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Select your rating for this product</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <form onSubmit={formik.handleSubmit} className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  className="py-2 px-4 outline-none border-[#F5F5F5] bg-[#F5F5F5] w-full col-span-2"
                  placeholder="Name"
                  formik={formik}
                  name={"name"}
                />
                <Input
                  className="py-2 px-4 outline-none border-[#F5F5F5] bg-[#F5F5F5] w-full col-span-2"
                  placeholder="Email"
                  formik={formik}
                  value={user?.email}
                  name={"email"}
                />
              </div>
              <div className="py-2 w-full">
                <textarea
                  cols="30"
                  rows="6"
                  placeholder="Your Review"
                  className="py-4 px-4 outline-none border-[#F5F5F5] bg-[#F5F5F5] w-full"
                  {...formik.getFieldProps("review")}
                ></textarea>
                {formik.errors["review"] && (
                  <p className="text-app-red"> {formik.errors["review"]}</p>
                )}
              </div>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="w-full">
                    <Button
                      type="submit"
                      variant="rectangle"
                      className="bg-app-black text-white font-medium rounded-none w-full px-4 hover:bg-app-black disabled:bg-[#999999] hover:disabled:bg-[#999999]"
                      disabled={!canSubmit}
                    >
                      Submit Review
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className={rating > 0 ? "hidden" : ""}>
                    <p>You must select rating to proceed</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </form>
          </div>
        ) : (
          <p>You need to be logged in to give a review</p>
        )}
      </Wrapper>
    </div>
  );
};

const Review = ({ review, reviewer, rating }) => {
  return (
    <div>
      <Rating rating={rating} />
      <h2 className="font-bold">{reviewer}</h2>
      <p>{review}</p>
    </div>
  );
};

const Rating = ({ rating = 0, onClick = () => { } }) => {
  let stars = [];
  for (let i = 0; i < rating; i++) {
    stars.push("iconamoon:star-fill");
  }
  for (let i = 0; i < 5 - rating; i++) {
    stars.push("lucide:star");
  }

  return (
    <div className="flex gap-[1px] py-1">
      {stars.map((icon, i) => (
        <button key={i}>
          <Icon
            icon={icon}
            onClick={() => onClick(i + 1)}
            className="text-black fill-green-500"
          />
        </button>
      ))}
    </div>
  );
};
