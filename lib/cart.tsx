import React, { createContext, useContext, useEffect, useState } from "react";
import { catalog, StoreProduct } from "../data/catalog";
export type CartLine = { product: StoreProduct; quantity: number };
export const CART_KEY = "skardu-cart-v2";
export function normalizeCart(
  raw: unknown,
): { id: string; quantity: number }[] {
  if (!Array.isArray(raw)) return [];
  const result = new Map<string, number>();
  for (const row of raw) {
    const product = catalog.find((p) => p._id === row?.id);
    if (!product || !Number.isFinite(row.quantity) || row.quantity < 1)
      continue;
    result.set(
      row.id,
      Math.min(
        product.countInStock,
        (result.get(row.id) || 0) + Math.floor(row.quantity),
      ),
    );
  }
  return [...result].map(([id, quantity]) => ({ id, quantity }));
}
type CartState = {
  lines: CartLine[];
  count: number;
  total: number;
  notice: string;
  add: (id: string, quantity?: number) => void;
  update: (id: string, quantity: number) => void;
  clear: () => void;
};
const CartContext = createContext<CartState | null>(null);
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState(() => {
    try {
      return normalizeCart(JSON.parse(localStorage.getItem(CART_KEY) || "[]"));
    } catch {
      return [];
    }
  });
  const [notice, setNotice] = useState("");
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {
      setNotice(
        "Device storage is unavailable. Your bag will last for this visit only.",
      );
    }
  }, [items]);
  useEffect(() => {
    const sync = (e: StorageEvent) => {
      if (e.key === CART_KEY) {
        try {
          setItems(normalizeCart(JSON.parse(e.newValue || "[]")));
        } catch {}
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  const lines = items.map((item) => ({
    product: catalog.find((p) => p._id === item.id)!,
    quantity: item.quantity,
  }));
  const add = (id: string, quantity = 1) => {
    const product = catalog.find((p) => p._id === id);
    if (!product || !Number.isInteger(quantity) || quantity < 1) return;
    setItems((prev) => normalizeCart([...prev, { id, quantity }]));
    setNotice(
      `${product.shortName} added to your bag. Quantities are limited to sample stock.`,
    );
  };
  const update = (id: string, quantity: number) =>
    setItems((prev) =>
      normalizeCart(prev.map((p) => (p.id === id ? { id, quantity } : p))),
    );
  return (
    <CartContext.Provider
      value={{
        lines,
        add,
        update,
        clear: () => setItems([]),
        notice,
        count: lines.reduce((n, l) => n + l.quantity, 0),
        total: lines.reduce((n, l) => n + l.quantity * l.product.price, 0),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
export const useCart = () => useContext(CartContext)!;
