import { FormEvent, useEffect, useRef, useState } from "react";
import { Icon, Logo } from "./StoreUI";

const links = [
  { label: "Shop all", href: "#/shop", category: "All" },
  { label: "Dry fruits", href: "#/shop?category=Dry%20fruits", category: "Dry fruits" },
  { label: "Apricot oil", href: "#/shop?category=Oils", category: "Oils" },
  { label: "Shilajit", href: "#/shop?category=Shilajit", category: "Shilajit" },
  { label: "Our story", href: "#/about", category: "" },
];

export function StoreHeader({ route, count, onOpenCart }: {
  route: string; count: number; onOpenCart: () => void;
}) {
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  const menuButton = useRef<HTMLButtonElement>(null);
  const searchButton = useRef<HTMLButtonElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const menuPanel = useRef<HTMLElement>(null);
  const path = route.split("?")[0];
  const category = new URLSearchParams(route.split("?")[1] || "").get("category") || "All";

  useEffect(() => {
    setMenu(false);
    setSearch(false);
    setQuery(new URLSearchParams(route.split("?")[1] || "").get("q") || "");
  }, [route]);

  useEffect(() => {
    if (search) searchInput.current?.focus();
    if (menu) menuPanel.current?.querySelector<HTMLAnchorElement>("a")?.focus();
  }, [menu, search]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (menu) { setMenu(false); menuButton.current?.focus(); }
      if (search) { setSearch(false); searchButton.current?.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menu, search]);

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    location.hash = query.trim() ? `#/shop?q=${encodeURIComponent(query.trim())}` : "#/shop";
    setSearch(false);
    searchInput.current?.blur();
  };
  const active = (link: typeof links[number]) => path === "#/shop"
    ? link.category === category : path === link.href;

  return (
    <>
      {menu && <button className="store-menu-backdrop" aria-label="Close navigation overlay" tabIndex={-1} onClick={() => { setMenu(false); menuButton.current?.focus(); }} />}
      <header className="store-header">
        <div className="store-header-main section-wrap">
          <Logo />
          <form className={`store-search${search ? " is-open" : ""}`} role="search" onSubmit={submitSearch}>
            <label className="sr-only" htmlFor="store-search">Search the store</label>
            <input ref={searchInput} id="store-search" type="search" name="q" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search apricots, almonds, oils…" />
            <button type="submit" aria-label="Submit search"><Icon name="search" /></button>
          </form>
          <div className="store-header-actions">
            <button ref={searchButton} className="store-icon store-search-toggle" aria-label="Search the collection" aria-expanded={search} aria-controls="store-search" onClick={() => { setSearch(!search); setMenu(false); }}><Icon name="search" /></button>
            <button className="store-bag" aria-label={`Open bag, ${count} items`} onClick={() => { setMenu(false); onOpenCart(); }}><Icon name="bag" /><span>Your bag</span><b>{count}</b></button>
            <button ref={menuButton} className="store-icon store-menu-toggle" aria-label={menu ? "Close menu" : "Open menu"} aria-expanded={menu} aria-controls="mobile-store-nav" onClick={() => { setMenu(!menu); setSearch(false); }}><Icon name={menu ? "close" : "menu"} /></button>
          </div>
        </div>
        <nav className="store-category-nav" aria-label="Main navigation">
          <div className="section-wrap">
            {links.map((link) => <a href={link.href} key={link.href} aria-current={active(link) ? "page" : undefined}>{link.label}</a>)}
            <a className="store-contact-link" href="#/contact">Need help?</a>
          </div>
        </nav>
        {menu && <nav ref={menuPanel} id="mobile-store-nav" className="store-mobile-nav" aria-label="Mobile navigation">
          <div className="store-mobile-title"><span>Explore Skardu Organic</span><button className="store-icon" aria-label="Close navigation" onClick={() => { setMenu(false); menuButton.current?.focus(); }}><Icon name="close" /></button></div>
          {links.map((link) => <a href={link.href} key={link.href} aria-current={active(link) ? "page" : undefined}>{link.label}<Icon /></a>)}
          <a href="#/contact">Contact & help<Icon /></a>
        </nav>}
      </header>
    </>
  );
}

export function StoreFooter() {
  return (
    <footer className="store-footer">
      <div className="section-wrap store-footer-grid">
        <div className="store-footer-brand"><Logo /><p>A little inspiration from Baltistan.<br />Good things for your everyday.</p></div>
        <div><h2>Shop</h2><a href="#/shop">All products</a><a href="#/shop?category=Dry%20fruits">Dried fruits & almonds</a><a href="#/shop?category=Oils">Apricot kernel oil</a><a href="#/shop?category=Shilajit">Shilajit</a></div>
        <div><h2>Skardu Organic</h2><a href="#/about">Our story</a><a href="#/journal">The journal</a><a href="#/contact">Contact</a><a href="#/shipping">Shipping & returns</a></div>
        <div className="store-footer-status"><h2>Before you order</h2><p>Catalog details are being finalised. Live ordering is being prepared; for now, you can save your selection as an order draft.</p><a href="#/terms">Ordering information <Icon /></a></div>
      </div>
      <div className="section-wrap store-footer-bottom"><span>© {new Date().getFullYear()} Skardu Organic</span><div><a href="#/privacy">Privacy</a><a href="#/terms">Terms</a></div><span>Baltistan, Pakistan</span></div>
    </footer>
  );
}
