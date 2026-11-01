import React from 'react';
import { Maximize2, MessageSquare, Star } from 'lucide-react';
import { IMG_RAHJ_PROFILE, INSTAGRAM_URL, TIKTOK_URL, SOCIAL_HANDLE, InstagramIcon, TikTokIcon, NEXTDOOR_REVIEWS, triggerTextMsg } from './brand.jsx';

export default function MeetRoger({ setSelectedReview, onContact = triggerTextMsg }) {
return <>
      {/* --- BLOCK 3: ABOUT ROGER & COMMUNITY BRAVERY --- */}
      <section className="py-20 px-6 bg-slate-50 text-slate-900 border-y border-slate-200">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">

            <div className="md:col-span-5 space-y-4">
              <div className="rounded-2xl overflow-hidden bg-white border border-slate-200 p-2 shadow-md">
                <img src={IMG_RAHJ_PROFILE} alt="Roger Reed" className="w-full h-auto rounded-xl object-cover" />
              </div>

              <div className="bg-white border border-slate-200 p-4 rounded-xl text-center shadow-sm">
                <div className="text-sm font-bold text-slate-900">3,000+ Systems Installed</div>
                <div className="text-xs text-slate-500 mt-0.5">Certified Vivint Smart Home Expert</div>
              </div>

              {/* Social Channels Card */}
              <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Follow Roger on Social
                  </span>
                  <span className="text-[11px] font-semibold text-[#007A48]">
                    {SOCIAL_HANDLE}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold text-xs transition-colors border border-pink-200/60"
                  >
                    <InstagramIcon className="w-4 h-4 shrink-0" />
                    <span>Instagram</span>
                  </a>
                  <a
                    href={TIKTOK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg bg-slate-900 hover:bg-black text-white font-bold text-xs transition-colors shadow-sm"
                  >
                    <TikTokIcon className="w-4 h-4 shrink-0 text-[#00D2B4]" />
                    <span>TikTok</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="md:col-span-7 space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#007A48]">MEET YOUR TECHNICIAN</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">Roger Reed</h2>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed font-normal">As a Smart Home Expert, I help homeowners plan and install a system that fits their home. With 3,000+ systems installed, I bring hands-on experience to every introduction. For account, technical support, or billing needs, Vivint’s official support team is ready to help.</p>

              <div className="bg-white border border-slate-200 p-[1.125rem] rounded-xl space-y-2 shadow-sm">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">Documented Community Bravery</h4>
                <p className="text-slate-600 text-xs leading-relaxed italic">
                  In 2014, Roger intervened during a break-in at a Muncie, Indiana daycare, protecting children and staff before police arrived—an event covered across Indiana news outlets.
                </p>
              </div>

              {/* Daycare News Video */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider block">Indiana News Archive Footage</span>
                <div className="rounded-xl overflow-hidden shadow-lg aspect-video border border-slate-300 bg-black">
                  <iframe loading="lazy"
                    src="https://player.mediadelivery.net/embed/587199/414c828d-71ce-4777-879d-780f97f3b880?autoplay=false&loop=false&muted=false&preload=none"
                    className="w-full h-full border-none"
                    allow="fullscreen"
                    title="Roger Daycare Heroics News Feature"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onContact("Consultation with Roger Reed")}
                  className="px-8 py-3.5 bg-[#005A36] hover:bg-[#007A48] text-white rounded-full font-bold text-xs uppercase tracking-wider transition-colors flex items-center space-x-2 shadow-md animate-wobble"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>TEXT ROGER REED DIRECTLY</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* --- VIDEO TESTIMONIAL SECTION --- */}
      <section className="py-20 px-6 bg-[#05080E] border-b border-white/10 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center mb-10 relative z-10">
          <div className="inline-flex items-center space-x-1 text-amber-400 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#00D2B4] block">
            CLIENT TESTIMONIALS
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mt-1">
            Real Homeowner Experiences
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-2 max-w-xl mx-auto">
            Hear directly from homeowners about working with Roger for personalized home security design, seamless installation, and ongoing direct support.
          </p>
        </div>


        {/* Video Players - Vertical Stack */}
        <div className="flex flex-col space-y-10 max-w-3xl mx-auto z-10 relative">
          {/* Testimonial 1 */}
          <div className="space-y-2">
            <div className="relative rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-[#0D111A] aspect-video group">
              <iframe loading="lazy"
                src="https://player.mediadelivery.net/embed/587199/8aee0ac3-34c4-454b-a882-c59e23a0596e?autoplay=false&loop=false&muted=false&preload=none"
                className="w-full h-full object-cover border-none"
                allow="accelerometer; gyroscope; encrypted-media; picture-in-picture;"
                allowFullScreen={true}
                title="Roger Vivint Smart Home Client Testimonial 1"
              />
            </div>
            <div className="flex items-center justify-between px-1 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Verified Client Review</span>
              <span className="text-[#00D2B4] text-[11px] font-medium">Smart Home Setup</span>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="space-y-2">
            <div className="relative rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-[#0D111A] aspect-video group">
              <iframe loading="lazy"
                src="https://player.mediadelivery.net/embed/587199/62f0c727-1a39-4914-b522-3e5b45e17d65?autoplay=false&loop=false&muted=false&preload=none"
                className="w-full h-full object-cover border-none"
                allow="accelerometer; gyroscope; encrypted-media; picture-in-picture;"
                allowFullScreen={true}
                title="Roger Vivint Smart Home Client Testimonial 2"
              />
            </div>
            <div className="flex items-center justify-between px-1 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Verified Client Review</span>
              <span className="text-[#00D2B4] text-[11px] font-medium">Pro Installation & Service</span>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="space-y-2">
            <div className="relative rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-[#0D111A] aspect-video group">
              <iframe loading="lazy"
                src="https://player.mediadelivery.net/embed/587199/6df3c479-7d2e-4f13-8bf5-d458d9348474?autoplay=false&loop=false&muted=false&preload=none"
                className="w-full h-full object-cover border-none"
                allow="accelerometer; gyroscope; encrypted-media; picture-in-picture;"
                allowFullScreen={true}
                title="Roger Vivint Smart Home Client Testimonial 3"
              />
            </div>
            <div className="flex items-center justify-between px-1 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Verified Client Review</span>
              <span className="text-[#00D2B4] text-[11px] font-medium">Customer Care & Support</span>
            </div>
          </div>
        </div>

        {/* References Inquire Button */}
        <div className="text-center mt-8 relative z-10">
          <button
            onClick={() => onContact("Video Testimonials Inquiry")}
            className="inline-flex items-center space-x-2 text-xs font-bold text-slate-300 hover:text-white bg-[#0D111A] hover:bg-[#151c29] border border-slate-700 px-6 py-2.5 rounded-full transition-colors animate-wobble"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#00D2B4]" />
            <span>ASK ROGER ABOUT CLIENT REFERENCES</span>
          </button>
        </div>
      </section>

      {/* --- BLOCK 4: NEXTDOOR PROOF GALLERY --- */}
      <section className="py-16 px-6 bg-[#05080E] border-b border-white/10">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#00D2B4]">VERIFIED PROOF</span>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">Local Nextdoor Recommendations</h3>
          <p className="text-slate-400 text-xs mt-1">Click any testimonial card to view in full resolution.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 max-w-4xl mx-auto">
          {NEXTDOOR_REVIEWS.map((url, i) => (
            <button type="button" aria-label={`Enlarge Nextdoor review ${i + 1}`}
              key={i}
              onClick={() => setSelectedReview(url)}
              className="bg-[#0D111A] rounded-xl p-2 border border-slate-800 shadow-md cursor-pointer hover:border-[#00D2B4] transition-all hover:scale-105 flex flex-col items-center group relative overflow-hidden"
            >
              <img loading="lazy"
                src={url}
                alt={`Nextdoor Review ${i + 1}`}
                className="w-full h-28 sm:h-32 object-cover object-top rounded-lg"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                <Maximize2 className="w-5 h-5 text-[#00D2B4]" />
              </div>
            </button>
          ))}
        </div>
      </section>


</>;
}
