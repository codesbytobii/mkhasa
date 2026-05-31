"use client";

import { Wrapper } from "./ui/Wrapper";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartQuery } from "../hooks/query/useCart";
import { Logo } from "./ui/Logo";
import { Loader2 } from "lucide-react";
import { useCartContext } from "../hooks/utils/useCart";
import { toAppealPath, toCategoryPath, toProductPath } from "../utils/paths";

const APPEAL = ["Men", "Women", "Unisex"];
const API_BASE = process.env.NEXT_PUBLIC_BASE_URL || "";

const Navbar = ({ initialCategories = [] }) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [expandMobile, setExpandMobile] = useState(false);

  const handleSearch = async (searchQuery) => {
    if (!searchQuery) return;
    try {
      const res = await fetch(`${API_BASE}/new/search?name=${searchQuery}`);
      const data = await res.json();
      setResults(data.products ?? []);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleChangeInput = (text) => {
    setSearching(true);
    setQuery(text);
    const timer = setTimeout(() => handleSearch(text), 1000);
    return () => clearTimeout(timer);
  };

  const goToProduct = (name) => {
    if (!name) return;
    router.push(toProductPath(name));
    setQuery("");
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const value = e.target?.search?.value;
    if (!value) return;
    setQuery("");
    router.push(`/search?s=${value}`);
  };

  return (
    <Wrapper className="py-4 relative">
      {/* Mobile Navbar */}
      <nav className="lg:hidden" aria-label="Mobile navigation">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setExpandMobile(!expandMobile)}
            aria-label="Open menu"
          >
            <Icon icon="charm:menu-hamburger" style={{ fontSize: 24 }} />
          </button>
          <Logo />
          <div className="flex items-center gap-4">
            <CartButton />
            <Link href="/account" aria-label="Account">
              <Icon icon="mdi:account" style={{ fontSize: 24 }} />
            </Link>
          </div>
        </div>
        <form onSubmit={onSubmit} className="relative">
          <input
            id="search"
            name="search"
            type="search"
            placeholder="Search For Item"
            className="w-full px-4 py-2 rounded-full pr-8 outline-none bg-app-ash"
            onChange={(e) => handleChangeInput(e.target.value)}
          />
          <button
            aria-label="Search for product"
            className="absolute right-3 top-1/2 -translate-y-1/2"
            type="submit"
          >
            <Icon icon="mynaui:search" style={{ fontSize: 20 }} />
          </button>
        </form>

        {query && (
          <div className="border rounded flex min-h-[200px] justify-center">
            {searching ? (
              <Loader2 className="animate-spin m-auto" />
            ) : results.length === 0 ? (
              <p className="flex items-center">No result</p>
            ) : (
              <ul className="w-full h-full">
                {results.slice(0, 8).map((item, index) => (
                  <li
                    key={index}
                    className="p-2 text-xs cursor-pointer hover:bg-gray-100"
                    onClick={() => goToProduct(item.name)}
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </nav>

      {/* Desktop Navbar */}
      <nav
        className="hidden lg:flex items-center justify-between gap-x-4"
        aria-label="Desktop navigation"
      >
        <Logo />

        <div className="flex items-center font-semibold">
          <CategoryDropdown categories={initialCategories} />
        </div>

        <div className="flex-grow max-w-md relative">
          <form onSubmit={onSubmit} className="flex-grow max-w-md relative">
            <input
              id="search"
              name="search"
              type="search"
              placeholder="Search product"
              className="w-full px-6 py-2 rounded-full pr-8 outline-none bg-app-ash"
              onChange={(e) => handleChangeInput(e.target.value)}
            />
            <button
              aria-label="Search for product"
              className="absolute right-3 top-1/2 -translate-y-1/2"
              type="submit"
            >
              <Icon icon="mynaui:search" style={{ fontSize: 20 }} />
            </button>
          </form>

          <div className="absolute top-[110%] left-0 z-10 bg-white w-full">
            {query && (
              <div className="shadow p-4 rounded flex items-center min-h-[200px] justify-center mt-2">
                {searching ? (
                  <Loader2 className="animate-spin m-auto" />
                ) : results.length === 0 ? (
                  <p>No result</p>
                ) : (
                  <ul className="w-full space-y-2">
                    {results.slice(0, 5).map((item) => (
                      <li
                        key={item?._id || item?.name}
                        className="border-b p-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => goToProduct(item.name)}
                      >
                        {item.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 font-semibold">
          <Link href="/account" className="flex gap-2 items-center">
            <Icon icon="mdi:account" style={{ fontSize: 24 }} /> Account
          </Link>
          <Link href="/cart" className="flex gap-2 items-center">
            <CartButton /> Cart
          </Link>
        </div>
      </nav>

      {expandMobile && (
        <MobileMenu
          categories={initialCategories}
          toggle={() => setExpandMobile(false)}
        />
      )}
    </Wrapper>
  );
};

export default Navbar;

const CategoryDropdown = ({ categories = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative">
      <button
        className="flex items-center gap-1"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        Categories <Icon icon="mdi:chevron-down" />
      </button>
      {isOpen && <DesktopCategoryDropdown categories={categories} />}
    </div>
  );
};

const MobileMenu = ({ categories = [], toggle }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-white z-50 overflow-y-auto">
      <Wrapper>
        <div className="flex justify-between items-center py-4">
          <Logo />
          <button onClick={toggle} aria-label="Close menu">
            <Icon icon="uil:times" style={{ fontSize: 24 }} />
          </button>
        </div>
        <ul>
          {categories.map(({ name }, index) => (
            <li key={index}>
              <Link
                href={toCategoryPath(name)}
                className="flex items-center py-2 font-semibold text-lg"
                onClick={toggle}
              >
                {name}
              </Link>
            </li>
          ))}
          {APPEAL.map((name, index) => (
            <li key={index}>
              <Link
                href={toAppealPath(name)}
                className="py-2 hover:bg-gray-100 flex items-center font-semibold text-lg"
                onClick={toggle}
              >
                {name}
              </Link>
            </li>
          ))}
        </ul>
      </Wrapper>
    </div>
  );
};

const DesktopCategoryDropdown = ({ categories = [] }) => {
  return (
    <div className="absolute z-50 bg-white shadow-md rounded-md mt-2 left-[-15px] w-[9rem]">
      <ul>
        {categories.map(({ name }, index) => (
          <li key={index}>
            <Link
              href={toCategoryPath(name)}
              className="block px-4 py-2 hover:bg-gray-100"
            >
              {name}
            </Link>
          </li>
        ))}
        {APPEAL.map((name, index) => (
          <li key={index}>
            <Link
              href={toAppealPath(name)}
              className="block px-4 py-2 hover:bg-gray-100"
            >
              {name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const CartButton = () => {
  const { data, status } = useCartQuery();
  const { cartQuantity, getCart } = useCartContext();

  useEffect(() => {
    getCart();
  }, []);

  return (
    <div className="relative p-2">
      <Icon icon="mdi:cart" style={{ fontSize: 25 }} />
      {status === "success" && (
        <p className="absolute grid w-4 h-4 text-xs font-bold leading-none text-white rounded-full bg-app-red place-items-center top-1 right-1">
          {cartQuantity}
        </p>
      )}
    </div>
  );
};
