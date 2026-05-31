"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { Logo } from "./ui/Logo";
import { Wrapper } from "./ui/Wrapper";

const AdminNavbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDropdownOpenfor, setIsDropdownOpenfor] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault();
        const value = e.target?.search?.value;
        if (!value) return;
        navigate(`/search?s=${value}`);
    };

    return (
        <Wrapper>
            <nav className="bg-white flex flex-wrap items-center justify-between gap-x-4 py-2">
                <div className="flex items-center justify-between w-full lg:w-auto">
                    <Logo />
                    <div className="flex items-center gap-4 lg:hidden">
                        <NavbarIcons 
                            isDropdownOpen={isDropdownOpen}
                            setIsDropdownOpen={setIsDropdownOpen}
                            isDropdownOpenfor={isDropdownOpenfor}
                            setIsDropdownOpenfor={setIsDropdownOpenfor}
                        />
                    </div>
                </div>
                <form onSubmit={onSubmit} className="w-full md:flex-grow lg:max-w-xl relative mt-2 lg:mt-0">
                    <input
                        id="search"
                        type="text"
                        placeholder="search product"
                        className="w-full px-6 py-2 rounded-full outline-none bg-app-ash"
                    />
                    <button
                        aria-label="search for product"
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        type="submit"
                    >
                        <Icon icon="mynaui:search" style={{ fontSize: 20 }} />
                    </button>
                </form>
                <div className="hidden lg:flex items-center gap-4">
                    <NavbarIcons 
                        isDropdownOpen={isDropdownOpen}
                        setIsDropdownOpen={setIsDropdownOpen}
                        isDropdownOpenfor={isDropdownOpenfor}
                        setIsDropdownOpenfor={setIsDropdownOpenfor}
                    />
                </div>
            </nav>
        </Wrapper>
    );
};

const NavbarIcons = ({ isDropdownOpen, setIsDropdownOpen, isDropdownOpenfor, setIsDropdownOpenfor }) => (
    <>
        <div className="relative top-1">
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <Icon icon="jam:write" style={{ fontSize: 24 }} />
            </button>
            {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
                    <ul>
                        <li>
                            <Link href="/admin/edit-product" className="block px-4 py-2 hover:bg-gray-100">
                                Edit Product
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/edit-price" className="block px-4 py-2 hover:bg-gray-100">
                                Edit Price
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/edit-vendor" className="block px-4 py-2 hover:bg-gray-100">
                                Edit Vendor
                            </Link>
                        </li>
                    </ul>
                </div>
            )}
        </div>
        <div className="relative top-1">
            <button onClick={() => setIsDropdownOpenfor(!isDropdownOpenfor)}>
                <Icon icon="mdi:plus" className="rounded-full bg-app-ash" style={{ fontSize: 24 }} />
            </button>
            {isDropdownOpenfor && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
                    <ul>
                        <li>
                            <Link href="/admin/add-product" className="block px-4 py-2 hover:bg-gray-100">
                                Add Product
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/add-vendor" className="block px-4 py-2 hover:bg-gray-100">
                                Add Vendor
                            </Link>
                        </li>
                    </ul>
                </div>
            )}
        </div>
        <Link href="/admin/user" className="flex items-center gap-2">
            <Icon icon="mdi:account" style={{ fontSize: 24 }} />
            <span>User</span>
        </Link>
    </>
);

export default AdminNavbar;