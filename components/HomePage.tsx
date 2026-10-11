import React, { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { catalog, categories, visual } from '../data/catalog';
import { Icon, ProductCard } from './StoreUI';
gsap.registerPlugin(ScrollTrigger);

function ProductStory(){
 const root=useRef<HTMLElement>(null);
 useLayoutEffect(()=>{
  const mm=gsap.matchMedia();
  mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)',()=>{
   const ctx=gsap.context(()=>{
    gsap.timeline({scrollTrigger:{trigger:root.current,start:'top top+=130',end:'bottom bottom-=60',scrub:.65}})
     .fromTo('.journey-bottle',{rotation:-5,scale:.91,y:18},{rotation:3,scale:1.03,y:-12,duration:1,ease:'none'})
     .to('.journey-bottle',{rotation:0,scale:.97,y:0,duration:1,ease:'none'})
     .fromTo('.journey-fill',{scaleY:0},{scaleY:1,duration:2,ease:'none'},0)
     .to('.journey-display',{backgroundColor:'#e4e8dc',duration:1},.65);
   },root);return()=>ctx.revert();
  });return()=>mm.revert();
 },[]);
 return <section className="product-story journey section-wrap" ref={root} aria-labelledby="story-title">
  <div className="journey-heading"><p className="eyebrow">02 / The heart of the apricot</p><h2 id="story-title">One fruit.<br/><em>A whole new story.</em></h2><p>Follow the quiet journey from orchard to oil.</p></div>
  <div className="journey-grid"><div className="journey-visual"><div className="journey-display"><span className="journey-watermark" aria-hidden="true">APRICOT</span><img className="journey-bottle" src={visual('apricot-oil-official')} alt="Apricot kernel oil concept bottle featuring the official Skardu Organic logo" width="700" height="1050" loading="lazy"/><span className="journey-caption">SKARDU ORGANIC / APRICOT KERNEL OIL</span></div><div className="journey-product-bar"><span>Apricot kernel oil <small>120 ml · Concept packaging</small></span><a href="#/product/2" aria-label="Explore apricot kernel oil"><Icon/></a></div></div>
  <div className="journey-steps"><span className="journey-rail" aria-hidden="true"><i className="journey-fill"/></span><article><span className="journey-step-number">01 / THE ORCHARD</span><h3>It begins<br/>with a season.</h3><p>Apricot trees have a place in the agricultural life of Gilgit-Baltistan. Their short harvest gives way to a much longer story of keeping and making.</p><a className="text-link" href="#/journal">A season worth keeping <Icon/></a></article><article><span className="journey-step-number">02 / THE KERNEL</span><h3>A small detail.<br/>A golden possibility.</h3><p>Inside the stone is the kernel. Across the region, kernels are processed for oil extraction — another way to make use of the harvest.</p><span className="journey-footnote">Regional context · FAO, Women in Agriculture in Pakistan</span></article><article><span className="journey-step-number">03 / THE COLLECTION</span><h3>Something simple.<br/>Something to discover.</h3><p>Meet our apricot-oil packaging concept, now wearing the original Skardu Organic mark. Its final specification and intended use await supplier confirmation.</p><a className="button" href="#/product/2">Discover the oil <Icon/></a></article></div></div></section>;
}
export default function HomePage(){
 const root=useRef<HTMLDivElement>(null);const [category,setCategory]=useState('All');
 useLayoutEffect(()=>{
  const mm=gsap.matchMedia();mm.add('(prefers-reduced-motion: no-preference)',()=>{
   const ctx=gsap.context(()=>{
    gsap.from('.hero-landscape',{scale:1.035,duration:1.6,ease:'power2.out'});
    gsap.from('.hero-reveal',{y:18,opacity:0,stagger:.09,duration:.85,ease:'power2.out'});
    
    gsap.from('.origin-image img',{scale:1.04,scrollTrigger:{trigger:'.origin',start:'top bottom',end:'bottom top',scrub:.6}});
   },root);return()=>ctx.revert();
  });return()=>mm.revert();
 },[]);
 const featured=catalog.filter(p=>p._id!=='1b' && (category==='All'||p.category===category));
 return <div ref={root}>
  <section className="hero" aria-labelledby="hero-title"><picture><source media="(max-width: 700px)" srcSet={visual('mountains-mobile')}/><img className="hero-landscape" src={visual('mountains')} alt="Illustrative mountain valley and winding river inspired by Baltistan" width="1672" height="941" fetchPriority="high"/></picture><div className="hero-shade"/><div className="hero-content"><p className="eyebrow hero-reveal"><span/> Rooted in Baltistan. Inspired by nature.</p><h1 id="hero-title" className="hero-reveal">A little closer<br/>to <em>the source.</em></h1><p className="hero-copy hero-reveal">From mountain orchards to everyday rituals.<br/>Discover the simple treasures of Skardu.</p><a className="button button-cream hero-reveal" href="#/shop">Explore the collection <Icon/></a></div><div className="hero-foot"><a href="#/about"><span className="location-dot"/>Skardu, Gilgit-Baltistan <span>↗</span></a><span className="hero-scroll">A slower kind of discovery <span>↓</span></span><small>Landscape illustration</small></div><div className="hero-index" aria-hidden="true">01 <span>/</span> 06</div></section>
  <div className="values-strip"><span><Icon name="mountain"/> Inspired by the high valleys</span><i/><span><Icon name="sun"/> A celebration of the harvest</span><i/><span><Icon name="leaf"/> Simple ingredients, considered choices</span></div>
  <section className="collection section-wrap" aria-labelledby="collection-title"><div className="section-heading"><div><p className="eyebrow">Nature’s pantry</p><h2 id="collection-title">Good things.<br className="mobile-break"/> From up here.</h2></div><a className="text-link" href="#/shop">Shop the collection <Icon/></a></div><div className="collection-toolbar"><div className="category-tabs" aria-label="Featured categories">{categories.map(c=><button key={c} aria-pressed={c===category} onClick={()=>setCategory(c)}>{c}</button>)}</div><span className="quiet-label">Thoughtfully selected. Simply enjoyed.</span></div><div className="product-grid" key={category}>{featured.map(p=><ProductCard product={p} key={p._id}/>)}</div><p className="sample-note">A preview of the collection. Products, prices and imagery are samples awaiting owner approval.</p></section>
  <ProductStory/>
  <section className="origin section-wrap" aria-labelledby="origin-title"><figure className="origin-image"><img src={visual('orchard')} alt="Illustrative apricot orchard with a stone terrace and mountains" width="1000" height="1250" loading="lazy"/><figcaption>03 / The orchard · Illustrative scene</figcaption><span className="image-stamp">Grown from<br/>a sense of place.</span></figure><div className="origin-copy"><p className="eyebrow">The place behind the pantry</p><h2 id="origin-title">High mountains.<br/>Deep roots.</h2><p className="lead">A landscape can shape the way we eat.</p><p>In Baltistan, orchards meet the mountains. Apricots are harvested, dried and kept beyond their short season. Kernels find another life as oil. Nothing about this story needs to be hurried.</p><p>Skardu Organic is a collection in the making, inspired by that relationship between place, food and everyday life.</p><a className="text-link" href="#/about">Discover our inspiration <Icon/></a><div className="origin-signature"><Icon name="mountain"/><span>Skardu, Baltistan<br/><small>A place worth knowing.</small></span></div></div></section>
  <section className="editorial-band section-wrap"><p className="eyebrow">04 / People & place</p><h2>Traditions are kept<br/>in the <em>everyday.</em></h2><div><p>In carved timber, orchard walls and a harvest put aside for winter. The cultural heritage of Baltistan is part of the setting for this collection.</p><a className="text-link" href="#/about">Read the story <Icon/></a></div></section>
  <section className="from-home section-wrap"><div><p className="eyebrow">05 / From discovery to your doorstep</p><h2>A thoughtful journey.<br/>Every step of the way.</h2></div><ol><li><span>01</span><div><h3>Find your favourites</h3><p>Explore the sample collection and compare sizes and prices.</p></div></li><li><span>02</span><div><h3>Make it your own</h3><p>Build your bag. Your selection stays saved on this device.</p></div></li><li><span>03</span><div><h3>Save for what’s next</h3><p>Review an order draft. Live orders and delivery will follow when the store opens.</p></div></li></ol></section>
  <section className="closing"><img src={visual('mountains')} alt="" width="1672" height="941" loading="lazy"/><div><p className="eyebrow">06 / Bring a little of the mountains home</p><h2>Small treasures.<br/>A world of their own.</h2><a className="button button-cream" href="#/shop">Find your favourites <Icon/></a></div></section>
 </div>;
}
