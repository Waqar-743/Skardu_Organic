import React from "react";
import { catalog, visual } from "../data/catalog";
import { Icon } from "./StoreUI";
import "./StoryPage.css";

const sources = {
  place: "https://e-tourism.visitgilgitbaltistan.gov.pk/districts/skardu",
  heritage:
    "https://the.akdn/en/publication/aga-khan-trust-culture-shigar-fort-residence-baltistan",
  harvest: "https://openknowledge.fao.org/3/a-i4330e.pdf",
};

const families = catalog.filter((product) => product._id !== "1b");

export default function StoryPage() {
  return (
    <div className="brand-story">
      <section className="section-wrap brand-story-intro" aria-labelledby="brand-story-title">
        <div className="brand-story-intro-copy">
          <p className="eyebrow">Our story / Skardu Organic</p>
          <h1 id="brand-story-title">
            A little closer<br />
            to <em>the source.</em>
          </h1>
          <p className="brand-story-lead">
            From mountain orchards to everyday rituals — dried apricots,
            golden kernel oil and the quiet treasures of Skardu.
          </p>
          <a className="button" href="#/shop">
            Explore the collection <Icon />
          </a>
        </div>
        <figure className="brand-story-intro-image">
          <img
            src={visual("mountains")}
            alt="An illustrative mountain valley and winding river inspired by Baltistan"
            width="1672"
            height="941"
            fetchPriority="high"
          />
          <figcaption>Inspired by the high valleys of Baltistan</figcaption>
        </figure>
      </section>

      <section className="section-wrap brand-story-belief" aria-labelledby="brand-story-belief-title">
        <p className="eyebrow">Why we’re here</p>
        <div>
          <h2 id="brand-story-belief-title">
            We keep things the way the mountains do — <em>slow, seasonal and honest.</em>
          </h2>
          <p>
            That is the idea behind Skardu Organic: a pantry inspired by apricot
            orchards, kernel presses and high-valley harvests. A familiar ingredient
            can hold a sense of place, whether it becomes a quiet morning ritual or
            something shared around the table.
          </p>
        </div>
      </section>

      <section className="brand-story-harvest" aria-labelledby="brand-story-harvest-title">
        <div className="section-wrap brand-story-harvest-inner">
          <div className="brand-story-harvest-heading">
            <p className="eyebrow">The heart of the apricot</p>
            <h2 id="brand-story-harvest-title">One fruit.<br /><em>A whole new story.</em></h2>
            <p>Follow the quiet journey from orchard to oil.</p>
          </div>
          <figure className="brand-story-oil">
            <img
              src={visual("apricot-oil-official")}
              alt="Apricot kernel oil packaging concept with the official Skardu Organic logo"
              width="700"
              height="1050"
              loading="lazy"
            />
            <figcaption>Apricot kernel oil · Our original mark</figcaption>
          </figure>
          <ol className="brand-story-process">
            <li>
              <span className="brand-story-number" aria-hidden="true">01</span>
              <div>
                <h3>It begins with a season.</h3>
                <p>
                  Apricot trees have a place in the agricultural life of
                  Gilgit-Baltistan. Their harvest gives way to a longer story
                  of drying, keeping and making.
                </p>
              </div>
            </li>
            <li>
              <span className="brand-story-number" aria-hidden="true">02</span>
              <div>
                <h3>A small detail. A golden possibility.</h3>
                <p>
                  Inside the stone is the kernel. FAO describes how kernels
                  in the region are separated from their shells and used for
                  oil extraction, among other uses.
                </p>
                <a className="brand-story-source" href={sources.harvest} target="_blank" rel="noreferrer">
                  Read the regional context at FAO <Icon />
                </a>
              </div>
            </li>
            <li>
              <span className="brand-story-number" aria-hidden="true">03</span>
              <div>
                <h3>Something simple. Something to discover.</h3>
                <p>
                  Our apricot-oil packaging carries the original Skardu Organic
                  mark. Its final specification, extraction method and intended
                  use remain subject to supplier confirmation.
                </p>
                <a className="text-link" href="#/product/2">Discover the oil <Icon /></a>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <section className="section-wrap brand-story-place" aria-labelledby="brand-story-place-title">
        <figure className="brand-story-orchard">
          <img
            src={visual("orchard")}
            alt="An illustrative apricot orchard with a stone terrace and mountains"
            width="1000"
            height="1250"
            loading="lazy"
          />
          <figcaption>A sense of place · Orchard illustration</figcaption>
        </figure>
        <div className="brand-story-place-copy">
          <p className="eyebrow">The place behind the pantry</p>
          <h2 id="brand-story-place-title">High mountains.<br /><em>Deep roots.</em></h2>
          <p className="brand-story-lead">A landscape can shape the way we eat.</p>
          <p>
            In Baltistan, orchards meet the mountains. Apricots are harvested,
            dried and kept beyond their season. Kernels find another life as oil.
            Nothing about this story needs to be hurried.
          </p>
          <p>
            Skardu Organic takes its inspiration from that relationship between
            place, food and everyday life. The valleys, rivers and mountain
            setting of Skardu are the starting point for our visual language.
          </p>
          <a className="brand-story-source" href={sources.place} target="_blank" rel="noreferrer">
            Discover Skardu with Gilgit-Baltistan Tourism <Icon />
          </a>
          <div className="brand-story-heritage">
            <p className="eyebrow">People &amp; place</p>
            <h3>Traditions are kept in the everyday.</h3>
            <p>
              In carved timber, orchard walls and a harvest put aside for
              winter. Shigar Fort’s collection of Balti heritage and woodcarving
              is one reference for the warm materials and quiet details of this
              store.
            </p>
            <a className="brand-story-source" href={sources.heritage} target="_blank" rel="noreferrer">
              Explore Shigar Fort with the Aga Khan Trust for Culture <Icon />
            </a>
          </div>
        </div>
      </section>

      <section className="section-wrap brand-story-families" aria-labelledby="brand-story-families-title">
        <div className="brand-story-section-head">
          <div>
            <p className="eyebrow">The pantry shelves</p>
            <h2 id="brand-story-families-title">Good things, from up here.</h2>
          </div>
          <a className="text-link" href="#/shop">Shop the collection <Icon /></a>
        </div>
        <div className="brand-story-family-grid">
          {families.map((product) => (
            <a className="brand-story-family" href={`#/product/${product._id}`} key={product._id}>
              <img
                src={product.image}
                alt={`${product.shortName} packaging illustration with the Skardu Organic logo`}
                width="700"
                height="700"
                loading="lazy"
              />
              <span><strong>{product.shortName}</strong><Icon /></span>
            </a>
          ))}
        </div>
      </section>

      <section className="section-wrap brand-story-shopping" aria-labelledby="brand-story-shopping-title">
        <div>
          <p className="eyebrow">How it works</p>
          <h2 id="brand-story-shopping-title">A thoughtful journey,<br /><em>every step of the way.</em></h2>
        </div>
        <ol>
          <li>
            <span className="brand-story-number" aria-hidden="true">01</span>
            <div><h3>Find your favourites</h3><p>Explore the collection and compare product details, sizes and listed prices.</p></div>
          </li>
          <li>
            <span className="brand-story-number" aria-hidden="true">02</span>
            <div><h3>Make it your own</h3><p>Build your bag. Your selection stays saved on this device.</p></div>
          </li>
          <li>
            <span className="brand-story-number" aria-hidden="true">03</span>
            <div><h3>Save for what’s next</h3><p>Review and save an order draft. Payments and live order submission are not enabled yet.</p></div>
          </li>
        </ol>
      </section>

      <aside className="section-wrap brand-story-notes" aria-labelledby="brand-story-notes-title">
        <h2 id="brand-story-notes-title">A clear picture.</h2>
        <div>
          <p>
            The landscapes, orchard scenes and product images are AI-generated
            illustrations, not photographs of verified suppliers. Regional
            references describe our inspiration; they do not establish the origin
            or processing of an individual item.
          </p>
          <p>
            Supplier details, product specifications, prices and availability
            still need final confirmation. “Organic” is our supplied brand name;
            it is not a certification claim. An order draft stays in your browser
            and does not reserve or submit an order.
          </p>
        </div>
      </aside>

      <section className="brand-story-closing" aria-labelledby="brand-story-closing-title">
        <div className="section-wrap">
          <p className="eyebrow">Bring a little of the mountains home</p>
          <h2 id="brand-story-closing-title">Small treasures.<br /><em>A world of their own.</em></h2>
          <p>
            Dried apricots, golden kernel oil, mountain almonds and shilajit resin —
            the starting points of our collection, inspired by Baltistan.
          </p>
          <a className="button" href="#/shop">Find your favourites <Icon /></a>
        </div>
      </section>
    </div>
  );
}
