import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
import { CartProvider, useCart } from "./lib/cart";
import { CartDrawer, Icon, Logo } from "./components/StoreUI";
import HomePage from "./components/HomePage";
import "./styles.css";
import "./brand-refinement.css";
const ShopPage = lazy(() =>
  import("./components/ShopPages").then((m) => ({ default: m.ShopPage })),
);
const ProductPage = lazy(() =>
  import("./components/ShopPages").then((m) => ({ default: m.ProductPage })),
);
const CheckoutPage = lazy(() =>
  import("./components/ShopPages").then((m) => ({ default: m.CheckoutPage })),
);
const InfoPage = lazy(() => import("./components/InfoPage"));
function Store() {
  const [route, setRoute] = useState(() => location.hash || "#/"),
    [cartOpen, setCartOpen] = useState(false),
    [menu, setMenu] = useState(false),
    [search, setSearch] = useState(false),
    [query, setQuery] = useState("");
  const { count, notice } = useCart();
  const first = useRef(true);
  const main = useRef<HTMLElement>(null);
  useEffect(() => {
    const change = () => setRoute(location.hash || "#/");
    window.addEventListener("hashchange", change);
    return () => window.removeEventListener("hashchange", change);
  }, []);
  useEffect(() => {
    setMenu(false);
    setSearch(false);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    const title = route.startsWith("#/product")
      ? "Product collection"
      : route.startsWith("#/shop")
        ? "The collection"
        : route === "#/checkout"
          ? "Order draft"
          : route === "#/"
            ? "From the mountains of Baltistan"
            : route.slice(2).replace("-", " ");
    document.title = `${title} | Skardu Organic`;
    if (!first.current) main.current?.focus({ preventScroll: true });
    first.current = false;
  }, [route]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(false);
        setSearch(false);
      }
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, []);
  const path = route.split("?")[0];
  const nav = [
    ["The collection", "#/shop"],
    ["Our story", "#/about"],
    ["The journal", "#/journal"],
  ];
  return (
    <>
      <a
        className="skip-link"
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          main.current?.focus();
        }}
      >
        Skip to content
      </a>
      <div className="announcement">
        <span>A collection inspired by the mountains of Baltistan</span>
        <a href="#/about">Discover our roots ↗</a>
      </div>
      <header className="site-header">
        <Logo />
        <nav className="desktop-nav" aria-label="Main navigation">
          {nav.map(([label, href]) => (
            <a
              key={href}
              href={href}
              aria-current={path === href ? "page" : undefined}
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="icon-button"
            aria-label="Search the collection"
            aria-expanded={search}
            onClick={() => {
              setSearch(!search);
              setMenu(false);
            }}
          >
            <Icon name="search" />
          </button>
          <button
            className="bag-button"
            onClick={() => setCartOpen(true)}
            aria-label={`Open bag, ${count} items`}
          >
            <Icon name="bag" />
            <span>Bag</span>
            <b>{count}</b>
          </button>
          <button
            className="icon-button mobile-menu-button"
            aria-label={menu ? "Close menu" : "Open menu"}
            aria-expanded={menu}
            aria-controls="mobile-nav"
            onClick={() => {
              setMenu(!menu);
              setSearch(false);
            }}
          >
            <Icon name={menu ? "close" : "menu"} />
          </button>
        </div>
        {menu && (
          <nav
            className="mobile-nav"
            id="mobile-nav"
            aria-label="Mobile navigation"
          >
            {[...nav, ["Contact", "#/contact"]].map(([label, href]) => (
              <a href={href} key={href}>
                {label}
                <Icon />
              </a>
            ))}
          </nav>
        )}
        {search && (
          <form
            className="header-search"
            onSubmit={(e) => {
              e.preventDefault();
              location.hash = `#/shop?q=${encodeURIComponent(query)}`;
              setSearch(false);
            }}
          >
            <label>
              <span className="sr-only">Search products</span>
              <input
                autoFocus
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Apricots, oils, little everyday treasures…"
              />
            </label>
            <button className="button" type="submit">
              Search <Icon />
            </button>
          </form>
        )}
      </header>
      <main ref={main} id="main" tabIndex={-1}>
        <Suspense
          fallback={
            <div className="page-loading" role="status">
              Opening the collection…
            </div>
          }
        >
          {path === "#/" ? (
            <HomePage />
          ) : path === "#/shop" ? (
            <ShopPage
              initialQuery={
                new URLSearchParams(route.split("?")[1] || "").get("q") || ""
              }
            />
          ) : path.startsWith("#/product/") ? (
            <ProductPage
              id={path.split("/")[2]}
              onOpenCart={() => setCartOpen(true)}
            />
          ) : path === "#/checkout" ? (
            <CheckoutPage />
          ) : (
            <InfoPage page={path.slice(2)} />
          )}
        </Suspense>
      </main>
      <footer className="site-footer">
        <div className="footer-top">
          <div>
            <Logo />
            <p>
              A little of the mountains.
              <br />A little closer to home.
            </p>
          </div>
          <div>
            <p className="eyebrow">Explore</p>
            <a href="#/shop">The collection</a>
            <a href="#/about">Our story</a>
            <a href="#/journal">The journal</a>
          </div>
          <div>
            <p className="eyebrow">Here to help</p>
            <a href="#/contact">Contact</a>
            <a href="#/shipping">Shipping & returns</a>
            <a href="#/privacy">Privacy</a>
            <a href="#/terms">Terms</a>
          </div>
          <div className="footer-note">
            <p className="eyebrow">A collection in the making</p>
            <p>
              Sample catalog and concept imagery.
              <br />
              Live ordering is not yet available.
            </p>
            <a href="#/about" className="text-link">
              Get to know the project <Icon />
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Skardu Organic</span>
          <span>Inspired by Baltistan, Pakistan</span>
          <span>Considered by nature.</span>
        </div>
      </footer>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <div
        className="cart-announcement"
        role="status"
        aria-live="polite"
        key={notice + count}
      >
        {notice && (
          <span>
            {notice}{" "}
            <button onClick={() => setCartOpen(true)}>
              View bag ({count})
            </button>
          </span>
        )}
      </div>
    </>
  );
}
export default function App() {
  return (
    <CartProvider>
      <Store />
    </CartProvider>
  );
}
