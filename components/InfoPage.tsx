import React, { useState } from "react";
import { visual } from "../data/catalog";
import { Icon } from "./StoreUI";
import StoryPage from "./StoryPage";
const sources = [
  [
    "Gilgit-Baltistan Tourism Department",
    "https://e-tourism.visitgilgitbaltistan.gov.pk/districts/skardu",
  ],
  [
    "Aga Khan Trust for Culture: Shigar Fort",
    "https://the.akdn/en/publication/aga-khan-trust-culture-shigar-fort-residence-baltistan",
  ],
  [
    "FAO: Women in agriculture in Pakistan",
    "https://openknowledge.fao.org/3/a-i4330e.pdf",
  ],
];
export default function InfoPage({ page }: { page: string }) {
  const [deleted, setDeleted] = useState(false);
  if (page === "about") return <StoryPage />;
  if (page === "about" || page === "journal")
    return (
      <div className="section-wrap page info-page">
        <p className="eyebrow">
          {page === "journal"
            ? "The field journal / No. 01"
            : "Our story / A collection in the making"}
        </p>
        <h1>
          {page === "journal" ? (
            <>
              A season worth
              <br />
              <em>keeping.</em>
            </>
          ) : (
            <>
              Rooted in a place.
              <br />
              <em>Made for everyday.</em>
            </>
          )}
        </h1>
        <div className="info-editorial">
          <figure>
            <img
              src={visual("orchard")}
              alt="An illustrative apricot orchard inspired by Baltistan"
              width="1000"
              height="1250"
            />
            <figcaption>AI-generated orchard illustration</figcaption>
          </figure>
          <div>
            <p className="lead">
              Between the orchard and the mountains, a story takes shape.
            </p>
            <p>
              Skardu sits within the dramatic landscape of Baltistan. Its
              setting is the starting point for this store: a place of high
              valleys, orchards and a distinctive cultural heritage.
            </p>
            <h2>Keeping the harvest</h2>
            <p>
              Apricot drying and kernel processing are part of agriculture in
              Gilgit-Baltistan. FAO documents both sulphur drying and oil
              extraction in the region. Processing varies, so we will publish
              batch-specific details rather than assume every product follows
              the same method.
            </p>
            <h2>A living heritage</h2>
            <p>
              The Aga Khan Trust for Culture’s work at Shigar Fort highlights
              Balti heritage and refined woodcarving. Timber, stone and quiet
              geometric detail inform this site’s palette and composition.
            </p>
            <h2>Our next chapter</h2>
            <p>
              This is a working store preview. The owner still needs to confirm
              suppliers, inventory, pricing, packaging and business details.
              “Organic” is part of the supplied brand name; it is not a
              certification claim.
            </p>
            <p className="sample-note">
              Landscape and orchard images are AI-generated illustrations, not
              documentary photographs of suppliers.
            </p>
          </div>
        </div>
        <div className="source-list">
          <h2>Explore the sources</h2>
          {sources.map(([label, url]) => (
            <a href={url} target="_blank" rel="noreferrer" key={url}>
              {label}
              <Icon />
            </a>
          ))}
        </div>
        <a className="button" href="#/shop">
          Explore the collection <Icon />
        </a>
      </div>
    );
  const content: Record<
    string,
    { title: string; intro: string; sections: [string, string][] }
  > = {
    contact: {
      title: "Let’s keep in touch.",
      intro: "The store’s contact channels are being prepared.",
      sections: [
        [
          "Business contact",
          "An approved email address, phone number and business address have not been supplied. Contact information from the previous prototype has not been treated as verified.",
        ],
        [
          "Questions about the collection",
          "Product sourcing, ingredient details and availability will be published once confirmed. Orders and customer messages cannot currently be sent through this preview.",
        ],
      ],
    },
    shipping: {
      title: "The journey to your door.",
      intro: "Shipping & returns · Pre-launch information",
      sections: [
        [
          "Delivery areas and pricing",
          "Delivery coverage, courier partners, dispatch times and shipping charges are awaiting owner confirmation. No delivery promise is made in this preview.",
        ],
        [
          "Returns and damaged items",
          "The returns window, eligible products, refund process and reporting procedure must be approved before live ordering begins.",
        ],
        [
          "Order drafts",
          "A draft is saved only in your browser. It is not submitted, paid, confirmed or reserved. No shipping charge is included in the sample subtotal.",
        ],
      ],
    },
    privacy: {
      title: "Your details stay yours.",
      intro: "Privacy information for this store preview.",
      sections: [
        [
          "What this preview stores",
          "Your bag is stored in localStorage on this device. If you choose to save an order draft, your name, email, phone number, address and selected items are stored in this browser too.",
        ],
        [
          "What is sent",
          "This implementation has no order submission, advertising analytics or active account service. Fonts and images are hosted with the website; no external font service is contacted. Your draft is not sent to the store.",
        ],
        [
          "Your control",
          "Delete your draft below or clear site data in your browser. Drafts remain until you delete them. Avoid entering personal information on a shared device. A full business privacy policy must be approved before launch.",
        ],
      ],
    },
    terms: {
      title: "A few things to know.",
      intro: "Preview terms · Subject to owner approval before launch.",
      sections: [
        [
          "Catalog information",
          "Products, prices, availability and illustrations are sample material. They are not a confirmed offer for sale. Descriptions do not establish organic certification, laboratory testing or health benefits.",
        ],
        [
          "No live transactions",
          "This version does not accept payments or submit orders. Saving an order draft does not form a purchase contract.",
        ],
        [
          "Before the store opens",
          "The owner must approve business identity, policies, inventory, pricing and applicable customer rights information.",
        ],
      ],
    },
  };
  const info = content[page];
  if (!info)
    return (
      <div className="section-wrap page receipt">
        <p className="eyebrow">Page not found</p>
        <h1>A little off the path.</h1>
        <p>The page you’re looking for isn’t here.</p>
        <a className="button" href="#/">
          Back to the beginning <Icon />
        </a>
      </div>
    );
  return (
    <div className="section-wrap page policy-page">
      <p className="eyebrow">Skardu Organic / Information</p>
      <h1>{info.title}</h1>
      <p className="lead">{info.intro}</p>
      {info.sections.map(([title, body]) => (
        <section key={title}>
          <h2>{title}</h2>
          <p>{body}</p>
        </section>
      ))}
      {page === "privacy" && (
        <>
          <button
            className="button"
            onClick={() => {
              localStorage.removeItem("skardu-order-draft");
              setDeleted(true);
            }}
          >
            Delete saved order draft <Icon name="close" />
          </button>
          {deleted && (
            <p role="status">
              The saved draft has been removed from this browser.
            </p>
          )}
        </>
      )}
      <a className="text-link" href="#/shop">
        Back to the collection <Icon />
      </a>
    </div>
  );
}
