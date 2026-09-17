"use client";

import React from "react";

export const Delivery = () => {
  const deliveryRates = [
    {
      location: "Lagos",
      charge: "₦3,500",
      states: "Lagos",
    },
    {
      location: "Abuja (FCT)",
      charge: "₦4,500",
      states: "Federal Capital Territory (FCT)",
    },
    {
      location: "South West",
      charge: "₦4,500",
      states: "Ekiti, Ogun, Ondo, Osun, Oyo",
    },
    {
      location: "South East",
      charge: "₦4,500",
      states: "Abia, Anambra, Ebonyi, Enugu, Imo",
    },
    {
      location: "South South",
      charge: "₦4,500",
      states: "Akwa Ibom, Bayelsa, Cross River, Delta, Edo, Rivers",
    },
    {
      location: "North Central",
      charge: "₦5,500",
      states: "Benue, Kogi, Kwara, Nasarawa, Niger, Plateau",
    },
    {
      location: "North East",
      charge: "₦5,500",
      states: "Adamawa, Bauchi, Borno, Gombe, Taraba, Yobe",
    },
    {
      location: "North West",
      charge: "₦5,500",
      states: "Jigawa, Kaduna, Kano, Katsina, Kebbi, Sokoto, Zamfara",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl rounded-2xl bg-white px-5 py-8 shadow-sm ring-1 ring-gray-100 sm:px-8 md:px-12 lg:px-16">
      {/* Page Header */}
      <div className="mb-8 border-b border-gray-200 pb-6">
        <span className="mb-2 inline-block rounded-full bg-red-50 px-3 py-1 text-sm font-semibold text-red-600">
          Mkhasa Customer Information
        </span>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Shipping & Return Policy
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-600 sm:text-base">
          We are committed to ensuring that your orders are delivered safely,
          promptly, and conveniently.
        </p>
      </div>

      {/* Business Days */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-bold text-gray-900">
          Business Days
        </h2>

        <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-4">
          <p className="font-medium text-gray-700">Monday to Saturday</p>
        </div>
      </section>

      {/* General Information */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-bold text-gray-900">
          General Information
        </h2>

        <p className="mb-4 leading-7 text-gray-600">
          We highly value every order from our esteemed customers and are
          grateful for the business opportunity offered to us. Swift and safe
          delivery of your goods is crucial to us because it ensures better
          customer satisfaction and service quality. To maintain the quality
          of our service, we have carefully selected our courier partners.
        </p>

        <div className="rounded-xl border-l-4 border-red-600 bg-red-50 p-4">
          <h3 className="mb-2 font-semibold text-red-700">Please note:</h3>

          <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-gray-700">
            <li>
              All deliveries must be signed for. If you are unavailable,
              kindly inform us of an alternative recipient, such as a
              colleague or neighbour.
            </li>

            <li>
              Sundays and public holidays are excluded from delivery schedules
              and may affect delivery times.
            </li>
          </ul>
        </div>
      </section>

      {/* Delivery Charges and Times */}
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          Delivery Charges and Times
        </h2>

        {/* Delivery Charges Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="bg-red-600 text-white">
                <tr>
                  <th className="px-4 py-4 font-semibold sm:px-6">
                    Delivery Location
                  </th>

                  <th className="px-4 py-4 font-semibold sm:px-6">
                    States Covered
                  </th>

                  <th className="whitespace-nowrap px-4 py-4 font-semibold sm:px-6">
                    Delivery Charge
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {deliveryRates.map((rate) => (
                  <tr
                    key={rate.location}
                    className="transition-colors hover:bg-red-50"
                  >
                    <td className="px-4 py-4 font-semibold text-gray-900 sm:px-6">
                      {rate.location}
                    </td>

                    <td className="px-4 py-4 leading-6 text-gray-600 sm:px-6">
                      {rate.states}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 font-semibold text-gray-900 sm:px-6">
                      {rate.charge}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delivery Times Table */}
        <div className="mt-6 overflow-hidden rounded-xl border border-gray-200">
          <div className="bg-gray-900 px-4 py-4 sm:px-6">
            <h3 className="font-semibold text-white">
              Estimated Delivery Times
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-4 font-semibold sm:px-6">
                    Delivery Area
                  </th>

                  <th className="px-4 py-4 font-semibold sm:px-6">
                    Estimated Delivery Time
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                <tr className="transition-colors hover:bg-gray-50">
                  <td className="px-4 py-4 text-gray-700 sm:px-6">
                    Within Lagos
                  </td>

                  <td className="px-4 py-4 font-medium text-gray-900 sm:px-6">
                    Up to 2 business days
                  </td>
                </tr>

                <tr className="transition-colors hover:bg-gray-50">
                  <td className="px-4 py-4 text-gray-700 sm:px-6">
                    Outside Lagos
                  </td>

                  <td className="px-4 py-4 font-medium text-gray-900 sm:px-6">
                    5–7 business days
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-gray-50 p-4">
          <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-gray-600">
            <li>
              Orders placed after 4:00 p.m. will begin processing on the next
              business day.
            </li>

            <li>
              Customers may occasionally be required to pick up their packages
              from a designated office address.
            </li>
          </ul>
        </div>
      </section>

      {/* Important Information */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-bold text-gray-900">
          Important Information
        </h2>

        <ul className="list-disc space-y-2 pl-5 leading-7 text-gray-600">
          <li>Mkhasa is not responsible for damages caused after delivery.</li>

          <li>
            Mkhasa bears no responsibility for goods signed for by an
            alternative recipient.
          </li>

          <li>
            All claims for shortages or damages must be reported to Customer
            Service on the day of delivery.
          </li>

          <li>
            We are unable to redirect orders once items have been shipped.
          </li>
        </ul>

        <p className="mt-4 leading-7 text-gray-600">
          If you have any further questions regarding Mkhasa delivery, please
          contact our Support Team at{" "}
          <a
            href="mailto:customercare@mkhasa.com"
            className="font-semibold text-red-600 underline underline-offset-2 hover:text-red-700"
          >
            customercare@mkhasa.com
          </a>{" "}
          from Monday to Saturday, 9:00 a.m. to 8:00 p.m.
        </p>
      </section>

      {/* Return Policy */}
      <section className="border-t border-gray-200 pt-8">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">
          Return Policy
        </h2>

        <ul className="list-disc space-y-2 pl-5 leading-7 text-gray-600">
          <li>
            Merchandise must be returned within{" "}
            <strong className="text-gray-900">7 days</strong> in new condition.
          </li>

          <li>Return requests after 7 days will not be accepted.</li>

          <li>
            Merchandise must not be worn, used, altered, or washed. It must be
            returned in its original packaging with all tags, seals, and
            security tags attached.
          </li>

          <li>
            Perfumes must include their original packaging in its original
            condition, without packing tape or postal labels.
          </li>

          <li>
            <strong className="text-gray-900">Final Sale</strong> items are not
            eligible for return.
          </li>
        </ul>
      </section>

      {/* How to Initiate a Return */}
      <section className="mt-8">
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          How to Initiate a Return
        </h2>

        <ol className="list-decimal space-y-3 pl-5 leading-7 text-gray-600">
          <li>
            <strong className="text-gray-900">Start your return online:</strong>{" "}
            Reach out via WhatsApp, SMS, or Instagram to initiate a return.
          </li>

          <li>
            <strong className="text-gray-900">
              Provide refund account details:
            </strong>{" "}
            Refunds for returned items will be paid into the account provided
            during the customer-care conversation.
          </li>

          <li>
            <strong className="text-gray-900">Pack your items:</strong>{" "}
            Merchandise must be returned in its original packaging. Do not
            place labels or tape directly on the product packaging.
          </li>

          <li>
            <strong className="text-gray-900">Drop off your package:</strong>{" "}
            Items should be sent through the customer’s preferred freight
            company to the location provided by the Customer Care
            Representative.
          </li>
        </ol>
      </section>

      {/* Tracking Returns */}
      <section className="mt-8">
        <h2 className="mb-3 text-xl font-bold text-gray-900">
          How to Track Your Return
        </h2>

        <p className="leading-7 text-gray-600">
          You can track your return through your freight agent, and you will be
          notified once your package has been picked up.
        </p>
      </section>

      {/* Refunds */}
      <section className="mt-8">
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          When You’ll Receive Your Refund
        </h2>

        <ul className="list-disc space-y-2 pl-5 leading-7 text-gray-600">
          <li>
            <strong className="text-gray-900">Fast refunds:</strong> For
            eligible orders, your refund will be issued within 24 hours of
            pickup.
          </li>

          <li>Eligible refunds are processed immediately.</li>

          <li>Refunds for some customers may take up to 3 days.</li>
        </ul>
      </section>
    </div>
  );
};