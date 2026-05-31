"use client";

import React from 'react';

export const About = () => {
  return (
    <div className="bg-gray-50 py-10 px-4 sm:px-6 lg:px-8      ">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-6">About Mkhasa</h1>
        <p className="text-lg text-gray-700 mb-4">
          At <a href="https://mhkasa-front-vercel.app" target="_blank" className="text-blue-600 underline">Mkhasa.com</a>, our purpose is simple: to deliver the best product at the best price swiftly. And as a retailer for all your beloved and favorite brands, we get to bring you the best in fragrances.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          We aim to inspire the world by showing it’s possible to simultaneously deliver happiness to customers, employees, and vendors, in a long-term, remarkable way.
        </p>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Core Values</h2>
        <ul className="list-disc list-inside text-lg text-gray-700 mb-6 space-y-2">
          <li>Integrity</li>
          <li>Creativeness</li>
          <li>Open-minded</li>
          <li>Customer Obsessed</li>
          <li>Candour</li>
          <li>Innovation</li>
          <li>Team Spirit</li>
        </ul>
        <p className="text-lg text-gray-700 mb-4">
          These values of ours drive and fuel the singular purpose of delivering the best product swiftly to our customers. We aim to make everyday living of our customers as enjoyable and worthwhile as possible.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          The team at the company aren’t left out as Mkhasa Technologies Limited aims to add value to each team member every day. Although Mkhasa maintains itself as a service company that happens to sell fragrances, we believe that humility, integrity, and compassion are important aspects of doing business. By partaking in initiatives inside and outside of retail, we hope to build a brighter, wonderful world.
        </p>
      </div>
    </div>
  );
}

export default About;
