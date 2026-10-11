import React, { useEffect, useRef } from "react";
import { StoreProduct, money } from "../data/catalog";
import { useCart } from "../lib/cart";

export function Icon({
  name = "arrow",
  ...props
}: {
  name?: string;
  className?: string;
}) {
  const paths: Record<string, React.ReactNode> = {
    arrow: (
      <>
        <path d="M4 12h15M13 5l7 7-7 7" />
      </>
    ),
    bag: (
      <>
        <path d="M5 7h14l1 14H4L5 7Z" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      </>
    ),
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 5 5" />
      </>
    ),
    close: <path d="m6 6 12 12M6 18 18 6" />,
    menu: <path d="M4 7h16M4 16h16" />,
    plus: <path d="M5 12h14M12 5v14" />,
    minus: <path d="M5 12h14" />,
    leaf: (
      <>
        <path d="M20 3C8 2 2 7 5 15c7 5 15 0 15-12Z" />
        <path d="M3 21 15 9" />
      </>
    ),
    mountain: (
      <>
        <path d="m2 20 8-15 5 8 3-5 5 12H2Z" />
        <path d="m7 11 3 2 3-3" />
      </>
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 1v3M12 20v3M1 12h3M20 12h3M4 4l2 2M18 18l2 2M4 20l2-2M18 6l2-2" />
      </>
    ),
  };
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name] || paths.arrow}
    </svg>
  );
}
export function Logo() {
  return (
    <a
      className="logo official-logo"
      href="#/"
      aria-label="Skardu Organic home"
    >
      <img
        src={import.meta.env.BASE_URL + "brand/official-logo.png"}
        alt="Skardu Organic — Pure. Fresh. Natural."
        width="1000"
        height="337"
      />
    </a>
  );
}
export function ProductCard({ product }: { product: StoreProduct }) {
  const { add } = useCart();
  return (
    <article className={`product-card ${product.tone}`}>
      <a className="product-photo" href={`#/product/${product._id}`}>
        <span className="product-category">{product.category}</span>
        <img
          src={product.image}
          alt={`${product.shortName} — illustrative product image`}
          loading="lazy"
          width="700"
          height="700"
        />
        <span className="photo-link">
          <Icon />
        </span>
      </a>
      <div className="product-meta">
        <div>
          <a href={`#/product/${product._id}`}>
            <h3>{product.shortName}</h3>
          </a>
          <span>
            {product.size} <i>·</i> Sample selection
          </span>
        </div>
        <button
          className="add-small"
          onClick={() => add(product._id)}
          aria-label={`Add ${product.shortName} ${product.size} to bag`}
        >
          <Icon name="plus" />
        </button>
      </div>
      <p className="price">
        {money(product.price)} <span>PKR</span>
      </p>
    </article>
  );
}
export function Quantity({
  value,
  max,
  onChange,
  label,
}: {
  value: number;
  max: number;
  onChange: (n: number) => void;
  label: string;
}) {
  return (
    <div className="quantity">
      <button
        type="button"
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
        aria-label={`Decrease ${label}`}
      >
        <Icon name="minus" />
      </button>
      <output aria-label={`${label} quantity`}>{value}</output>
      <button
        type="button"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        aria-label={`Increase ${label}`}
      >
        <Icon name="plus" />
      </button>
    </div>
  );
}
export function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { lines, total, count, update } = useCart();
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current!;
    if (open) {
      d.showModal();
      document.body.style.overflow = "hidden";
    } else {
      d.close();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  return (
    <dialog
      ref={ref}
      className="cart-dialog"
      aria-labelledby="bag-title"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="cart-inner">
        <header>
          <div>
            <p className="eyebrow">A little closer to the mountains</p>
            <h2 id="bag-title">
              Your bag <sup>({count})</sup>
            </h2>
          </div>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Close bag"
          >
            <Icon name="close" />
          </button>
        </header>
        {lines.length ? (
          <>
            <div className="cart-items">
              {lines.map(({ product, quantity }) => (
                <article className="cart-line" key={product._id}>
                  <img
                    src={product.image}
                    alt={product.shortName}
                    width="96"
                    height="110"
                  />
                  <div>
                    <a onClick={onClose} href={`#/product/${product._id}`}>
                      {product.shortName}
                    </a>
                    <p>
                      {product.size} · {money(product.price)}
                    </p>
                    <Quantity
                      value={quantity}
                      max={product.countInStock}
                      onChange={(n) => update(product._id, n)}
                      label={product.shortName}
                    />
                    <button
                      className="text-button remove"
                      onClick={() => update(product._id, 0)}
                    >
                      Remove {product.shortName}
                    </button>
                  </div>
                  <strong>{money(product.price * quantity)}</strong>
                </article>
              ))}
            </div>
            <div className="cart-bottom">
              <p>
                <span>Subtotal</span>
                <strong>{money(total)}</strong>
              </p>
              <small>
                Sample prices. Shipping is not calculated. Ordering is not yet
                enabled.
              </small>
              <a className="button" href="#/checkout" onClick={onClose}>
                Review order draft <Icon />
              </a>
              <button className="text-button" onClick={onClose}>
                Continue exploring
              </button>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <Icon name="bag" />
            <h3>A little room for good things.</h3>
            <p>
              Your bag is empty. Discover the collection and find something you
              love.
            </p>
            <a className="button" href="#/shop" onClick={onClose}>
              Explore the collection <Icon />
            </a>
          </div>
        )}
      </div>
    </dialog>
  );
}
