"use client";

import Link from "next/link";
import { FooterLogo } from "./ui/FooterLogo";
import { Wrapper } from "./ui/Wrapper";
import { Icon } from "@iconify/react";

export const Footer = () => {
  return (
    <footer className="bg-black py-6 mt-auto  md:text-center" id="footer">
      <Wrapper>
        <div className="grid gap-y-5 grid-cols-1 md:grid-cols-12 items-start">
          <div className="flex justify-center md:col-span-3">
            <div className="sm:block text-white font-fuzzy">
              <FooterLogo stack="hidden" size="lg" className="font-fuzzy" />
            </div>
          </div>

          <div className="md:col-span-3">
            <h2 className="text-lg font-bold mt-4 text-white md:text-center lg:text-left">
              Explore Mkhasa
            </h2>
            <ul className="text-app-ash-2 md:text-center lg:text-left">
              <li>
                <Link href="/about" className="w-full py-2 inline-block hover:text-app-red">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/all-products" className="w-full py-2 inline-block hover:text-app-red">
                  All products
                </Link>
              </li>
              <li>
                <Link href="/product-index/1" className="w-full py-2 inline-block hover:text-app-red">
                  Product index
                </Link>
              </li>
              <li>
                <Link href="/shipping-returns" className="w-full py-2 inline-block hover:text-app-red">
                  Shipping &amp; return
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="w-full py-2 inline-block hover:text-app-red">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="w-full py-2 inline-block hover:text-app-red">
                  Terms &amp; Conditions
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 mt-4">
            <h2 className="text-lg font-bold text-white  md:text-center lg:text-left">
              Contact Us
            </h2>
            <div className="text-app-ash-2 mt-4 md:text-center lg:text-left">
              <p className="w-full py-2 inline-block">
                Call Us:{" "}
                <span>
                  <br /> +234 901 389 7261 (Sales)
                  <br />+234 913 145 1391 (Customer Care)
                </span>
              </p>
              <p className="w-full py-2 inline-block">
                Contact Email:{" "}
                <a className="hover:text-app-red" href="mailto:admin@mkhasa.com">
                  admin@mkhasa.com
                </a>
              </p>
              <p className="w-full py-2 inline-block">
                Help Email:{" "}
                <a className="hover:text-app-red" href="mailto:customercare@mkhasa.com">
                  customercare@mkhasa.com
                </a>
              </p>
            </div>
          </div>

          <div className="md:col-span-3">
            <h2 className="text-lg font-bold text-white  md:text-center md:pr-20 md:text-right">
              Socials
            </h2>
            <ul className="flex text-app-ash-2 justify-center gap-3 md:gap-0 lg:gap-3 mt-4 md:justify-end">
              <li>
                <Link
                  href="https://www.instagram.com/mkhasa1?igsh=MWVhYWhmOXh0Ym5qZw=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 inline-block hover:scale-105 hover:text-app-red"
                  aria-label="Mkhasa Instagram page"
                >
                  <Icon icon="mdi:instagram" style={{ fontSize: 32 }} />
                </Link>
              </li>
              <li>
                <Link
                  href="https://twitter.com/Mkhasa_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 inline-block hover:scale-105"
                  aria-label="Mkhasa X (Twitter) page"
                >
                  <Icon icon="bi:twitter-x" style={{ fontSize: 32 }} className="hover:text-app-red" />
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.facebook.com/profile.php?id=61559801264240&mibextid=ZbWKwL"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 inline-block hover:scale-105"
                  aria-label="Mkhasa Facebook page"
                >
                  <Icon icon="lucide:facebook" style={{ fontSize: 32 }} className="hover:text-app-red" />
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="p-1 inline-block hover:scale-105"
                  aria-label="Mkhasa YouTube page"
                >
                  <Icon icon="ant-design:youtube-outlined" style={{ fontSize: 32 }} className="hover:text-app-red" />
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.tiktok.com/@_mkhasa_?_t=8mdu7onNLSH&_r=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 inline-block hover:scale-105"
                  aria-label="Mkhasa TikTok page"
                >
                  <Icon icon="ant-design:tik-tok-outlined" style={{ fontSize: 32 }} className="hover:text-app-red" />
                </Link>
              </li>
              <li>
                <Link
                  href="https://wa.me/message/7JLGPL5VZ3ZWB1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 inline-block hover:scale-105"
                  aria-label="Mkhasa WhatsApp"
                >
                  <Icon icon="bi:whatsapp" style={{ fontSize: 32 }} className="hover:text-app-red" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <p className="text-app-ash-2 text-sm text-center pt-10 sm:text-right md:text-center">
          &copy; {new Date().getFullYear()} All Rights Reserved
        </p>
      </Wrapper>
    </footer>
  );
};

export default Footer;
