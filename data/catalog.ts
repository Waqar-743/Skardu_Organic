import type { Product } from "../types";

export interface StoreProduct extends Product {
  shortName: string;
  size: string;
  note: string;
  family: string;
  tone: string;
  details: string;
}
const image = (name: string) =>
  `${import.meta.env.BASE_URL}images/${name}.webp`;
// Existing product IDs/prices retained as SAMPLE data, pending owner verification.
// No invented customer reviews, certification, origin or efficacy assertions.
export const catalog: StoreProduct[] = [
  {
    _id: "3",
    name: "Dried Apricots (500g)",
    shortName: "Dried apricots",
    size: "500 g",
    category: "Dry fruits",
    family: "apricots",
    image: image("apricots"),
    price: 950,
    countInStock: 50,
    tone: "peach",
    note: "A little taste of summer.",
    description:
      "Soft, golden dried apricots for a pantry worth lingering over. Enjoy on their own, with breakfast, or folded into a favourite bake.",
    details:
      "Sample selection. Harvest location, drying method, ingredients, sulphite content and shelf life must be confirmed by the supplier.",
  },
  {
    _id: "2",
    name: "Apricot Kernel Oil (120ml)",
    shortName: "Apricot kernel oil",
    size: "120 ml",
    category: "Oils",
    family: "oil",
    image: image("apricot-oil-official"),
    price: 1200,
    countInStock: 30,
    tone: "sand",
    note: "The other side of the apricot.",
    description:
      "A golden oil inspired by the apricot-growing traditions of Baltistan. Explore the quiet beauty of a familiar fruit, beyond its flesh.",
    details:
      "Concept packaging. Extraction method, ingredient specification and intended cosmetic or culinary use require confirmation. No directions for consumption are supplied.",
  },
  {
    _id: "5",
    name: "Almonds (500g)",
    shortName: "Whole almonds",
    size: "500 g",
    category: "Dry fruits",
    family: "almonds",
    image: image("almonds"),
    price: 1800,
    countInStock: 40,
    tone: "sage",
    note: "Simple things, thoughtfully chosen.",
    description:
      "A classic pantry ingredient for sharing, baking and everyday snacking. This sample listing carries the original store’s proposed 500 g size.",
    details:
      "Contains tree nuts. Cultivar, origin, processing, cross-contact information and packaging require supplier approval.",
  },
  {
    _id: "1",
    name: "Shilajit Resin (20g)",
    shortName: "Shilajit resin",
    size: "20 g",
    category: "Shilajit",
    family: "shilajit",
    image: image("shilajit"),
    price: 2999,
    countInStock: 15,
    tone: "stone",
    note: "From the original collection.",
    description:
      "A resin product retained from the original store catalog. Shown here as a sample while sourcing, composition and quality documentation are reviewed.",
    details:
      "This is not a verified supplement listing. No purity, laboratory testing, medical benefit or usage claim is made. Supplier evidence is required before sale.",
  },
  {
    _id: "1b",
    name: "Shilajit Resin (10g)",
    shortName: "Shilajit resin",
    size: "10 g",
    category: "Shilajit",
    family: "shilajit",
    image: image("shilajit-small"),
    price: 1900,
    countInStock: 20,
    tone: "stone",
    note: "A smaller sample size.",
    description:
      "The smaller resin size from the original catalog, included for comparing product options. Availability and specifications remain unverified.",
    details:
      "Sample only. Supplier evidence, ingredient specification, testing and approved labeling are required before sale.",
  },
].map((p) => ({
  ...p,
  brand: "Skardu Organic",
  rating: 0,
  numReviews: 0,
  reviews: [],
}));

export const money = (value: number) => `Rs. ${value.toLocaleString("en-PK")}`;
export const categories = ["All", "Dry fruits", "Oils", "Shilajit"];
export const visual = image;
