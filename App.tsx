import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
import { CartProvider, useCart } from "./lib/cart";
import { CartDrawer, Icon } from "./components/StoreUI";
import { StoreHeader, StoreFooter } from "./components/StoreLayout";
import HomePage from "./components/HomePage";
import LoadBoundary from "./components/LoadBoundary";
import "./styles.css";
import "./storefront.css";

const ShopPage = lazy(() => import("./components/ShopPages").then((m) => ({ default: m.ShopPage })));
const ProductPage = lazy(() => import("./components/ShopPages").then((m) => ({ default: m.ProductPage })));
const CheckoutPage = lazy(() => import("./components/ShopPages").then((m) => ({ default: m.CheckoutPage })));
const InfoPage = lazy(() => import("./components/InfoPage"));

function Store() {
  const [route, setRoute] = useState(() => location.hash || "#/"),
    [cartOpen, setCartOpen] = useState(false),
    [noticeVisible, setNoticeVisible] = useState(false);
  const { count, notice } = useCart();
  const first = useRef(true);
  const main = useRef<HTMLElement>(null);
  const path = route.split("?")[0];

  useEffect(() => {
    if (!notice) return;
    setNoticeVisible(true);
    const timeout = window.setTimeout(() => setNoticeVisible(false), 7000);
    return () => window.clearTimeout(timeout);
  }, [notice, count]);

  useEffect(() => {
    const change = () => setRoute(location.hash || "#/");
    window.addEventListener("hashchange", change);
    return () => window.removeEventListener("hashchange", change);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const title = path.startsWith("#/product") ? "Product collection"
      : path === "#/shop" ? "Shop the collection"
      : path === "#/checkout" ? "Order draft"
      : path === "#/" ? "Dried fruits, oils & mountain favourites"
      : path === "#/about" ? "Our story"
      : path.slice(2).replace("-", " ");
    document.title = `${title} | Skardu Organic`;
    if (!first.current) main.current?.focus({ preventScroll: true });
    first.current = false;
  }, [path]);

  return (
    <>
      <a className="skip-link" href="#main" onClick={(event) => {
        event.preventDefault();
        main.current?.focus();
      }}>Skip to content</a>
      <div className="store-announcement">
        <p>Rooted in Baltistan. Made for everyday.</p>
        <a href="#/about">Meet Skardu Organic</a>
      </div>
      <StoreHeader route={route} count={count} onOpenCart={() => setCartOpen(true)} />
      <main ref={main} id="main" tabIndex={-1}>
        <LoadBoundary key={path} page>
        <Suspense fallback={<div className="page-loading" role="status">Opening the collection…</div>}>
          {path === "#/" ? <HomePage />
            : path === "#/shop" ? <ShopPage initialQuery={new URLSearchParams(route.split("?")[1] || "").get("q") || ""} />
            : path.startsWith("#/product/") ? <ProductPage id={path.split("/")[2]} onOpenCart={() => setCartOpen(true)} />
            : path === "#/checkout" ? <CheckoutPage />
            : <InfoPage page={path.slice(2)} />}
        </Suspense>
        </LoadBoundary>
      </main>
      <StoreFooter />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <div className="cart-announcement" role="status" aria-live="polite" key={notice + count}>
        {notice && noticeVisible && <span>{notice} <button onClick={() => setCartOpen(true)}>View bag ({count})</button><button className="dismiss-notice" aria-label="Dismiss bag notification" onClick={() => setNoticeVisible(false)}><Icon name="close" /></button></span>}
      </div>
    </>
  );
}

export default function App() {
  return <CartProvider><Store /></CartProvider>;
}
