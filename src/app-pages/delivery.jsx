"use client";

import React from 'react';

export const Delivery = () => {
  return (

    <div className="bg-white p-6 md:px-28 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Shipping & Return Policy</h2>

      <h3 className="text-xl font-semibold mb-2">Business Days</h3>
      <p className="mb-4">Monday to Saturday</p>

      <hr className="my-4" />

      <h3 className="text-xl font-semibold mb-2">General Information</h3>
      <p className="mb-4">
        We highly value every order from our esteemed customers and are grateful for the business opportunity offered to us. Thank you! Swift and safe delivery of your goods is crucial to us as it ensures better customer satisfaction and appraisal. To maintain the quality of our service, we have carefully selected our courier partners.
      </p>
      <p className="mb-4">
        Please note:
        <ul className="list-disc pl-5">
          <li>All deliveries must be signed for. If you are unavailable, kindly inform us of an alternative recipient, such as a colleague or neighbor.</li>
          <li>Sundays and public holidays are excluded from delivery schedules and may affect delivery times.</li>
        </ul>
      </p>

      <hr className="my-4" />

      <h3 className="text-xl font-semibold mb-2">Delivery Charges and Times</h3>

      <div className="mb-4">
        {/* <h4 className="text-lg font-semibold mb-2">Orders Below ₦100,000</h4> */}
        <ul className="list-disc pl-5">
          <li>Delivery Cost: ₦2,500.00 within Lagos & Abuja</li>
          {/* <li>Delivery Cost: ₦3,500.00 outside Lagos</li> */}
          <li>Delivery Time:
            <ul className="list-disc pl-5">
              {/* <li>2 days max within Lagos</li> */}
              <li>5 days max outside Lagos</li>
            </ul>
          </li>
          <li>Orders placed after 4 pm will begin processing the next business day.</li>
          <li>Customers may occasionally be required to pick up their package from a designated office address.</li>
        </ul>
      </div>

      {/* <div className="mb-4">
          <h4 className="text-lg font-semibold mb-2">Orders Above ₦100,000</h4>
          <ul className="list-disc pl-5">
            <li>Delivery Cost: Free within and outside Lagos</li>
            <li>Delivery Time:
              <ul className="list-disc pl-5">
                <li>2 days max within Lagos</li>
                <li>5 days max outside Lagos</li>
              </ul>
            </li>
            <li>Orders placed after 4 pm will begin processing the next business day.</li>
            <li>Customers may occasionally be required to pick up their package from a designated office address.</li>
          </ul>
        </div> */}

      <hr className="my-4" />

      <h3 className="text-xl font-semibold mb-2">Important Information</h3>
      <ul className="list-disc pl-5 mb-4">
        <li>Mkhasa is not responsible for any damages caused after delivery.</li>
        <li>Mkhasa bears no responsibility for goods signed by an alternative person.</li>
        <li>All claims for shortages or damages must be reported to customer service on the day of delivery.</li>
        <li>We are unable to redirect orders once items have been shipped.</li>
      </ul>

      <p>If you have any further queries regarding Mkhasa delivery, please contact our Support Team at <a href="mailto:customercare@mkhasa.com" className="text-blue-500">customercare@mkhasa.com</a> from Monday to Saturday, 9.00 am - 8.00 pm.</p>

      <section class="returns-policy mt-6">

        <h2 className="text-xl font-semibold mb-2">RETURN POLICY</h2>
        <ul>
          <li>Merchandise must be returned within <strong>7 days</strong> in new condition.</li>
          <li>Return requests after 7 days will not be accepted.</li>
          <li>Merchandise must not be worn, used, altered, or washed and must be in its original packaging with all tags attached, including seals and security tags.</li>
          <li>Perfumes must include the original packaging in its original condition, without packing tape or postal labels.</li>
          <li><strong>Final Sale</strong> items are not eligible to be returned.</li>
        </ul>

        <h2 className="text-xl font-semibold my-2">How To Initiate A Return</h2>
        <ol>
          <li><strong>Start your return online:</strong> Reach out via WhatsApp, SMS, or Instagram (IG) to initiate a return.</li>
          <li><strong>Refund account details:</strong> Payment of returned items will be made to the account given during the chat.</li>
          <li><strong>Pack up your items:</strong> Merchandise must be returned in the original packaging. No labels or tape on product packaging.</li>
          <li><strong>Drop off your package:</strong> Items are sent via the customer’s preferred freight company to a location given by the customer care representative.</li>
        </ol>

        <h2 className="text-xl font-semibold my-2">How To Track Your Return</h2>
        <p>You can track your return via your freight agent, and you will be notified upon pickup.</p>

        <h2 className="text-xl font-semibold my-2">When You'll Receive Your Refund</h2>
        <ul>
          <li><strong>FAST REFUNDS:</strong> For eligible orders, your refund will be issued within 24 hours of pickup.</li>
          <li>Eligible refunds are issued immediately.</li>
          <li>Refunds for some customers can take up to 3 days.</li>
        </ul>
      </section>

    </div>


  )
}
