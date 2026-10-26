import { catalog, visual } from "../data/catalog";
import { Icon, ProductCard } from "./StoreUI";
import HeroBackground from "./HeroBackground";

const selection = catalog.filter((product) => product._id !== "1b");
const collections = [
  { name: "Dried fruits", copy: "Apricots & whole almonds", image: "apricots", href: "#/shop?category=Dry%20fruits", tone: "peach" },
  { name: "Apricot kernel oil", copy: "Discover a different side of the fruit", image: "apricot-oil-official", href: "#/shop?category=Oils", tone: "sand" },
  { name: "Shilajit", copy: "Explore both resin sizes", image: "shilajit", href: "#/shop?category=Shilajit", tone: "stone" },
];

export default function HomePage() {
  return (
    <div className="store-home">
      <section className="hero commerce-hero" aria-labelledby="hero-title">
        <div className="hero-media"><HeroBackground /><div className="hero-shade" /></div>
        <div className="section-wrap commerce-hero-content">
          <p className="commerce-eyebrow">Skardu Organic · The pantry collection</p>
          <h1 id="hero-title">Good things,<br /><em>from the mountains.</em></h1>
          <p>Dried apricots, whole almonds and apricot kernel oil. A little inspiration from Baltistan, for your everyday.</p>
          <div className="commerce-hero-actions">
            <a className="button button-cream" href="#/shop">Shop the collection <Icon /></a>
            <a className="commerce-hero-link" href="#/shop?category=Dry%20fruits">Shop dried fruits <Icon /></a>
          </div>
        </div>
      </section>
      <div className="store-benefits" aria-label="Shopping information">
        <div className="section-wrap store-benefits-inner">
          <p><Icon name="leaf" /><span>Dried fruits, oils & more</span></p>
          <p><Icon name="bag" /><span>Choose your size. Build your bag.</span></p>
          <p><Icon name="mountain" /><span>Inspired by Baltistan</span></p>
        </div>
      </div>
      <section className="section-wrap home-products" aria-labelledby="collection-title">
        <div className="store-section-head">
          <div><p className="store-kicker">Find your favourites</p><h2 id="collection-title">The everyday collection</h2></div>
          <a className="store-link" href="#/shop">Shop all products <Icon /></a>
        </div>
        <div className="product-grid home-product-grid">
          {selection.map((product) => <ProductCard key={product._id} product={product} />)}
        </div>
      </section>
      <section className="section-wrap home-collections" aria-labelledby="categories-title">
        <div className="store-section-head"><div><p className="store-kicker">A place for every favourite</p><h2 id="categories-title">Shop by collection</h2></div></div>
        <div className="collection-tiles">
          {collections.map((collection) => <a className={`collection-tile ${collection.tone}`} href={collection.href} key={collection.name}>
            <div><h3>{collection.name}</h3><p>{collection.copy}</p><span>Explore collection <Icon /></span></div>
            <img src={visual(collection.image)} alt="" width="700" height="700" loading="lazy" />
          </a>)}
        </div>
      </section>
      <section className="section-wrap home-story-teaser" aria-labelledby="home-story-title">
        <div className="home-story-image"><img src={visual("orchard")} alt="Illustrative apricot orchard inspired by Baltistan" width="1000" height="1250" loading="lazy" /></div>
        <div className="home-story-copy"><p className="store-kicker">The place behind the pantry</p><h2 id="home-story-title">Rooted in a place.<br /><em>Made for everyday.</em></h2><p>Mountain orchards, a harvest kept for another season, and the quiet rituals around food. Discover the inspiration behind Skardu Organic.</p><a className="store-link" href="#/about">Read our story <Icon /></a></div>
      </section>
    </div>
  );
}
