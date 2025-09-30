import React, { useMemo, useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

/*****************************************
 * RUPASARA – Single-file React Website
 * TailwindCSS + Framer Motion + Cart + WhatsApp + Google Sheet webhook
 * + Currency switcher (INR base → show INR/EUR/USD)
 *****************************************/

/* -------------------------- Cart Context -------------------------- */
const CartContext = createContext(null);
const useCart = () => useContext(CartContext);

function CartProvider({ children }) {
  const [items, setItems] = useState([]); // {id,title,price,qty,style,image}

  const add = (product, qty = 1) => {
    setItems((prev) => {
      const i = prev.findIndex((p) => p.id === product.id);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + qty };
        return next;
      }
      return [...prev, { ...product, qty }];
    });
  };
  const remove = (id) => setItems((prev) => prev.filter((p) => p.id !== id));
  const setQty = (id, qty) =>
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, qty: Math.max(1, Number(qty) || 1) } : p)));
  const clear = () => setItems([]);

  const totals = useMemo(() => {
    const subtotal = items.reduce((s, p) => s + p.price * p.qty, 0);
    return { subtotal };
  }, [items]);

  return <CartContext.Provider value={{ items, add, remove, setQty, clear, totals }}>{children}</CartContext.Provider>;
}

/* -------------------------- Grouped Catalog with Sub-Categories -------------------------- */
const CATALOG = [
  {
    group: "Heritage Weaves",
    categories: [
      {
        slug: "banarasi",
        name: "Banarasi Sarees",
        description: "Opulent zari work and timeless brocades woven in the heritage looms of Varanasi.",
        hero: "/images/hertiage/b1.png",
        styles: ["Classic Zari", "Kadhua", "Jangla", "Contemporary"],
        products: [
          { id: "ban-01", title: "Classic Zari Banarasi", price: 1590.0, style: "Classic Zari", images: ["/images/hertiage/b1.png"] },
          { id: "ban-02", title: "Kadhua Weave Banarasi", price: 1890.0, style: "Kadhua", images: ["/images/hertiage/b1.png"] },
          { id: "ban-03", title: "Jangla Pattern Banarasi", price: 1750.0, style: "Jangla", images: ["/images/hertiage/b1.png"] },
          { id: "ban-04", title: "Modern Brocade Banarasi", price: 1690.0, style: "Contemporary", images: ["/images/hertiage/b1.png"] },
        ],
      },
      {
        slug: "paithani",
        name: "Paithani Sarees",
        description: "Luxurious silk sarees from Maharashtra known for peacock motifs and rich zari borders.",
        hero: "/images/hertiage/p1.png",
        styles: ["Traditional", "Contemporary"],
        products: [],
      },
      {
        slug: "chanderi",
        name: "Chanderi Sarees",
        description: "Lightweight, sheer sarees blending silk and cotton for regal elegance.",
        hero: "/images/hertiage/c1.png",
        styles: ["Classic", "Modern"],
        products: [],
      },
      {
        slug: "dharmavaram",
        name: "Dharmavaram Sarees",
        description: "Traditional silk sarees from Andhra Pradesh with heavy zari and grandeur.",
        hero: "/images/hertiage/d1.png",
        styles: ["Traditional", "Temple Border"],
        products: [],
      },
      {
        slug: "kalamkari",
        name: "Kalamkari Sarees",
        description: "Hand-painted and block-printed elegance featuring natural dyes and intricate motifs.",
        hero: "/images/hertiage/e1.png",
        styles: ["Pen Kalamkari", "Hand Block", "Printed", "Contemporary"],
        products: [
          { id: "kal-01", title: "Indigo Pen Kalamkari Saree", price: 119.0, style: "Pen Kalamkari", images: ["/images/hertiage/e1.png"] },
          { id: "kal-02", title: "Rust Hand-Block Kalamkari", price: 99.0, style: "Hand Block", images: ["/images/kalamkari/kal-02-main.jpg"] },
          { id: "kal-03", title: "Floral Printed Kalamkari", price: 89.0, style: "Printed", images: ["/images/kalamkari/kal-03-main.jpg"] },
          { id: "kal-04", title: "Modern Motif Kalamkari", price: 129.0, style: "Contemporary", images: ["/images/kalamkari/kal-04-main.jpg"] },
        ],
      },
    ],
  },

  {
    group: "Silk & Luxe Drapes",
    categories: [
      { slug: "silk", name: "Silk Sarees", description: "Classic silk sarees woven with lustrous textures.", hero: "/images/silk/ps.png", styles: ["Pure Silk", "Blends"],
         products: [{ id: "slk-01", title: "Indigo Pen Kalamkari Saree", price: 119.0, style: "Pen Kalamkari", images: ["/images/kalamkari/kal-01-main.jpg"] },
          { id: "slk-02", title: "Rust Hand-Block Kalamkari", price: 99.0, style: "Hand Block", images: ["/images/kalamkari/kal-02-main.jpg"] },
          { id: "slk-03", title: "Floral Printed Kalamkari", price: 89.0, style: "Printed", images: ["/images/kalamkari/kal-03-main.jpg"] },
          { id: "slk-04", title: "Modern Motif Kalamkari", price: 129.0, style: "Contemporary", images: ["/images/kalamkari/kal-04-main.jpg"] },
       ] },
      { slug: "mysore-silk", name: "Mysore Silk", description: "Iconic Mysore silk sarees with vibrant colors and smooth texture.", hero: "/images/silk/ms.png", styles: ["Traditional", "Contemporary"], products: [{ id: "slk-01", title: "Indigo Pen Kalamkari Saree", price: 119.0, style: "Pen Kalamkari", images: ["/images/kalamkari/kal-01-main.jpg"] },
          { id: "slk-02", title: "Rust Hand-Block Kalamkari", price: 99.0, style: "Hand Block", images: ["/images/kalamkari/kal-02-main.jpg"] },
          { id: "slk-03", title: "Floral Printed Kalamkari", price: 89.0, style: "Printed", images: ["/images/kalamkari/kal-03-main.jpg"] },
          { id: "slk-04", title: "Modern Motif Kalamkari", price: 129.0, style: "Contemporary", images: ["/images/kalamkari/kal-04-main.jpg"] },] },
      { slug: "bangalore-silk", name: "Bangalore Silk", description: "Smooth, lightweight silk sarees crafted in Bangalore.", hero: "/images/silk/bs.png", styles: ["Classic", "Festive"], products: [{ id: "slk-01", title: "Indigo Pen Kalamkari Saree", price: 119.0, style: "Pen Kalamkari", images: ["/images/kalamkari/kal-01-main.jpg"] },
          { id: "slk-02", title: "Rust Hand-Block Kalamkari", price: 99.0, style: "Hand Block", images: ["/images/kalamkari/kal-02-main.jpg"] },
          { id: "slk-03", title: "Floral Printed Kalamkari", price: 89.0, style: "Printed", images: ["/images/kalamkari/kal-03-main.jpg"] },
          { id: "slk-04", title: "Modern Motif Kalamkari", price: 129.0, style: "Contemporary", images: ["/images/kalamkari/kal-04-main.jpg"] },] },
      { slug: "upada-silk", name: "Upada Silk Sarees", description: "Fine silk sarees from Andhra Pradesh with delicate weaving techniques.", hero: "/images/silk/upada.png", styles: ["Traditional", "Contemporary"], products: [{ id: "slk-01", title: "Indigo Pen Kalamkari Saree", price: 119.0, style: "Pen Kalamkari", images: ["/images/kalamkari/kal-01-main.jpg"] },
          { id: "slk-02", title: "Rust Hand-Block Kalamkari", price: 99.0, style: "Hand Block", images: ["/images/kalamkari/kal-02-main.jpg"] },
          { id: "slk-03", title: "Floral Printed Kalamkari", price: 89.0, style: "Printed", images: ["/images/kalamkari/kal-03-main.jpg"] },
          { id: "slk-04", title: "Modern Motif Kalamkari", price: 129.0, style: "Contemporary", images: ["/images/kalamkari/kal-04-main.jpg"] },] },
      { slug: "crepe-silk", name: "Crepe Silk", description: "Soft, crinkled silk sarees ideal for contemporary and formal wear.", hero: "/images/silk/crepe.png", styles: ["Plain", "Printed"], products: [{ id: "slk-01", title: "Indigo Pen Kalamkari Saree", price: 119.0, style: "Pen Kalamkari", images: ["/images/kalamkari/kal-01-main.jpg"] },
          { id: "slk-02", title: "Rust Hand-Block Kalamkari", price: 99.0, style: "Hand Block", images: ["/images/kalamkari/kal-02-main.jpg"] },
          { id: "slk-03", title: "Floral Printed Kalamkari", price: 89.0, style: "Printed", images: ["/images/kalamkari/kal-03-main.jpg"] },
          { id: "slk-04", title: "Modern Motif Kalamkari", price: 129.0, style: "Contemporary", images: ["/images/kalamkari/kal-04-main.jpg"] },] },
      { slug: "dola-silk", name: "Dola Silk", description: "Elegant silk sarees blending shimmer and softness for celebrations.", hero: "/images/silk/Dopa.png", styles: ["Festive", "Party Wear"], products: [{ id: "slk-01", title: "Indigo Pen Kalamkari Saree", price: 119.0, style: "Pen Kalamkari", images: ["/images/kalamkari/kal-01-main.jpg"] },
          { id: "slk-02", title: "Rust Hand-Block Kalamkari", price: 99.0, style: "Hand Block", images: ["/images/kalamkari/kal-02-main.jpg"] },
          { id: "slk-03", title: "Floral Printed Kalamkari", price: 89.0, style: "Printed", images: ["/images/kalamkari/kal-03-main.jpg"] },
          { id: "slk-04", title: "Modern Motif Kalamkari", price: 129.0, style: "Contemporary", images: ["/images/kalamkari/kal-04-main.jpg"] },] },
      { slug: "tussar-silk", name: "Tussar Silk Sarees", description: "Rustic silk sarees with a natural golden sheen.", hero: "/images/silk/Tusar.png", styles: ["Handwoven", "Natural Finish"], products: [{ id: "slk-01", title: "Indigo Pen Kalamkari Saree", price: 119.0, style: "Pen Kalamkari", images: ["/images/kalamkari/kal-01-main.jpg"] },
          { id: "slk-02", title: "Rust Hand-Block Kalamkari", price: 99.0, style: "Hand Block", images: ["/images/kalamkari/kal-02-main.jpg"] },
          { id: "slk-03", title: "Floral Printed Kalamkari", price: 89.0, style: "Printed", images: ["/images/kalamkari/kal-03-main.jpg"] },
          { id: "slk-04", title: "Modern Motif Kalamkari", price: 129.0, style: "Contemporary", images: ["/images/kalamkari/kal-04-main.jpg"] },] },
    ],
  },

  {
    group: "Modern & Contemporary Styles",
    categories: [
      { slug: "organza", name: "Organza Sarees", description: "Light, crisp sarees with dreamy embroidery and modern appeal.", hero: "/images/modern/organaza.png", styles: ["Floral", "Embroidered"], products: [{ id: "slk-01", title: "Indigo Pen Kalamkari Saree", price: 119.0, style: "Pen Kalamkari", images: ["/images/kalamkari/kal-01-main.jpg"] },
          { id: "slk-02", title: "Rust Hand-Block Kalamkari", price: 99.0, style: "Hand Block", images: ["/images/kalamkari/kal-02-main.jpg"] },
          { id: "slk-03", title: "Floral Printed Kalamkari", price: 89.0, style: "Printed", images: ["/images/kalamkari/kal-03-main.jpg"] },
          { id: "slk-04", title: "Modern Motif Kalamkari", price: 129.0, style: "Contemporary", images: ["/images/kalamkari/kal-04-main.jpg"] },] },
      { slug: "georgette", name: "Georgette Sarees", description: "Fluid, lightweight sarees ideal for contemporary silhouettes.", hero: "/images/modern/geor.png", styles: ["Plain", "Printed"], products: [{ id: "slk-01", title: "Indigo Pen Kalamkari Saree", price: 119.0, style: "Pen Kalamkari", images: ["/images/kalamkari/kal-01-main.jpg"] },
          { id: "slk-02", title: "Rust Hand-Block Kalamkari", price: 99.0, style: "Hand Block", images: ["/images/kalamkari/kal-02-main.jpg"] },
          { id: "slk-03", title: "Floral Printed Kalamkari", price: 89.0, style: "Printed", images: ["/images/kalamkari/kal-03-main.jpg"] },
          { id: "slk-04", title: "Modern Motif Kalamkari", price: 129.0, style: "Contemporary", images: ["/images/kalamkari/kal-04-main.jpg"] },] },
      { slug: "chiffon", name: "Chiffon Sarees", description: "Feather-light sarees with a graceful fall, perfect for modern styling.", hero: "/images/modern/chiffon.png", styles: ["Classic", "Designer"], products: [{ id: "slk-01", title: "Indigo Pen Kalamkari Saree", price: 119.0, style: "Pen Kalamkari", images: ["/images/kalamkari/kal-01-main.jpg"] },
          { id: "slk-02", title: "Rust Hand-Block Kalamkari", price: 99.0, style: "Hand Block", images: ["/images/kalamkari/kal-02-main.jpg"] },
          { id: "slk-03", title: "Floral Printed Kalamkari", price: 89.0, style: "Printed", images: ["/images/kalamkari/kal-03-main.jpg"] },
          { id: "slk-04", title: "Modern Motif Kalamkari", price: 129.0, style: "Contemporary", images: ["/images/kalamkari/kal-04-main.jpg"] },] },
       { slug: "cutwork", name: "Cutwork Sarees", description: "Modern sarees with intricate cutwork designs for a bold yet elegant look.", hero: "/images/modern/cuttwork.png", styles: ["Designer", "Heavy Work"], products: [{ id: "slk-01", title: "Indigo Pen Kalamkari Saree", price: 119.0, style: "Pen Kalamkari", images: ["/images/kalamkari/kal-01-main.jpg"] },
          { id: "slk-02", title: "Rust Hand-Block Kalamkari", price: 99.0, style: "Hand Block", images: ["/images/kalamkari/kal-02-main.jpg"] },
          { id: "slk-03", title: "Floral Printed Kalamkari", price: 89.0, style: "Printed", images: ["/images/kalamkari/kal-03-main.jpg"] },
          { id: "slk-04", title: "Modern Motif Kalamkari", price: 129.0, style: "Contemporary", images: ["/images/kalamkari/kal-04-main.jpg"] },] },
      { slug: "georgette-banarasi", name: "Georgette Banarasi Sarees", description: "Fusion sarees blending Banarasi zari artistry with georgette drape.", hero: "/images/modern/gor_ban.png", styles: ["Fusion", "Traditional"], products: [{ id: "slk-01", title: "Indigo Pen Kalamkari Saree", price: 119.0, style: "Pen Kalamkari", images: ["/images/kalamkari/kal-01-main.jpg"] },
          { id: "slk-02", title: "Rust Hand-Block Kalamkari", price: 99.0, style: "Hand Block", images: ["/images/kalamkari/kal-02-main.jpg"] },
          { id: "slk-03", title: "Floral Printed Kalamkari", price: 89.0, style: "Printed", images: ["/images/kalamkari/kal-03-main.jpg"] },
          { id: "slk-04", title: "Modern Motif Kalamkari", price: 129.0, style: "Contemporary", images: ["/images/kalamkari/kal-04-main.jpg"] },] },
    ],
  },

  {
    group: "Everyday & Artistic Drapes",
    categories: [
      { slug: "bandhani", name: "Bandhani Sarees", description: "Vibrant tie-dye sarees from Gujarat and Rajasthan, rich in tradition.", hero: "public/images/everday/bandh.png", styles: ["Traditional", "Contemporary"], products: [{ id: "slk-01", title: "Indigo Pen Kalamkari Saree", price: 119.0, style: "Pen Kalamkari", images: ["/images/kalamkari/kal-01-main.jpg"] },
          { id: "slk-02", title: "Rust Hand-Block Kalamkari", price: 99.0, style: "Hand Block", images: ["/images/kalamkari/kal-02-main.jpg"] },
          { id: "slk-03", title: "Floral Printed Kalamkari", price: 89.0, style: "Printed", images: ["/images/kalamkari/kal-03-main.jpg"] },
          { id: "slk-04", title: "Modern Motif Kalamkari", price: 129.0, style: "Contemporary", images: ["/images/kalamkari/kal-04-main.jpg"] },] },
      { slug: "mulmul", name: "Mul Mul Cotton", description: "Soft, breathable cotton sarees perfect for everyday comfort.", hero: "public/images/everday/milmul.png", styles: ["Casual", "Handcrafted"], products: [{ id: "slk-01", title: "Indigo Pen Kalamkari Saree", price: 119.0, style: "Pen Kalamkari", images: ["/images/kalamkari/kal-01-main.jpg"] },
          { id: "slk-02", title: "Rust Hand-Block Kalamkari", price: 99.0, style: "Hand Block", images: ["/images/kalamkari/kal-02-main.jpg"] },
          { id: "slk-03", title: "Floral Printed Kalamkari", price: 89.0, style: "Printed", images: ["/images/kalamkari/kal-03-main.jpg"] },
          { id: "slk-04", title: "Modern Motif Kalamkari", price: 129.0, style: "Contemporary", images: ["/images/kalamkari/kal-04-main.jpg"] },] },
    ],
  },
];

/* helpers to work with grouped data */
const allCategories = (groups) => groups.flatMap((g) => g.categories);
const findCategoryBySlug = (slug) => allCategories(CATALOG).find((c) => c.slug === slug) || null;

/* -------------------------- Currency Context -------------------------- */
// Base prices in your data are INR
const CurrencyContext = createContext(null);
const useCurrency = () => useContext(CurrencyContext);

function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(localStorage.getItem("currency") || "INR");
  const [rates, setRates] = useState({ INR: 1, EUR: 0.011, USD: 0.012 }); // fallback approx
  const [loadingRates, setLoadingRates] = useState(false);

  useEffect(() => {
    localStorage.setItem("currency", currency);
  }, [currency]);

  useEffect(() => {
    setLoadingRates(true);
    fetch("https://api.exchangerate.host/latest?base=INR&symbols=INR,EUR,USD")
      .then((r) => r.json())
      .then((data) => {
        if (data?.rates?.INR && data?.rates?.EUR && data?.rates?.USD) {
          setRates({ INR: data.rates.INR, EUR: data.rates.EUR, USD: data.rates.USD });
        }
      })
      .catch(() => {
        // keep fallback
      })
      .finally(() => setLoadingRates(false));
  }, []);

  // amountInINR -> in selected currency
  const convert = (amountInINR) => (amountInINR || 0) * (rates[currency] || 1);

  const format = (amountInINR) =>
    new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: currency === "INR" ? 0 : 2,
    }).format(convert(amountInINR));

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, rates, loadingRates, convert, format }}>
      {children}
    </CurrencyContext.Provider>
  );
}


// --- Floating WhatsApp Button ---
function FloatingWhatsApp() {
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "918123320912"; // <- fallback
  const preset = encodeURIComponent(
    "Hello RUPASARA! I’d like help with a saree. 🌸"
  );
  const link = `https://wa.me/${whatsappNumber}?text=${preset}`;

  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-[60] flex items-center justify-center w-14 h-14 rounded-full shadow-lg
                 bg-[#25D366] hover:brightness-95 active:brightness-90 transition
                 animate-[pulse_2.2s_ease-in-out_infinite]"
      title="Chat on WhatsApp"
    >
      {/* WhatsApp SVG */}
      <svg
        viewBox="0 0 32 32"
        className="w-7 h-7"
        aria-hidden="true"
        fill="white"
      >
        <path d="M19.11 17.36c-.26-.13-1.51-.74-1.74-.83-.23-.09-.4-.13-.57.13s-.66.83-.81 1c-.15.17-.3.19-.56.06-.26-.13-1.08-.4-2.06-1.28-.76-.67-1.28-1.49-1.43-1.75-.15-.26-.02-.4.11-.53.12-.12.26-.3.38-.45.13-.15.17-.26.26-.43.09-.17.04-.32-.02-.45-.06-.13-.57-1.37-.78-1.88-.2-.48-.4-.42-.57-.43l-.49-.01c-.17 0-.45.06-.69.32-.23.26-.9.88-.9 2.15s.92 2.49 1.05 2.66c.13.17 1.81 2.77 4.39 3.89 0 0 1.59.68 2.69.86.56.09 1.07.08 1.47.05.45-.03 1.37-.56 1.56-1.11.19-.55.19-1.02.13-1.11-.06-.09-.23-.15-.49-.28z"/>
        <path d="M26.77 5.23A13.33 13.33 0 0 0 16 .67 13.34 13.34 0 0 0 2.67 14c0 2.33.61 4.11 1.64 5.69L2 30l10.57-2.77A13.22 13.22 0 0 0 16 27.33 13.33 13.33 0 0 0 26.77 5.23zM16 25.33c-1.97 0-3.81-.53-5.41-1.45l-.39-.23-6.17 1.62 1.65-6.02-.26-.41A10.63 10.63 0 0 1 5.33 14C5.33 8.81 9.81 4.33 16 4.33S26.67 8.81 26.67 14 22.19 25.33 16 25.33z"/>
      </svg>
    </a>
  );
}


/* -------------------------- Utilities -------------------------- */
const useScrollLock = (locked) => {
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = locked ? "hidden" : original || "auto";
    return () => (document.body.style.overflow = original);
  }, [locked]);
};
// Deprecated: use useCurrency().format(amountInINR) instead
const currency = undefined;

/* -------------------------- Layout -------------------------- */
const Nav = () => {
  const { items } = useCart();
  const { currency, setCurrency, loadingRates } = useCurrency();
  const [open, setOpen] = useState(false);
  const count = items.reduce((s, i) => s + i.qty, 0);

  return (
      <header className="sticky top-0 z-50 backdrop-blur bg-white border-b border-neutral-200 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group" aria-label="RUPASARA Home">
  <img
    src="/logo/logo.jpg"
    alt="RUPASARA"
    className="h-8 w-auto md:h-9 rounded"
    loading="eager"
    width="120"
    height="36"
  />
  {/* If you want text next to the logo, keep this span. Otherwise, remove it. */}
  <span className="font-semibold tracking-widest text-xl hidden sm:inline">RUPASARA</span>
</Link>


        {/* Only the 4 main groups */}
        <nav className="hidden md:flex gap-6 text-sm">
          {CATALOG.map((group) => (
            <a key={group.group} href={`#${group.group.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} className="hover:opacity-70">
              {group.group}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Currency selector */}
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="text-sm border border-neutral-300 rounded-lg px-2 py-1"
            aria-label="Currency"
          >
            <option value="INR">INR ₹</option>
            <option value="EUR">EUR €</option>
            <option value="USD">USD $</option>
          </select>
          <span className="hidden md:inline text-xs text-neutral-500">{loadingRates ? "Updating rates…" : ""}</span>

          <Link to="/cart" className="text-sm px-3 py-1.5 rounded-full border border-neutral-300">Cart ({count})</Link>
          <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-neutral-200">
          <div className="px-4 py-2 flex flex-col">
            {CATALOG.map((group) => (
              <a
                key={group.group}
                href={`#${group.group.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                className="py-2"
                onClick={() => setOpen(false)}
              >
                {group.group}
              </a>
            ))}
            <Link to="/cart" className="py-2" onClick={() => setOpen(false)}>Cart</Link>
          </div>
        </div>
      )}
    </header>
  );
};


const Footer = () => (
  <footer className="mt-24 border-t border-neutral-200 bg-neutral-50">
    <div className="mx-auto max-w-7xl px-4 py-12 grid md:grid-cols-3 gap-8 text-center md:text-left">
    <div className="flex flex-col items-start">
  <img
    src="/logo/logo.jpg"
    alt="RUPASARA"
    className="h-9 w-auto mx-auto md:mx-0 rounded"
    loading="lazy"
    width="140"
    height="40"
  />

  {/* Wordmark + end-aligned tagline */}
  <div className="mt-2 inline-flex flex-col leading-tight">
    <span className="text-2xl font-semibold tracking-wide">RUPASARA</span>
    <span className="text-sm text-neutral-600 self-end -mt-0.5">By RK House</span>
  </div>

  <p className="mt-4 text-xs text-neutral-500">
    Timeless sarees crafted with tradition, elegance, and artistry.
  </p>
</div>

      {/* Contact Info */}
      <div>
        <p className="text-lg font-medium mb-3">Contact Us</p>
        <p className="text-sm text-neutral-700 leading-relaxed">
          221 NE 3rd Main, 5th Cross,<br />
          Nisaraga Layout, Harpanahalli,<br />
          Jigani, Bengaluru – 560105
        </p>
        <p className="mt-2 text-sm text-neutral-700">
          📞 <a href="tel:+918123320912" className="hover:underline">+91 81233 20912</a>
        </p>
        <p className="mt-1 text-sm text-neutral-700">
          📧 <a href="mailto:rksareehouse14@gmail.com" className="hover:underline">rksareehouse14@gmail.com</a>
        </p>
      </div>

      {/* Social Links */}
      <div>
        <p className="text-lg font-medium mb-3">Follow Us</p>
        <div className="flex justify-center md:justify-start gap-4 mt-2">
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:opacity-80"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="w-6 h-6 text-pink-600"
            >
              <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm8.25 2a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z"/>
            </svg>
            <span className="text-sm">Instagram</span>
          </a>
        </div>
          <p className="mt-4 text-sm font-medium text-neutral-800 italic text-center md:text-left">
    🇮🇳 Proudly promoting <span className="font-semibold">Make in India</span> and supporting Indian weavers.
  </p>

      </div>
    </div>

    <div className="border-t border-neutral-200 mt-8 pt-4 pb-6 text-center text-xs text-neutral-500">
      © {new Date().getFullYear()} RUPASARA. All rights reserved.
    </div>
  </footer>
);

/* -------------------------- Home Page -------------------------- */
const FloatingImage = ({ src, delay = 0, size = "w-40", className = "" }) => (
  <motion.img
    src={src}
    alt="RUPASARA showcase"
    className={`rounded-2xl shadow-lg ${size} ${className}`}
    initial={{ y: 10, opacity: 0 }}
    animate={{ y: [10, -10, 10], opacity: 1 }}
    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay }}
    loading="lazy"
  />
);

const Hero = () => {
  const firstCat = allCategories(CATALOG)[0];
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 pt-14 pb-24 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="font-heading text-5xl md:text-7xl font-semibold tracking-tight leading-tight">
  RUPASĀRA
</h1>
<p className="font-script text-2xl md:text-3xl mt-4 text-rose-700">
  Essence of Form — Where Tradition Becomes Timeless
</p>
<p className="font-body mt-6 text-neutral-600 max-w-prose">
  
</p>Heritage <em>in</em> Every <em>Fold</em> 

          <div className="mt-8 flex gap-3">
            <Link to={`/c/${firstCat?.slug || ""}`} className="px-5 py-3 rounded-xl bg-black text-white text-sm">
              Shop {firstCat?.name || "Now"}
            </Link>
            <a href="#categories" className="px-5 py-3 rounded-xl border border-neutral-300 text-sm">Browse All</a>
          </div>
          <p className="mt-8 text-xs uppercase tracking-widest text-neutral-500">RUPASARA • By RK House</p>
        </div>
        <div className="relative min-h-[420px]">
         <div className="absolute inset-0 -z-10 bg-gradient-to-br from-rose-50 via-white to-rose-100" />

        {/* Top-right - Small accent */}
        <div className="absolute right-8 top-6">
        <FloatingImage size="w-36 md:w-44" delay={1.5} src="/images/header/h1.png" />
        </div>

      {/* Mid-right - Large feature image */}
      <div className="absolute right-16 top-32">
      <FloatingImage size="w-48 md:w-56" delay={3.5} src="/images/header/h2.png" />
      </div>

      {/* Bottom-left - Large */}
      <div className="absolute left-8 bottom-10">
      <FloatingImage size="w-56 md:w-64" delay={9.5} src="/images/header/h5.jpg" />
      </div>
      {/* Center - New large centerpiece */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-20">
      <FloatingImage size="w-60 md:w-72" delay={17.5} src="/images/header/h6.png" />
      </div>
        </div>
      </div>
    </section>
  );
};

const CategoryCards = () => (
  <section id="categories" className="mx-auto max-w-7xl px-4 pb-8">
    <h2 className="text-2xl md:text-3xl font-semibold mb-6">Shop by Category</h2>

    <div className="space-y-10">
      {CATALOG.map((grp) => (
        <div key={grp.group} id={grp.group.toLowerCase().replace(/[^a-z0-9]+/g, "-")}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl md:text-2xl font-medium">{grp.group}</h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {grp.categories.map((cat) => (
              <Link key={cat.slug} to={`/c/${cat.slug}`} className="group relative rounded-2xl overflow-hidden border border-neutral-200 bg-white">
                <img src={cat.hero} alt={cat.name} className="h-56 w-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-medium">{cat.name}</p>
                    <span className="text-xs text-neutral-500">{cat.products?.length || 0} styles</span>
                  </div>
                  <p className="mt-1 text-sm text-neutral-600 line-clamp-2">{cat.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  </section>
);

const FeaturedStrip = () => (
  <section className="mx-auto max-w-7xl px-4 py-16">
    <div className="rounded-3xl bg-neutral-50 border border-neutral-200 p-6 md:p-10">
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { title: "Hand-picked Curation", text: "Every piece is vetted for fabric, craftsmanship and finish." },
          { title: "Worldwide Shipping", text: "From India to your door — tracked, insured, and on time." },
          { title: "Easy Support", text: "WhatsApp & email support for size, styling and care." },
        ].map((b, i) => (
          <div key={i}>
            <p className="font-medium">{b.title}</p>
            <p className="text-sm text-neutral-600 mt-1">{b.text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Home = () => (
  <main>
    <Hero />
    <CategoryCards />
    <FeaturedStrip />
  </main>
);

/* -------------------------- Category Page -------------------------- */
const ProductCard = ({ p, onQuick }) => {
  const { add } = useCart();
  const { format } = useCurrency();
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "918123320912";
  const waText = encodeURIComponent(
    `Hello RUPASARA, I want to order: ${p.title} (${p.style}) — ${format(p.price)} (${Math.round(p.price)} INR base)`
  );
  const waLink = `https://wa.me/${whatsappNumber}?text=${waText}`;

  return (
    <div className="group rounded-2xl border border-neutral-200 overflow-hidden bg-white">
      <div className="relative">
        <img src={p.images?.[0]} alt={p.title} className="h-64 w-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        <button onClick={() => onQuick(p)} className="absolute bottom-3 right-3 px-3 py-1.5 text-xs rounded-lg bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity">Quick view</button>
      </div>
      <div className="p-4">
        <p className="font-medium">{p.title}</p>
        <div className="mt-1 flex items-center justify-between text-sm">
          <span className="text-neutral-700">{format(p.price)}</span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-100 border border-neutral-200">{p.style}</span>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            className="px-3 py-2 rounded-lg bg-black text-white text-xs"
            onClick={() => add({ id: p.id, title: p.title, price: p.price, style: p.style, image: p.images?.[0] })}
          >
            Add to Cart
          </button>
          <a href={waLink} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-lg border border-neutral-300 text-xs">WhatsApp</a>
        </div>
      </div>
    </div>
  );
};

const QuickView = ({ open, product, onClose }) => {
  const { add } = useCart();
  const { format } = useCurrency();
  useScrollLock(open);
  if (!open || !product) return null;

  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "918123320912";
  const waText = encodeURIComponent(
    `Hello RUPASARA, I want to order: ${product.title} (${product.style}) — ${format(product.price)} (${Math.round(product.price)} INR base)`
  );
  const waLink = `https://wa.me/${whatsappNumber}?text=${waText}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-[92vw] max-w-3xl rounded-2xl bg-white overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="relative">
            <img src={product.images?.[0]} alt={product.title} className="h-72 md:h-full w-full object-cover" />
          </div>
          <div className="p-6">
            <p className="text-xl font-medium">{product.title}</p>
            <p className="mt-2 text-neutral-600 text-sm">Style: {product.style}</p>
            <p className="mt-4 text-2xl">{format(product.price)}</p>
            <p className="mt-4 text-sm text-neutral-600">Premium quality saree crafted with care. Replace this copy with your real product details, weave notes, and care instructions.</p>
            <div className="mt-6 flex gap-3">
              <button
                className="px-5 py-3 rounded-xl bg-black text-white text-sm"
                onClick={() => add({ id: product.id, title: product.title, price: product.price, style: product.style, image: product.images?.[0] })}
              >
                Add to Cart
              </button>
              <a className="px-5 py-3 rounded-xl border border-neutral-300 text-sm" href={waLink} target="_blank" rel="noreferrer">WhatsApp</a>
              <button className="px-5 py-3 rounded-xl border border-neutral-300 text-sm" onClick={onClose}>Close</button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const CategoryPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const category = useMemo(() => findCategoryBySlug(slug), [slug]);
  const [filter, setFilter] = useState("All");
  const [quick, setQuick] = useState(null);

  useEffect(() => {
    if (!category) navigate("/");
  }, [category, navigate]);
  if (!category) return null;

  const filtered = useMemo(
    () => (filter === "All" ? category.products : category.products.filter((p) => p.style === filter)),
    [filter, category.products]
  );

  return (
    <main>
      <section className="relative">
        <div className="h-[32vh] md:h-[40vh] relative">
          <img src={category.hero} alt={category.name} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-black/0" />
          <div className="absolute bottom-6 left-4 md:left-8">
            <h1 className="text-3xl md:text-5xl font-semibold text-white">{category.name}</h1>
            <p className="mt-2 text-neutral-200 max-w-xl">{category.description}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilter("All")}
            className={`px-3 py-1.5 rounded-full text-sm border ${filter === "All" ? "bg-black text-white border-black" : "border-neutral-300"}`}
          >
            All
          </button>
          {category.styles.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-sm border ${filter === s ? "bg-black text-white border-black" : "border-neutral-300"}`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <ProductCard key={p.id} p={p} onQuick={setQuick} />
          ))}
        </div>
      </section>

      <QuickView open={!!quick} product={quick} onClose={() => setQuick(null)} />
    </main>
  );
};

/* -------------------------- Cart Page -------------------------- */
const CartPage = () => {
  const { items, setQty, remove, totals, clear } = useCart();
  const { format } = useCurrency();
  const hasItems = items.length > 0;
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "0000000000";

  const waText = useMemo(() => {
    const lines = [
      "Hello RUPASARA, I'd like to order:",
      ...items.map((i) => `• ${i.title} (${i.style}) x${i.qty} — ${format(i.price)} each`),
      `Subtotal: ${format(totals.subtotal)} (base ${Math.round(totals.subtotal)} INR)`
    ];
    return encodeURIComponent(lines.join("/n"));
  }, [items, totals.subtotal, format]);

  const waLink = `https://wa.me/${whatsappNumber}?text=${waText}`;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-semibold">Your Cart</h1>

      {!hasItems && <p className="mt-6 text-neutral-600">Your cart is empty.</p>}

      {hasItems && (
        <div className="mt-6 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 border border-neutral-200 rounded-2xl p-4">
                <img src={item.image} alt={item.title} className="w-28 h-28 object-cover rounded-xl" />
                <div className="flex-1">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-neutral-600">{item.style}</p>
                  <p className="mt-1">{format(item.price)}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <label className="text-sm">Qty</label>
                    <input
                      type="number"
                      min="1"
                      className="w-20 border border-neutral-300 rounded-lg px-2 py-1"
                      value={item.qty}
                      onChange={(e) => setQty(item.id, e.target.value)}
                    />
                    <button className="ml-auto text-sm text-red-600" onClick={() => remove(item.id)}>Remove</button>
                  </div>
                </div>
              </div>
            ))}
            <button className="text-sm underline" onClick={clear}>Clear cart</button>
          </div>

          <div className="border border-neutral-200 rounded-2xl p-6 h-max">
            <p className="font-medium">Order Summary</p>
            <div className="mt-3 flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{format(totals.subtotal)}</span>
            </div>
            <div className="mt-6 grid gap-3">
              <a href={waLink} target="_blank" rel="noreferrer" className="px-5 py-3 rounded-xl bg-black text-white text-sm text-center">Order on WhatsApp</a>
              <p className="text-xs text-neutral-500">We’ll confirm availability, shipping & payment on WhatsApp.</p>
            </div>
            <hr className="my-6" />
            <p className="font-medium mb-2">Or leave your details</p>
            <OrderForm />
          </div>
        </div>
      )}
    </main>
  );
};

const OrderForm = () => {
  const webhook = import.meta.env.VITE_SHEET_WEBHOOK || "";
  const { items, totals, clear } = useCart();

  const submit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get("name"),
      phone: fd.get("phone"),
      address: fd.get("address"),
      notes: fd.get("notes"),
      items,
      subtotal: totals.subtotal,
      created_at: new Date().toISOString(),
    };

    if (!webhook) {
      alert("No Google Sheet webhook set. Set VITE_SHEET_WEBHOOK in .env.");
      return;
    }

    try {
      await fetch(webhook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      alert("Order submitted! We will contact you shortly.");
      clear();
      e.currentTarget.reset();
    } catch (err) {
      console.error(err);
      alert("Failed to submit. Please try WhatsApp instead.");
    }
  };

  return (
    <form className="grid gap-3" onSubmit={submit}>
      <input name="name" placeholder="Full name" className="border border-neutral-300 rounded-lg px-3 py-2" required />
      <input name="phone" placeholder="Phone / WhatsApp" className="border border-neutral-300 rounded-lg px-3 py-2" required />
      <textarea name="address" placeholder="Shipping address" className="border border-neutral-300 rounded-lg px-3 py-2" rows={3} required />
      <textarea name="notes" placeholder="Notes (color, blouse, pallu pref, etc.)" className="border border-neutral-300 rounded-lg px-3 py-2" rows={2} />
      <button className="mt-2 px-5 py-3 rounded-xl border border-neutral-300 text-sm" type="submit">Submit Order</button>
    </form>
  );
};

/* -------------------------- Router & App -------------------------- */
const ScrollToTop = () => {
  useEffect(() => {
    const handle = () => {
      const { hash } = window.location;
      if (hash) {
        const el = document.getElementById(hash.replace("#", ""));
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    handle(); // on mount
    window.addEventListener("hashchange", handle);
    window.addEventListener("popstate", handle);
    return () => {
      window.removeEventListener("hashchange", handle);
      window.removeEventListener("popstate", handle);
    };
  }, []);
  return null;
};

export default function App() {
  return (
    <Router>
      <CurrencyProvider>
        <CartProvider>
          <div className="min-h-screen bg-white text-neutral-900">
            <Nav />
            <ScrollToTop />
            <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/c/:slug" element={<CategoryPage />} />
  <Route path="/cart" element={<CartPage />} />
</Routes>
{/* Floating WhatsApp icon */}
            <FloatingWhatsApp />
{/* ✨ Flowing Highlight Bar - Above Footer */}
<div className="bg-blue-50 border-t border-blue-200 py-3">
  <p className="text-center text-sm font-medium text-blue-900 animate-pulse tracking-wide">
    💡 All prices are negotiable • 💳 Payment is accepted only via UPI / Bank Transfers • 📞 Contact us before purchase
  </p>
</div>

<Footer />
          </div>
        </CartProvider>
      </CurrencyProvider>
    </Router>
  );
}
