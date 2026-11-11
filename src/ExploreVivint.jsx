import React from 'react';
import ProductGallery from './ProductGallery.jsx';

export default function ExploreVivint({ setSelectedProduct }) {
return <>
        {/* Main Hero Video Player */}
        <div className="relative rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-[#0D111A] aspect-video max-w-3xl mx-auto group">
          <iframe loading="lazy"
            src="https://player.mediadelivery.net/embed/587199/86db6eb7-5583-4bd9-a701-1fa49be85227?autoplay=false&loop=false&muted=false&preload=none"
            className="w-full h-full object-cover border-none"
            allow="accelerometer; gyroscope; encrypted-media; picture-in-picture;"
            allowFullScreen={true}
            title="Meet Roger: Smart Home Overview"
          />
        </div>

      {/* --- VIDEO FEATURETTE: PROACTIVE DEFENSE --- */}
      <section className="py-20 px-6 bg-[#05080E] border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#00D2B4]">SYSTEM OVERVIEW</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">See Vivint Proactive Defense in Action</h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1.5">
            Watch how our intelligent cameras and integrated sensors detect and deter threats before they happen.
          </p>
        </div>

        <div className="relative rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-[#0D111A] aspect-video max-w-3xl mx-auto">
          <iframe loading="lazy"
            src="https://play.vidyard.com/wocFzyrv2ZcK1ALvvdw5vA?autoplay=0&loop=1&muted=0&controls=1"
            className="w-full h-full object-cover border-none"
            allow="autoplay; fullscreen"
            title="Vivint Proactive Security Overview Video"
          />
        </div>
      </section>

      <section className="content-width section-padding" aria-labelledby="prospect-offers-heading">
        <div className="section-intro">
          <span className="eyebrow">NEW-CUSTOMER OPTIONS</span>
          <h2 id="prospect-offers-heading">Ask about introductory offers</h2>
          <p>Some prospective customers may be eligible for introductory monitoring as low as $3.65 per month for six months. This is not a universal price or an offer available to every installation. Regular monitoring rates apply afterward; equipment, installation, fees, and other terms may apply. Contact Roger to confirm whether the offer is currently available and whether you qualify.</p>
        </div>
      </section>
      {/* --- BLOCK 2: HARDWARE LINEUP --- */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#00D2B4]">FIND YOUR FIT</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">Vivint Smart Home Hardware</h2>
          <p className="text-slate-400 text-xs mt-1">Select any equipment item to explore options or text Roger directly. Confirm current models, features, and availability with Roger.</p>
        </div>

        <ProductGallery onSelect={setSelectedProduct} />
      </section>


</>;
}
