import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { catalog, money, visual } from "../data/catalog";
import { useCart } from "../lib/cart";
import { Icon } from "./StoreUI";

gsap.registerPlugin(ScrollTrigger, SplitText);

const SHELVES = catalog.filter((p) => p._id !== "1b");

export default function HomePage() {
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLElement>(null);
  const { add } = useCart();

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    /* Reduced-motion users get native rendering only — no smoother, no scrub */
    mm.add(
      "(min-width: 900px) and (prefers-reduced-motion: no-preference)",
      () => {
        const splits: SplitText[] = [];
        const ctx = gsap.context(() => {
          /* Chapter 02 — pinned horizontal pantry */
          const track = root.current!.querySelector<HTMLElement>(".htrack")!;
          const distance = () =>
            Math.max(0, track.scrollWidth - window.innerWidth);
          const total = SHELVES.length + 1; /* cards + closing panel */
          gsap.to(track, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: ".hsec",
              start: "top top",
              end: () => "+=" + distance(),
              pin: true,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                if (counter.current) {
                  const i =
                    Math.round(self.progress * (total - 1)) + 1;
                  counter.current.textContent = String(
                    Math.min(total, Math.max(1, i)),
                  ).padStart(2, "0");
                }
              },
            },
          });
          gsap.fromTo(
            ".hprogress i",
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: "none",
              scrollTrigger: {
                trigger: ".hsec",
                start: "top top",
                end: () => "+=" + distance(),
                scrub: true,
              },
            },
          );

          /* Chapter 03 — sticky apricot visual, scroll-scrubbed */
          gsap
            .timeline({
              scrollTrigger: {
                trigger: ".story-grid",
                start: "top top+=140",
                end: "bottom bottom-=120",
                scrub: 0.6,
              },
            })
            .fromTo(
              ".story-bottle",
              { rotation: -4, scale: 0.94, y: 24 },
              { rotation: 3, scale: 1.05, y: -18, duration: 1.2, ease: "none" },
            )
            .to(".story-bottle", {
              rotation: 0,
              scale: 0.98,
              y: 0,
              duration: 1,
              ease: "none",
            });
          gsap.fromTo(
            ".story-fill",
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: {
                trigger: ".story-grid",
                start: "top center",
                end: "bottom center",
                scrub: true,
              },
            },
          );
          gsap.utils
            .toArray<HTMLElement>(".story-step", root.current!)
            .forEach((step) => {
              ScrollTrigger.create({
                trigger: step,
                start: "top 62%",
                end: "bottom 34%",
                onToggle: (self) =>
                  step.classList.toggle("is-live", self.isActive),
              });
            });

          /* Chapter 04 — orchard uncover (clip-path) + drifting word */
          gsap.fromTo(
            ".orchard-media",
            { clipPath: "inset(10% 14% 28% 14% round 34px)" },
            {
              clipPath: "inset(0% 0% 0% 0% round 0px)",
              ease: "none",
              scrollTrigger: {
                trigger: ".orchard-media",
                start: "top 86%",
                end: "top 12%",
                scrub: 0.6,
              },
            },
          );
          gsap.fromTo(
            ".orchard-media img",
            { scale: 1.2, yPercent: -4 },
            {
              scale: 1,
              yPercent: 3,
              ease: "none",
              scrollTrigger: {
                trigger: ".orchard",
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
          gsap.fromTo(
            ".orchard-word",
            { x: "-56%" },
            {
              x: "-44%",
              ease: "none",
              scrollTrigger: {
                trigger: ".orchard",
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );

          /* magnetic button */
          gsap.utils
            .toArray<HTMLElement>(".magnetic", root.current!)
            .forEach((el) => {
              const xTo = gsap.quickTo(el, "x", {
                  duration: 0.45,
                  ease: "power3",
                }),
                yTo = gsap.quickTo(el, "y", {
                  duration: 0.45,
                  ease: "power3",
                });
              const move = (e: MouseEvent) => {
                const r = el.getBoundingClientRect();
                xTo((e.clientX - r.left - r.width / 2) * 0.32);
                yTo((e.clientY - r.top - r.height / 2) * 0.32);
              };
              const leave = () => {
                xTo(0);
                yTo(0);
              };
              el.addEventListener("mousemove", move);
              el.addEventListener("mouseleave", leave);
              return () => {
                el.removeEventListener("mousemove", move);
                el.removeEventListener("mouseleave", leave);
              };
            });
        }, root);
        return () => {
          ctx.revert();
          splits.forEach((s) => s.revert());
        };
      },
    );

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const splits: SplitText[] = [];
      const ctx = gsap.context(() => {
        /* hero entrance */
        const heroSplit = new SplitText(".hero-title", {
          type: "lines",
          mask: "lines",
        });
        splits.push(heroSplit);
        gsap.from(heroSplit.lines, {
          yPercent: 115,
          duration: 1.25,
          stagger: 0.1,
          ease: "power4.out",
          delay: 0.15,
        });
        gsap.from("[data-hero-fade]", {
          y: 26,
          opacity: 0,
          duration: 0.9,
          stagger: 0.12,
          delay: 0.55,
          ease: "power3.out",
          clearProps: "all",
        });
        gsap.from(".hero-media img", {
          scale: 1.08,
          duration: 1.8,
          ease: "power2.out",
        });

        /* hero exits with slight parallax as you scroll away */
        gsap.to(".hero-inner", {
          yPercent: -14,
          opacity: 0.25,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom 20%",
            scrub: 0.5,
          },
        });
        gsap.to(".hero-media img", {
          scale: 1.12,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 0.5,
          },
        });

        /* chapter 01 — statement words light up with the scroll */
        const statement = new SplitText(".statement-title", {
          type: "words",
        });
        splits.push(statement);
        gsap.fromTo(
          statement.words,
          { opacity: 0.13 },
          {
            opacity: 1,
            stagger: 0.06,
            ease: "none",
            scrollTrigger: {
              trigger: ".statement",
              start: "top 72%",
              end: "top 18%",
              scrub: true,
            },
          },
        );

        /* closing chapter title reveal */
        const closing = new SplitText(".closing-title", {
          type: "lines",
          mask: "lines",
        });
        splits.push(closing);
        gsap.from(closing.lines, {
          yPercent: 115,
          duration: 1.1,
          stagger: 0.1,
          ease: "power4.out",
          scrollTrigger: { trigger: ".closing", start: "top 62%" },
        });

        /* generic up-reveals */
        gsap.utils
          .toArray<HTMLElement>("[data-reveal]", root.current!)
          .forEach((el) => {
            gsap.from(el, {
              y: 32,
              opacity: 0,
              duration: 0.95,
              ease: "power3.out",
              clearProps: "all",
              scrollTrigger: { trigger: el, start: "top 88%" },
            });
          });

        /* masked line reveals for chapter headings */
        gsap.utils
          .toArray<HTMLElement>("[data-lines]", root.current!)
          .forEach((el) => {
            const s = new SplitText(el, { type: "lines", mask: "lines" });
            splits.push(s);
            gsap.from(s.lines, {
              yPercent: 115,
              duration: 1,
              stagger: 0.08,
              ease: "power4.out",
              scrollTrigger: { trigger: el, start: "top 85%" },
            });
          });
      }, root);
      return () => {
        ctx.revert();
        splits.forEach((s) => s.revert());
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={root}>
      {/* — 00 · Hero —*/}
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-media">
          <picture>
            <source
              media="(max-width: 700px)"
              srcSet={visual("mountains-mobile")}
            />
            <img
              src={visual("mountains")}
              alt="Illustrative mountain valley and winding river inspired by Baltistan"
              width="1672"
              height="941"
            />
          </picture>
          <div className="hero-shade" />
        </div>
        <div className="hero-inner section-wrap">
          <p className="hero-eyebrow" data-hero-fade>
            Rooted in Baltistan — inspired by nature
          </p>
          <h1 id="hero-title" className="hero-title">
            A little closer <br />
            to <em>the source.</em>
          </h1>
          <p className="hero-copy" data-hero-fade>
            From mountain orchards to everyday rituals — dried apricots,
            golden kernel oil and the quiet treasures of Skardu.
          </p>
          <div className="hero-cta" data-hero-fade>
            <a className="button button-cream" href="#/shop">
              Explore the collection <Icon />
            </a>
            <a className="hero-quiet-link" href="#/about">
              Read our story
            </a>
          </div>
        </div>
        <div className="hero-foot">
          <a href="#/about">Skardu · Gilgit-Baltistan ↗</a>
          <span className="hero-scrollcue">
            <i aria-hidden="true" /> Scroll — the slow way
          </span>
          <small>2,228 m above sea level</small>
        </div>
      </section>

      {/* — Marquee —*/}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <span key={copy}>
              {[
                "A collection in the making",
                "From the orchards of Baltistan",
                "Dried apricots · Kernel oil · Almonds",
                "Small batches, slow seasons",
                "Inspired by the high valleys",
              ].map((item) => (
                <React.Fragment key={item}>
                  {item}
                  <i>✳</i>
                </React.Fragment>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* — 01 · Why we're here —*/}
      <section
        className="chapter chapter-dark statement"
        aria-labelledby="statement-title"
      >
        <div className="section-wrap statement-grid">
          <p className="eyebrow" data-reveal>
            Ch. 01 — Why we’re here
          </p>
          <h2 className="statement-title" id="statement-title">
            We keep things the way the mountains do — <em>slow, seasonal and
            honest.</em>
          </h2>
          <div className="statement-foot">
            <p data-reveal>
              Skardu Organic is a store in preview: a pantry drawn from
              apricot orchards, kernel presses and high-valley harvests.
              Nothing hurried, everything accounted for — the way food made
              at altitude tends to be.
            </p>
            <figure className="statement-visual" data-speed="0.92">
              <img
                src={visual("orchard")}
                alt="Illustrative apricot orchard with a stone terrace and mountains"
                width="1000"
                height="1250"
                loading="lazy"
              />
            </figure>
            <p className="statement-coords" aria-hidden="true">
              Ch. 01 / 07
              <br />
              35.2971° N — 75.6333° E
              <br />
              Skardu · Baltistan
            </p>
          </div>
        </div>
      </section>

      {/* — 02 · The pantry shelves (pinned horizontal scroll) —*/}
      <section className="chapter hsec" aria-label="The pantry shelves">
        <div className="hviewport">
          <div className="htrack">
            <div className="hpanel hpanel-intro">
              <p className="eyebrow">Ch. 02 — The pantry shelves</p>
              <h2>
                Good things,
                <br />
                from up here.
              </h2>
              <p>
                Four sample goods from the first Skardu Organic shelf. Slide
                through them, then step inside for sizes and detail.
              </p>
            </div>
            {SHELVES.map((p, i) => (
              <article
                className={`hpanel hpanel-card hpanel-tint-${p.tone}`}
                key={p._id}
              >
                <a
                  className="hpanel-photo"
                  href={`#/product/${p._id}`}
                  aria-label={`View ${p.shortName}`}
                >
                  <span className="hpanel-tag">
                    0{i + 1} — {p.category}
                  </span>
                  <img
                    src={p.image}
                    alt={`${p.shortName} — illustrative product image`}
                    width="700"
                    height="700"
                    loading={i === 0 ? "eager" : "lazy"}
                  />
                </a>
                <div className="hpanel-id">
                  <h3>{p.shortName}</h3>
                  <span>{p.size}</span>
                </div>
                <p className="hpanel-note">{p.note}</p>
                <div className="hpanel-meta">
                  <p>Sample price · not yet for sale</p>
                  <span className="hpanel-price">{money(p.price)}</span>
                  <button
                    className="add-small"
                    onClick={() => add(p._id)}
                    aria-label={`Add ${p.shortName} ${p.size} to bag`}
                  >
                    <Icon name="plus" />
                  </button>
                </div>
              </article>
            ))}
            <a className="hpanel hpanel-cta" href="#/shop">
              <span className="mono">End of the shelf</span>
              <p>
                See the whole <em>collection.</em>
              </p>
              <span className="mono">
                Open the pantry <Icon />
              </span>
            </a>
          </div>
          <div className="hprogress" aria-hidden="true">
            <i />
          </div>
          <p className="hsec-count" aria-hidden="true">
            <b ref={counter}>01</b> / 0{SHELVES.length + 1}
            <br />
            Keep scrolling
          </p>
        </div>
      </section>

      {/* — 03 · The heart of the apricot —*/}
      <section className="chapter story" aria-labelledby="story-title">
        <div className="section-wrap">
          <div className="chapter-head">
            <div>
              <p className="eyebrow" data-reveal>
                Ch. 03 — The heart of the apricot
              </p>
              <h2 id="story-title" data-lines>
                One fruit. <br />
                <em>A whole new story.</em>
              </h2>
            </div>
            <p className="chapter-count" data-reveal>
              Follow the quiet journey
              <br />
              from orchard to oil
            </p>
          </div>
          <div className="story-grid">
            <div className="story-visual">
              <div className="story-display">
                <span className="story-watermark" aria-hidden="true">
                  APRICOT
                </span>
                <img
                  className="story-bottle"
                  src={visual("apricot-oil-official")}
                  alt="Apricot kernel oil concept bottle featuring the official Skardu Organic logo"
                  width="700"
                  height="1050"
                  loading="lazy"
                />
                <span className="story-caption">
                  Skardu Organic / Apricot kernel oil
                </span>
                <span className="story-rail" aria-hidden="true">
                  <i className="story-fill" />
                </span>
              </div>
            </div>
            <div className="story-stepbar">
              <article className="story-step">
                <span className="story-step-num">01 / The orchard</span>
                <h3>
                  It begins
                  <br />
                  with a season.
                </h3>
                <p>
                  Apricot trees have a place in the agricultural life of
                  Gilgit-Baltistan. Their short harvest gives way to a much
                  longer story of keeping and making.
                </p>
                <a className="text-link" href="#/journal">
                  A season worth keeping <Icon />
                </a>
              </article>
              <article className="story-step">
                <span className="story-step-num">02 / The kernel</span>
                <h3>
                  A small detail.
                  <br />A golden possibility.
                </h3>
                <p>
                  Inside the stone is the kernel. Across the region, kernels
                  are processed for oil extraction — another way to make use
                  of the harvest.
                </p>
                <span className="story-footnote">
                  Regional context · FAO, Women in Agriculture in Pakistan
                </span>
              </article>
              <article className="story-step">
                <span className="story-step-num">03 / The collection</span>
                <h3>
                  Something simple.
                  <br />
                  Something to discover.
                </h3>
                <p>
                  Meet our apricot-oil packaging concept, now wearing the
                  original Skardu Organic mark. Its final specification and
                  intended use await supplier confirmation.
                </p>
                <a className="button" href="#/product/2">
                  Discover the oil <Icon />
                </a>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* — 04 · The orchard —*/}
      <section className="chapter orchard" aria-labelledby="orchard-title">
        <div className="orchard-media">
          <img
            src={visual("orchard")}
            alt="Illustrative apricot orchard with a stone terrace and mountains"
            width="1000"
            height="1250"
            loading="lazy"
          />
          <span className="orchard-word" aria-hidden="true">
            Orchard
          </span>
          <span className="orchard-stamp">
            Ch. 04 — Grown from a sense of place
          </span>
        </div>
        <div className="orchard-copy" data-reveal>
          <p className="eyebrow">The place behind the pantry</p>
          <h2 id="orchard-title">
            High mountains.
            <br />
            <em>Deep roots.</em>
          </h2>
          <p className="lead">A landscape can shape the way we eat.</p>
          <p>
            In Baltistan, orchards meet the mountains. Apricots are harvested,
            dried and kept beyond their short season. Kernels find another
            life as oil. Nothing about this story needs to be hurried.
          </p>
          <p>
            Skardu Organic is a collection in the making, inspired by that
            relationship between place, food and everyday life.
          </p>
          <a className="text-link" href="#/about">
            Discover our inspiration <Icon />
          </a>
          <div className="orchard-signature">
            <Icon name="mountain" />
            <span>Skardu, Baltistan — a place worth knowing.</span>
          </div>
        </div>
      </section>

      {/* — 05 · People & place —*/}
      <section className="chapter" aria-labelledby="people-title">
        <div className="section-wrap people-grid">
          <figure className="people-visual" data-speed="0.94">
            <img
              src={visual("mountains")}
              alt="Illustrative mountain valley and winding river inspired by Baltistan"
              width="1672"
              height="941"
              loading="lazy"
            />
            <figcaption>Illustrative scene · The valley</figcaption>
          </figure>
          <div className="people-copy">
            <p className="eyebrow" data-reveal>
              Ch. 05 — People &amp; place
            </p>
            <h2 id="people-title" data-lines>
              Traditions are kept in the <em>everyday.</em>
            </h2>
            <p className="lead" data-reveal>
              In carved timber, orchard walls and a harvest put aside for
              winter.
            </p>
            <p data-reveal>
              The cultural heritage of Baltistan is inseparable from its food
              — terraces of stone, rows of orchards, and the patient work
              between seasons inform the pace of this collection.
            </p>
            <a className="text-link" href="#/about" data-reveal>
              Read the story <Icon />
            </a>
          </div>
        </div>
      </section>

      {/* — 06 · How it works —*/}
      <section className="chapter how" aria-labelledby="how-title">
        <div className="section-wrap">
          <div className="chapter-head">
            <div>
              <p className="eyebrow" data-reveal>
                Ch. 06 — From discovery to your doorstep
              </p>
              <h2 id="how-title" data-lines>
                A thoughtful journey, <br />
                every step of the way.
              </h2>
            </div>
            <p className="chapter-count" data-reveal>
              03 steps
            </p>
          </div>
          <ol className="how-list">
            <li data-reveal>
              <span className="how-num">01</span>
              <h3>Find your favourites</h3>
              <p>
                Explore the sample collection and compare sizes and prices.
              </p>
              <span className="how-arrow" aria-hidden="true">
                <Icon />
              </span>
            </li>
            <li data-reveal>
              <span className="how-num">02</span>
              <h3>Make it your own</h3>
              <p>Build your bag. Your selection stays saved on this device.</p>
              <span className="how-arrow" aria-hidden="true">
                <Icon />
              </span>
            </li>
            <li data-reveal>
              <span className="how-num">03</span>
              <h3>Save for what’s next</h3>
              <p>
                Review an order draft. Live orders and delivery will follow
                when the store opens.
              </p>
              <span className="how-arrow" aria-hidden="true">
                <Icon />
              </span>
            </li>
          </ol>
        </div>
      </section>

      {/* — 07 · Closing —*/}
      <section
        className="chapter chapter-dark closing"
        aria-labelledby="closing-title"
      >
        <div className="section-wrap closing-inner">
          <p className="eyebrow" data-reveal>
            Ch. 07 — Bring a little of the mountains home
          </p>
          <h2 className="closing-title" id="closing-title">
            Small treasures. <br />
            <em>A world of their own.</em>
          </h2>
          <p className="closing-sub" data-reveal>
            Dried apricots, golden kernel oil, mountain almonds and shilajit
            resin — gathered from Baltistan, kept simple, made to travel.
          </p>
          <span className="magnetic" data-reveal>
            <a className="button button-cream" href="#/shop">
              Find your favourites <Icon />
            </a>
          </span>
          <p className="closing-coords">
            Sample catalog — live ordering opens soon
          </p>
        </div>
      </section>
    </div>
  );
}
