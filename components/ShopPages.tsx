import React, { useEffect, useState } from "react";
import { catalog, categories, money } from "../data/catalog";
import { useCart } from "../lib/cart";
import { Icon, ProductCard, Quantity } from "./StoreUI";

const sortOptions = ["curated", "low", "high", "name"];
const priceOptions = ["all", "1500", "2000"];

function collectionParams() {
  return new URLSearchParams(location.hash.split("?")[1] || "");
}

function collectionCategory(value: string | null) {
  return value && categories.includes(value) ? value : "All";
}

export function ShopPage({ initialQuery = "" }: { initialQuery?: string }) {
  const [query, setQuery] = useState(
      () => collectionParams().get("q") ?? initialQuery,
    ),
    [category, setCategory] = useState(() =>
      collectionCategory(collectionParams().get("category")),
    ),
    [sort, setSort] = useState(() => {
      const value = collectionParams().get("sort");
      return value && sortOptions.includes(value) ? value : "curated";
    }),
    [max, setMax] = useState(() => {
      const value = collectionParams().get("max");
      return value && priceOptions.includes(value) ? value : "all";
    });

  useEffect(() => {
    const syncLocation = () => {
      if (location.hash.split("?")[0] !== "#/shop") return;
      const params = collectionParams();
      setQuery(params.get("q") ?? "");
      setCategory(collectionCategory(params.get("category")));
      // Category and search links can change without remounting this page.
      // Keep independent price/sort choices unless the link specifies them.
      if (params.has("sort")) {
        const value = params.get("sort")!;
        setSort(sortOptions.includes(value) ? value : "curated");
      }
      if (params.has("max")) {
        const value = params.get("max")!;
        setMax(priceOptions.includes(value) ? value : "all");
      }
    };
    syncLocation();
    window.addEventListener("hashchange", syncLocation);
    return () => window.removeEventListener("hashchange", syncLocation);
  }, [initialQuery]);

  function updateFilters(
    changes: Partial<{
      query: string;
      category: string;
      sort: string;
      max: string;
    }>,
  ) {
    const next = { query, category, sort, max, ...changes };
    setQuery(next.query);
    setCategory(next.category);
    setSort(next.sort);
    setMax(next.max);
    const params = new URLSearchParams();
    if (next.query) params.set("q", next.query);
    if (next.category !== "All") params.set("category", next.category);
    if (next.sort !== "curated") params.set("sort", next.sort);
    if (next.max !== "all") params.set("max", next.max);
    const search = params.toString();
    const previousURL = location.href;
    // Replacing the URL keeps the current filters shareable without jumping
    // the page or adding a browser-history entry for every search keystroke.
    history.replaceState(
      history.state,
      "",
      `${location.pathname}${location.search}#/shop${search ? `?${search}` : ""}`,
    );
    if (location.href !== previousURL) {
      window.dispatchEvent(
        new HashChangeEvent("hashchange", {
          oldURL: previousURL,
          newURL: location.href,
        }),
      );
    }
  }
  const products = catalog
    .filter(
      (p) =>
        (category === "All" || p.category === category) &&
        `${p.name} ${p.category}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()) &&
        (max === "all" || p.price <= Number(max)),
    )
    .sort((a, b) =>
      sort === "low"
        ? a.price - b.price
        : sort === "high"
          ? b.price - a.price
          : sort === "name"
            ? a.name.localeCompare(b.name)
            : 0,
    );
  return (
    <div className="section-wrap page">
      <div className="page-intro">
        <p className="eyebrow">Skardu Organic</p>
        <h1>
          Shop the <em>collection.</em>
        </h1>
        <p>
          Dried apricots, whole almonds, apricot kernel oil and shilajit. Find
          your favourites by category or compare prices.
        </p>
      </div>
      <div className="shop-controls">
        <label className="search-field">
          <Icon name="search" />
          <input
            type="search"
            aria-label="Search products"
            placeholder="Search apricots, almonds, oils…"
            value={query}
            onChange={(e) => updateFilters({ query: e.target.value })}
          />
        </label>
        <label>
          Price
          <select
            value={max}
            onChange={(e) => updateFilters({ max: e.target.value })}
          >
            <option value="all">All prices</option>
            <option value="1500">Up to Rs. 1,500</option>
            <option value="2000">Up to Rs. 2,000</option>
          </select>
        </label>
        <label>
          Sort by
          <select
            value={sort}
            onChange={(e) => updateFilters({ sort: e.target.value })}
          >
            <option value="curated">Our selection</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
            <option value="name">Name: A–Z</option>
          </select>
        </label>
      </div>
      <div className="collection-toolbar">
        <div className="category-tabs" aria-label="Product categories">
          {categories.map((c) => (
            <button
              key={c}
              aria-pressed={category === c}
              onClick={() => updateFilters({ category: c })}
            >
              {c}
            </button>
          ))}
        </div>
        <p aria-live="polite">
          {products.length} {products.length === 1 ? "product" : "products"}
        </p>
      </div>
      {products.length ? (
        <div className="product-grid" key={`${category}-${sort}-${max}`}>
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No matches this time.</h2>
          <p>Try a different search or clear the filters.</p>
          <button
            className="button"
            onClick={() => {
              updateFilters({ query: "", category: "All", max: "all" });
            }}
          >
            Clear filters <Icon />
          </button>
        </div>
      )}
      <p className="sample-note">
        Sample catalog: prices, stock and specifications are unconfirmed.
        Live ordering is not yet available.
      </p>
    </div>
  );
}
export function ProductPage({
  id,
  onOpenCart,
}: {
  id: string;
  onOpenCart: () => void;
}) {
  const product = catalog.find((p) => p._id === id);
  const { add } = useCart();
  const [quantity, setQuantity] = useState(1),
    [zoom, setZoom] = useState(false);
  useEffect(() => {
    setQuantity(1);
    setZoom(false);
  }, [id]);
  if (!product)
    return (
      <div className="empty-state page">
        <h1>We couldn’t find that product.</h1>
        <p>This item may have been removed from the sample collection.</p>
        <a href="#/shop" className="button">
          Browse the collection <Icon />
        </a>
      </div>
    );
  const variants = catalog.filter((p) => p.family === product.family);
  return (
    <div className="section-wrap page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <a href="#/">Home</a>
        <span>/</span>
        <a href="#/shop">Collection</a>
        <span>/</span>
        <span>{product.shortName}</span>
      </nav>
      <div className="product-detail">
        <div>
          <button
            className={`detail-image ${product.tone} ${zoom ? "zoomed" : ""}`}
            onClick={() => setZoom(!zoom)}
            aria-label={zoom ? "Show full product image" : "Zoom product image"}
            aria-pressed={zoom}
          >
            <img
              src={product.image}
              alt={`${product.shortName} illustrative product presentation`}
              width="700"
              height="850"
            />
            <span>{zoom ? "− Zoom out" : "+ Inspect the details"}</span>
          </button>
          <div className="gallery-tabs" aria-label="Image view">
            <button aria-pressed={!zoom} onClick={() => setZoom(false)}>
              Full view
            </button>
            <button aria-pressed={zoom} onClick={() => setZoom(true)}>
              Detail view
            </button>
          </div>
        </div>
        <div className="detail-copy">
          <p className="eyebrow">{product.category}</p>
          <h1>{product.shortName}</h1>
          <p className="detail-note">{product.note}</p>
          <p className="detail-price">
            {money(product.price)} <small>PKR</small>
          </p>
          <p>{product.description}</p>
          <fieldset className="variants">
            <legend>Size</legend>
            {variants.map((p) => (
              <a
                className={id === p._id ? "selected" : ""}
                aria-current={id === p._id ? "true" : undefined}
                href={`#/product/${p._id}`}
                key={p._id}
              >
                {p.size}
              </a>
            ))}
          </fieldset>
          <p className="availability">
            Stock confirmation pending · Orders save as drafts
          </p>
          <div className="buy-row">
            <Quantity
              value={quantity}
              max={product.countInStock}
              onChange={setQuantity}
              label={product.shortName}
            />
            <button
              className="button"
              onClick={() => {
                add(product._id, quantity);
                onOpenCart();
              }}
            >
              Add to bag <Icon name="bag" />
            </button>
          </div>
          <div className="product-facts">
            <h3>Know what’s inside</h3>
            <p>{product.details}</p>
            <h3>Product imagery</h3>
            <p>Illustrative product image. Final packaging and appearance require approval.</p>
            <h3>Delivery & returns</h3>
            <p>
              Live ordering is not enabled. Delivery areas, costs and return
              terms will be published before launch.
            </p>
            <a className="text-link" href="#/shipping">
              Read delivery information <Icon />
            </a>
          </div>
        </div>
      </div>
      <section className="related">
        <div className="section-heading">
          <div>
            <p className="eyebrow">A few more good things</p>
            <h2>Keep exploring.</h2>
          </div>
        </div>
        <div className="product-grid">
          {catalog
            .filter((p) => p.family !== product.family)
            .slice(0, 3)
            .map((p) => (
              <ProductCard product={p} key={p._id} />
            ))}
        </div>
      </section>
    </div>
  );
}

export function CheckoutPage() {
  const { lines, total } = useCart();
  const [saved, setSaved] = useState<string | null>(null),
    [error, setError] = useState("");
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "").trim(),
      phone = String(form.get("phone") || "").trim(),
      address = String(form.get("address") || "").trim(),
      city = String(form.get("city") || "").trim();
    if (
      name.length < 2 ||
      address.length < 8 ||
      city.length < 2 ||
      phone.replace(/\D/g, "").length < 10
    ) {
      setError(
        "Please enter your name, a valid phone number, city and complete address.",
      );
      return;
    }
    const id = `DRAFT-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    try {
      localStorage.setItem(
        "skardu-order-draft",
        JSON.stringify({
          id,
          createdAt: new Date().toISOString(),
          status: "draft-only",
          customer: { name, phone, address, city, email: form.get("email") },
          items: lines.map((l) => ({
            id: l.product._id,
            name: l.product.name,
            quantity: l.quantity,
            samplePrice: l.product.price,
          })),
          sampleSubtotal: total,
        }),
      );
      setSaved(id);
    } catch {
      setError(
        "This browser cannot save a draft. Enable local storage and try again. Your bag has been kept.",
      );
    }
  }
  if (saved)
    return (
      <div className="section-wrap page receipt">
        <p className="eyebrow">Saved on this device</p>
        <h1>Your draft is ready.</h1>
        <p>
          Reference <strong>{saved}</strong>
        </p>
        <p>
          This is not an order confirmation. Nothing was sent to the store, no
          payment was taken, and no delivery has been arranged. Your bag is
          still saved.
        </p>
        <a className="button" href="#/shop">
          Continue exploring <Icon />
        </a>
        <button
          className="text-button"
          onClick={() => {
            localStorage.removeItem("skardu-order-draft");
            setSaved(null);
          }}
        >
          Delete this draft
        </button>
      </div>
    );
  if (!lines.length)
    return (
      <div className="empty-state page">
        <h1>Your bag is empty.</h1>
        <a className="button" href="#/shop">
          Explore the collection <Icon />
        </a>
      </div>
    );
  return (
    <div className="section-wrap page">
      <div className="page-intro">
        <p className="eyebrow">One step closer</p>
        <h1>Review your draft.</h1>
        <p>
          Ordering is not open yet. Save your details on this device for later.
        </p>
      </div>
      <div className="checkout-grid">
        <form onSubmit={submit} className="checkout-form">
          <h2>Your details</h2>
          <div className="form-grid">
            <label>
              Full name
              <input
                name="name"
                autoComplete="name"
                required
                minLength={2}
                maxLength={100}
              />
            </label>
            <label>
              Email
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={160}
              />
            </label>
            <label>
              Phone number
              <input
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                minLength={10}
                maxLength={20}
                placeholder="03XX XXXXXXX"
              />
            </label>
            <label>
              City
              <input
                name="city"
                autoComplete="address-level2"
                required
                minLength={2}
                maxLength={100}
              />
            </label>
            <label className="full">
              Street address
              <textarea
                name="address"
                autoComplete="street-address"
                required
                minLength={8}
                maxLength={400}
                rows={3}
              />
            </label>
          </div>
          <p className="form-note">
            Your draft contains personal details and is saved only in this
            browser. Avoid saving on a shared device. You can delete it on the
            confirmation screen or Privacy page.
          </p>
          {error && (
            <p role="alert" className="error">
              {error}
            </p>
          )}
          <button type="submit" className="button">
            Save order draft <Icon />
          </button>
        </form>
        <aside className="order-summary">
          <h2>In your bag</h2>
          {lines.map(({ product, quantity }) => (
            <div className="summary-line" key={product._id}>
              <img src={product.image} alt="" width="65" height="75" />
              <div>
                {product.shortName}
                <small>
                  {product.size} × {quantity}
                </small>
              </div>
              <strong>{money(product.price * quantity)}</strong>
            </div>
          ))}
          <div className="summary-total">
            <span>Sample subtotal</span>
            <strong>{money(total)}</strong>
          </div>
          <p>Shipping: to be confirmed</p>
          <small>
            Prices and availability require owner approval. Saving a draft does
            not reserve stock.
          </small>
        </aside>
      </div>
    </div>
  );
}
