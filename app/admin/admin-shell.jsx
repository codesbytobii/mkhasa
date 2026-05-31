"use client";

import AdminNavbar from "../../src/components/AdminNavbar.jsx";

export default function AdminShell({ children }) {
  return (
    <div className="flex bg-white flex-col min-h-dvh">
      <header className="bg-white">
        <AdminNavbar />
      </header>
      {children}
    </div>
  );
}
