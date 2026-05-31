import Navbar from "../../src/components/Navbar.jsx";
import Footer from "../../src/components/Footer.jsx";
import ScrollToTop from "../../src/components/ScrollToTop.jsx";

const API_BASE =
  process.env.NEXT_PUBLIC_BASE_URL || "https://mkhasa-bfdb6fabd978.herokuapp.com/api/v1";

async function getCategories() {
  try {
    const res = await fetch(`${API_BASE}/all/category`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export default async function SiteLayout({ children }) {
  const categories = await getCategories();

  return (
    <div className="flex bg-white flex-col min-h-dvh">
      <header className="bg-white">
        <Navbar initialCategories={categories} />
      </header>
      <ScrollToTop />
      {children}
      <Footer />
    </div>
  );
}
