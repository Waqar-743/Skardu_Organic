import React, {
  lazy,
  Suspense,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { CartProvider, useCart } from "./lib/cart";
import { CartDrawer, Icon, Logo } from "./components/StoreUI";
import HomePage from "./components/HomePage";
import "./styles.css";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

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
  const header = useRef<HTMLElement>(null);
  const smoother = useRef<ScrollSmoother | null>(null);

  /* Smooth scrolling + progress hairline */
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const s = ScrollSmoother.create({
        smooth: 1.15,
        effects: true,
        ignoreMobileResize: true,
      });
      smoother.current = s;
      gsap.fromTo(
        ".scroll-progress i",
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
        },
      );
      return () => {
        s.kill();
        smoother.current = null;
      };
    });
    return () => mm.revert();
  }, []);

  /* Routing */
  useEffect(() => {
    const change = () => setRoute(location.hash || "#/");
    window.addEventListener("hashchange", change);
    return () => window.removeEventListener("hashchange", change);
  }, []);

  useEffect(() => {
    setMenu(false);
    setSearch(false);
    const s = smoother.current;
    if (s) s.scrollTo(0, false);
    else window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
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
    requestAnimationFrame(() =>
      requestAnimationFrame(() => ScrollTrigger.refresh()),
    );
  }, [route]);

  /* Glass + hide-on-scroll header */
  useEffect(() => {
    const el = header.current;
    let lastY = window.scrollY;
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      el.classList.toggle("is-scrolled", y > 30);
      if (!menu && !search) {
        if (y > 340 && y > lastY + 4) el.classList.add("is-hidden");
        else if (y < lastY - 4 || y <= 340) el.classList.remove("is-hidden");
      } else {
        el.classList.remove("is-hidden");
      }
      lastY = y;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, [menu, search]);

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

  useEffect(() => {
    document.body.classList.toggle("menu-open", menu);
    return () => document.body.classList.remove("menu-open");
  }, [menu]);

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
      <div className="scroll-progress" aria-hidden="true">
        <i />
      </div>
      <header
        className={`site-header${path === "#/" ? " is-home" : ""}${menu ? " menu-open" : ""}`}
        ref={header}
      >
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
            <div className="mobile-nav-meta">
              <span>Skardu · Baltistan</span>
              <span>2,228 m above sea level</span>
            </div>
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
              <Icon name="search" />
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
      <div id="smooth-wrapper">
        <div id="smooth-content">
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
                    new URLSearchParams(route.split("?")[1] || "").get("q") ||
                    ""
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
            <div className="footer-inner section-wrap">
              <div className="footer-top">
                <div>
                  <Logo light />
                  <p>
                    A little of the mountains.
                    <br />A little closer to home.
                  </p>
                </div>
                <div>
                  <p className="eyebrow">Explore</p>
                  <div className="footer-links">
                    <a href="#/shop">The collection</a>
                    <a href="#/about">Our story</a>
                    <a href="#/journal">The journal</a>
                  </div>
                </div>
                <div>
                  <p className="eyebrow">Here to help</p>
                  <div className="footer-links">
                    <a href="#/contact">Contact</a>
                    <a href="#/shipping">Shipping &amp; returns</a>
                    <a href="#/privacy">Privacy</a>
                    <a href="#/terms">Terms</a>
                  </div>
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
              <div className="footer-giant" aria-hidden="true">
                Skardu
              </div>
              <div className="footer-bottom">
                <span>© {new Date().getFullYear()} Skardu Organic</span>
                <span>35.2971° N · 75.6333° E — Baltistan, Pakistan</span>
                <span>Considered by nature.</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
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
