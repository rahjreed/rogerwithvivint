import React, { useState } from 'react';
import { 
  Phone, 
  ShieldCheck, 
  Check, 
  X, 
  Info, 
  ChevronRight, 
  KeyRound, 
  Download, 
  Copy, 
  LogOut, 
  Send, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  MessageSquare, 
  Sparkles, 
  ArrowUpRight, 
  Shield, 
  Star, 
  Award, 
  Maximize2, 
  Lock, 
  Unlock, 
  Tag, 
  Gift, 
  Camera, 
  Sun,
  AlertTriangle,
  BadgePercent
} from 'lucide-react';

// --- Configuration ---
const CONTACT_EMAIL = "rahj@techrahj.com";
const PHONE_NUMBER = "463-281-3454"; 
const RAW_SMS_NUMBER = "14632813454";
const VIVINT_CORPORATE_SERVICE = "800-216-5232";
const PARTNER_PASSWORD = "wecare26";
const OFFER_ACCESS_CODE = "INDY2026";

// --- Imagery Assets ---
const IMG_PRO_INSTALL = "https://www.vivint.com/sites/default/files/styles/desktop_1600_hq/public/image/2024-01/ProInstall-1-Full-1600.jpg.webp?itok=FY9zy1nT";
const IMG_RAHJ_PROFILE = "https://images.travelprox.com/techrahj/Rahjvivint.png";

// --- Automated SMS Trigger Helper ---
const triggerTextMsg = (customNote = "") => {
  const baseMessage = "I saw your website";
  const fullText = customNote 
    ? `${baseMessage} and I'm interested in: ${customNote}` 
    : `${baseMessage} and I would like to get a setup quote for my home!`;
  
  const smsUrl = `sms:${RAW_SMS_NUMBER}?body=${encodeURIComponent(fullText)}`;
  window.location.href = smsUrl;
};

// --- Official Vivint Logo SVG Component ---
const VivintLogo = ({ className = "h-6 text-white" }) => (
  <svg viewBox="0 0 118 30" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12.8 19.8L7.4 5.2H2.2L10.3 24.8H15.3L23.4 5.2H18.2L12.8 19.8Z" />
    <path d="M26.2 5.2H31.1V24.8H26.2V5.2Z" />
    <path d="M41.7 19.8L36.3 5.2H31.1L39.2 24.8H44.2L52.3 5.2H47.1L41.7 19.8Z" />
    <path d="M55.1 5.2H60V24.8H55.1V5.2Z" />
    <path d="M64.9 5.2H69.8V8.6C71.3 6.2 74.1 4.8 77.1 4.8C83.2 4.8 86.8 8.8 86.8 15.3V24.8H81.9V15.7C81.9 11.5 79.5 8.9 75.4 8.9C71.3 8.9 69.8 11.8 69.8 15.7V24.8H64.9V5.2Z" />
    <path d="M96.7 9.1H92.2V5.2H96.7V0H101.6V5.2H107.5V9.1H101.6V18.7C101.6 20.9 102.6 21.6 104.8 21.6C105.8 21.6 106.8 21.4 107.7 21V24.8C106.3 25.2 104.6 25.4 103.1 25.4C98.4 25.4 96.7 23.3 96.7 19.1V9.1Z" />
    <path d="M110.5 25.4H117.8V17.8L110.5 25.4Z" fill="#FF5900" />
    <path d="M110.5 13.9C110.5 13.9 113.6 14.1 115.5 16L117.8 13.7C115.1 11 110.5 10.8 110.5 10.8V13.9Z" fill="#FF5900" />
    <path d="M110.5 6.9C110.5 6.9 116.1 7.2 119.5 10.6L121.8 8.3C117.4 3.9 110.5 3.8 110.5 3.8V6.9Z" fill="#FF5900" />
  </svg>
);

// --- Hardware Items ---
const PRODUCTS = [
  { 
    name: "Outdoor Camera Pro (Version 3)", 
    desc: "AI Active Deterrence • Version 3", 
    img: "https://www.vivint.com/sites/default/files/styles/square_hq_280x280/public/image/2026-02/Image_4.png.webp?itok=PQmCh1nt",
    longDesc: "Version 3 Outdoor Camera Pro spots lurkers in real-time and proactively wards them off with a 140dB siren and strobe light before they step foot inside.",
    features: ["Version 3 Hardware Architecture", "4K HDR Sensor", "AI Lurker Deterrence", "140dB Active Siren", "2-Way HD Voice"]
  },
  { 
    name: "Doorbell Camera Pro (Version 2)", 
    desc: "180° Porch Guard • Version 2", 
    img: "https://www.vivint.com/sites/default/files/styles/square_hq_280x280/public/image/2022-07/Carousel-DBC-Desktop.png.webp?itok=Sbl-kZmg",
    longDesc: "Version 2 Doorbell Camera Pro offers the widest view on the market with proactive package protection and automatic thief deterrence.",
    features: ["Version 2 Hardware Architecture", "180° x 180° Ultra-Wide View", "Package Protection AI", "Night Vision HDR", "Hands-Free Voice"]
  },
  { 
    name: "Smart Lock", 
    desc: "Keyless Access", 
    img: "https://www.vivint.com/sites/default/files/styles/square_hq_280x280/public/image/2023-12/Carousel-lock.png.webp?itok=QqCU9qG3",
    longDesc: "Lock/unlock anywhere. Issue custom codes for family or contractors with auto-arm triggers.",
    features: ["Remote Smartphone Control", "Unique Guest PINs", "Auto-Arm Synergy", "Tamper Sensor"]
  },
  { 
    name: "Vivint Smart Hub", 
    desc: "Command Center", 
    img: "https://www.vivint.com/sites/default/files/styles/square_hq_280x280/public/image/2023-12/Carousel_smartcontrol.png.webp?itok=08uMPQGz",
    longDesc: "7-inch touchscreen command center connecting all cameras and sensors with cellular backup.",
    features: ["7-Inch Touchscreen", "Dedicated Cellular Link", "1-Touch Emergency Dispatch", "Battery Backup"]
  },
  { 
    name: "Smart Thermostat", 
    desc: "AI Climate Control", 
    img: "https://www.vivint.com/sites/default/files/styles/square_hq_280x280/public/image/2023-07/Thermostat-Carousel.png.webp?itok=WPdRZrNu",
    longDesc: "Auto-adjusts energy use and automatically cuts HVAC airflow during fire emergencies.",
    features: ["Smart Auto-Adjust", "Fire Safety Shutdown", "Mobile Remote Access", "Voice Assistant Sync"]
  },
  { 
    name: "Water & Freeze Sensor", 
    desc: "Flood Prevention", 
    img: "https://www.vivint.com/sites/default/files/image/2024-07/productViewAll_water_sensor.png",
    longDesc: "Detects leaks and freezing temps near appliances before costly structural water damage hits.",
    features: ["Instant Leak Alerts", "Freeze Warning", "10-Year Battery Life", "Sub-Floor Sensing"]
  }
];

const NEXTDOOR_REVIEWS = [
  "https://images.travelprox.com/techrahj/nd1.png",
  "https://images.travelprox.com/techrahj/nd2.png",
  "https://images.travelprox.com/techrahj/nd3.png",
  "https://images.travelprox.com/techrahj/nd4.png",
  "https://images.travelprox.com/techrahj/nd5.png"
];

// --- Pre-Approved Offer Modal (Passcode Protected) ---
const PreApprovedOfferModal = ({ isOpen, onClose }) => {
  const [passcode, setPasscode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleUnlock = (e) => {
    e.preventDefault();
    if (passcode.trim().toUpperCase() === OFFER_ACCESS_CODE) {
      setIsUnlocked(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Invalid access code. Please enter a valid Smart Home Expert code.');
    }
  };

  const handleClaimOffer = () => {
    const offerDetails = `SHX Promo Offer (${OFFER_ACCESS_CODE}) - 1 Version 2 Doorbell Camera Pro, 2 Version 2 Outdoor Cameras Pro w/ Garage Spotlight Attachment, 50% Off Pro Installation + 4 Months Free Service`;
    triggerTextMsg(offerDetails);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[650] flex items-center justify-center p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-[#05080E]/90 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-[#0D111A] border-2 border-emerald-500/40 text-white rounded-3xl p-6 sm:p-8 z-[660] shadow-2xl my-8 animate-in zoom-in-95 duration-200">
        
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 text-slate-400 hover:text-white bg-[#05080E] p-2 rounded-full border border-slate-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {!isUnlocked ? (
          <div className="text-center max-w-md mx-auto py-6">
            <div className="w-16 h-16 bg-[#005A36] border border-emerald-400/40 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-950/40">
              <Lock className="w-8 h-8 text-[#00D2B4]" />
            </div>

            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#00D2B4] block mb-2">
              EXCLUSIVE SHX SPECIAL OFFER
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Unlock Promo Offer
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4 font-normal">
              Enter your access code to reveal the exclusive equipment bundle and promotional savings.
            </p>

            {/* Crucial SHX & Inventory Notice */}
            <div className="bg-[#05080E] border border-amber-500/30 rounded-xl p-3.5 text-left text-xs space-y-1 mb-6">
              <div className="flex items-center space-x-2 text-amber-300 font-bold">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                <span>Smart Home Expert (SHX) Exclusive</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                This offer is only available directly through a certified Smart Home Expert. You cannot get this offer by calling Vivint Corporate or phone sales. Strictly limited availability while Version 2 equipment stock lasts.
              </p>
            </div>

            <form onSubmit={handleUnlock} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Access Code
                </label>
                <input 
                  type="text" 
                  required 
                  placeholder="Enter Access Code"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full bg-[#05080E] border border-slate-700 rounded-xl px-4 py-3.5 text-base font-bold text-white tracking-widest uppercase focus:outline-none focus:border-[#00D2B4] transition-colors"
                />
              </div>

              {errorMsg && (
                <div className="flex items-center space-x-2 text-rose-400 text-xs bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button 
                type="submit" 
                className="w-full py-4 bg-[#005A36] hover:bg-[#007A48] text-white rounded-full font-bold text-xs uppercase tracking-widest transition-all shadow-xl shadow-emerald-950/40 border border-emerald-400/40 flex items-center justify-center space-x-2 animate-wobble"
              >
                <Unlock className="w-4 h-4" />
                <span>REVEAL PROMO OFFER</span>
              </button>
            </form>

            <p className="text-[11px] text-slate-500 mt-5">
              Access code provided directly by Smart Home Expert Roger Reed.
            </p>
          </div>
        ) : (
          <div className="space-y-6 pt-2">
            
            {/* Unlocked Header */}
            <div className="text-center pb-4 border-b border-slate-800">
              <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-400/30 px-3.5 py-1 rounded-full text-xs text-[#00D2B4] font-bold uppercase tracking-wider mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Exclusive SHX Promotion Unlocked</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
                Your Promo Equipment Package
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm mt-1">
                Exclusive direct technician package designed and installed by Roger Reed.
              </p>
            </div>

            {/* Limited Availability & SHX Direct Callout */}
            <div className="bg-[#05080E] border-2 border-amber-500/40 rounded-2xl p-3.5 flex items-start space-x-3 text-xs bg-gradient-to-r from-[#05080E] to-amber-950/20">
              <BadgePercent className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 font-bold block mb-0.5 uppercase tracking-wide">
                  Exclusive SHX Direct Deal • Limited Version 2 Stock
                </strong>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  This offer is exclusive to Roger Reed (Smart Home Expert) and <strong>cannot be redeemed by calling Vivint directly</strong>. Availability is strictly limited until Version 2 hardware inventory is gone.
                </p>
              </div>
            </div>

            {/* Package Items Grid (Version 2 Cameras Only) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              <div className="bg-[#05080E] border border-slate-800 rounded-2xl p-4 flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#005A36] flex items-center justify-center shrink-0">
                  <Camera className="w-5 h-5 text-[#00D2B4]" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#00D2B4] block">Included Camera</span>
                  <h4 className="text-sm font-bold text-white">1x Doorbell Camera Pro (Version 2)</h4>
                  <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                    180° x 180° ultra-wide field of view with smart package thief deterrence.
                  </p>
                </div>
              </div>

              <div className="bg-[#05080E] border border-slate-800 rounded-2xl p-4 flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#005A36] flex items-center justify-center shrink-0">
                  <Camera className="w-5 h-5 text-[#00D2B4]" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#00D2B4] block">Included Cameras</span>
                  <h4 className="text-sm font-bold text-white">2x Outdoor Cameras Pro (Version 2)</h4>
                  <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                    4K HDR sensor, AI person detection, and 140dB warning deterrence.
                  </p>
                </div>
              </div>

              <div className="bg-[#05080E] border border-slate-800 rounded-2xl p-4 flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#005A36] flex items-center justify-center shrink-0">
                  <Sun className="w-5 h-5 text-[#00D2B4]" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#00D2B4] block">Included Hardware</span>
                  <h4 className="text-sm font-bold text-white">Garage Spotlight Attachment</h4>
                  <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                    High-output LED floodlight integrated with automated motion triggers.
                  </p>
                </div>
              </div>

              <div className="bg-[#05080E] border border-emerald-500/40 rounded-2xl p-4 flex items-start space-x-3.5 bg-gradient-to-br from-[#05080E] to-[#005A36]/30">
                <div className="w-10 h-10 rounded-xl bg-[#007A48] flex items-center justify-center shrink-0 shadow-md">
                  <Gift className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300 block">Bonus Promotion</span>
                  <h4 className="text-sm font-bold text-white">4 Months Free Service</h4>
                  <p className="text-slate-300 text-xs mt-0.5 leading-relaxed">
                    24/7 continuous professional monitoring and cellular backup at $0 cost.
                  </p>
                </div>
              </div>

            </div>

            {/* Additional Value Highlights */}
            <div className="bg-[#05080E] border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-around gap-3 text-xs">
              <div className="flex items-center space-x-2 text-slate-300">
                <Check className="w-4 h-4 text-[#00D2B4]" />
                <span>$0 Activation Fee</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <Check className="w-4 h-4 text-[#00D2B4]" />
                <span>50% Off Pro Installation</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <Check className="w-4 h-4 text-[#00D2B4]" />
                <span>Personal After-Sale Service</span>
              </div>
            </div>

            {/* Claim CTA */}
            <div className="space-y-2 pt-2">
              <button 
                onClick={handleClaimOffer}
                className="w-full py-4 bg-[#005A36] hover:bg-[#007A48] text-white rounded-full font-bold text-xs uppercase tracking-widest transition-all shadow-xl shadow-emerald-950/40 border border-emerald-400/40 flex items-center justify-center space-x-2 animate-wobble"
              >
                <MessageSquare className="w-4 h-4" />
                <span>CLAIM PROMO OFFER VIA TEXT</span>
              </button>
              <p className="text-center text-[11px] text-slate-400">
                Sends a direct text to Roger to lock in this limited Version 2 inventory bundle.
              </p>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

// --- Expandable Review Modal ---
const ReviewExpandModal = ({ reviewUrl, onClose }) => {
  if (!reviewUrl) return null;

  return (
    <div className="fixed inset-0 z-[650] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-[#05080E]/90 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#0D111A] border border-slate-800 rounded-2xl p-5 z-[660] shadow-2xl flex flex-col items-center animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose} 
          className="absolute top-3.5 right-3.5 text-slate-400 hover:text-white bg-[#05080E] p-1.5 rounded-full border border-slate-800 transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-full mb-3 text-left">
          <span className="text-[11px] font-bold text-[#00D2B4] tracking-widest uppercase">Verified Proof</span>
          <h4 className="text-base font-bold text-white mt-0.5">Nextdoor Recommendation</h4>
        </div>

        <div className="w-full bg-[#05080E] border border-slate-800 rounded-xl p-2 mb-4 flex items-center justify-center overflow-hidden">
          <img 
            src={reviewUrl} 
            alt="Expanded Nextdoor Review" 
            className="max-h-[60vh] w-auto max-w-full object-contain mx-auto rounded-lg shadow-md" 
          />
        </div>

        <button 
          onClick={() => { onClose(); triggerTextMsg("Expanded Nextdoor Review Inquiry"); }}
          className="w-full py-3 bg-[#005A36] hover:bg-[#007A48] text-white rounded-full font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center space-x-2 animate-wobble shadow-lg shadow-emerald-950/30 border border-emerald-400/30 shrink-0"
        >
          <MessageSquare className="w-4 h-4" />
          <span>TEXT ROGER ABOUT THIS REVIEW</span>
        </button>
      </div>
    </div>
  );
};

// --- Partner Portal Modal ---
const PartnerPortalModal = ({ isOpen, onClose }) => {
  const [inputPassword, setInputPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState('submitLead');
  const [copiedLink, setCopiedLink] = useState(false);
  const [referral, setReferral] = useState({ clientName: '', clientPhone: '', partnerName: '', notes: '' });

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    if (inputPassword.trim() === PARTNER_PASSWORD) {
      setIsAuthenticated(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Invalid password. Passcode is "wecare26".');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleReferralSubmit = (e) => {
    e.preventDefault();
    const note = `Partner Referral from ${referral.partnerName} for client ${referral.clientName} (${referral.clientPhone}). ${referral.notes}`;
    triggerTextMsg(note);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[700] flex items-center justify-center p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-[#05080E]/90 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-[#0D111A] border border-slate-800 text-white rounded-2xl shadow-2xl p-6 sm:p-8 z-[710] animate-in zoom-in-95 duration-200 my-8">
        
        <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 transition-colors">
          <X className="w-5 h-5" />
        </button>

        {!isAuthenticated ? (
          <div className="max-w-sm mx-auto py-6 text-center">
            <div className="w-12 h-12 bg-[#05080E] rounded-xl flex items-center justify-center mx-auto mb-4 border border-slate-800">
              <KeyRound className="w-6 h-6 text-[#00D2B4]" />
            </div>

            <h3 className="text-xl font-bold text-white tracking-tight">Partner Login</h3>
            <p className="text-slate-400 text-xs mt-1 mb-6">Enter passcode to access referral portal.</p>

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-medium text-slate-200 mb-1">Passcode</label>
                <input 
                  type="password"
                  required
                  placeholder="Enter passcode"
                  value={inputPassword}
                  onChange={e => setInputPassword(e.target.value)}
                  className="w-full bg-[#05080E] border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#00D2B4] tracking-widest"
                />
              </div>

              {errorMsg && (
                <div className="flex items-center space-x-2 text-rose-400 text-xs bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button type="submit" className="w-full py-3 bg-[#005A36] hover:bg-[#007A48] text-white rounded-full font-bold text-xs uppercase tracking-wider transition-colors border border-emerald-400/30 animate-wobble">
                Unlock Portal
              </button>
            </form>
          </div>
        ) : (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 mb-6 gap-3">
              <div>
                <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                  Verified Partner Access
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">Partner Portal</h3>
              </div>

              <div className="flex items-center space-x-2">
                <button onClick={handleCopyLink} className="flex items-center space-x-1.5 bg-[#05080E] hover:bg-slate-800 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 transition-colors">
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? "Copied" : "Copy Link"}</span>
                </button>
                <button onClick={() => setIsAuthenticated(false)} className="p-1.5 bg-[#05080E] hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex space-x-2 border-b border-slate-800 mb-6 overflow-x-auto pb-2 scrollbar-hide">
              {[
                { id: 'submitLead', label: 'Submit Client', icon: Send },
                { id: 'commissions', label: 'Commissions', icon: DollarSign },
                { id: 'materials', label: 'Assets', icon: Download },
                { id: 'contact', label: 'Direct Line', icon: Phone }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                      activeTab === tab.id 
                        ? 'bg-[#005A36] text-white' 
                        : 'bg-[#05080E] text-slate-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {activeTab === 'submitLead' && (
              <form onSubmit={handleReferralSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-200 mb-1">Your Name / Business</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Realtor / Partner Name" 
                      value={referral.partnerName}
                      onChange={e => setReferral({...referral, partnerName: e.target.value})}
                      className="w-full bg-[#05080E] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00D2B4]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-200 mb-1">Client Full Name</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Homeowner Name" 
                      value={referral.clientName}
                      onChange={e => setReferral({...referral, clientName: e.target.value})}
                      className="w-full bg-[#05080E] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00D2B4]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-200 mb-1">Client Phone</label>
                  <input 
                    type="tel" 
                    required 
                    placeholder="(555) 000-0000" 
                    value={referral.clientPhone}
                    onChange={e => setReferral({...referral, clientPhone: e.target.value})}
                    className="w-full bg-[#05080E] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00D2B4]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-200 mb-1">Notes / Timeline</label>
                  <textarea 
                    rows="2" 
                    placeholder="Move-in date or security preferences..."
                    value={referral.notes}
                    onChange={e => setReferral({...referral, notes: e.target.value})}
                    className="w-full bg-[#05080E] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00D2B4]"
                  ></textarea>
                </div>

                <button type="submit" className="w-full py-3 bg-[#005A36] hover:bg-[#007A48] text-white rounded-full font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 border border-emerald-400/30 animate-wobble">
                  <MessageSquare className="w-4 h-4" />
                  <span>TEXT REFERRAL DIRECTLY TO ROGER</span>
                </button>
              </form>
            )}

            {activeTab === 'commissions' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-[#05080E] p-4 rounded-xl border border-slate-800 text-center">
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Standard</span>
                  <h4 className="text-xl font-bold text-[#00D2B4] mt-1">$150 - $250</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Per Activation</p>
                </div>
                <div className="bg-[#05080E] p-4 rounded-xl border border-slate-800 text-center">
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Realtor Partner</span>
                  <h4 className="text-xl font-bold text-[#00D2B4] mt-1">$300 - $450</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Per Closing</p>
                </div>
                <div className="bg-[#05080E] p-4 rounded-xl border border-slate-800 text-center">
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Volume Partner</span>
                  <h4 className="text-xl font-bold text-[#00D2B4] mt-1">Custom Bonus</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Priority Slots</p>
                </div>
              </div>
            )}

            {activeTab === 'materials' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { name: "Smart Home Expert Spec Sheet", type: "PDF Overview" },
                  { name: "Homebuyer Closing Security Packet", type: "Realtor Flyer" },
                  { name: "Roger Reed Digital Business Card", type: "Contact Asset" },
                  { name: "Hardware Features Summary", type: "Product Sheet" }
                ].map((item, idx) => (
                  <div key={idx} className="bg-[#05080E] border border-slate-800 p-3 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-semibold text-[#00D2B4] block uppercase">{item.type}</span>
                      <h5 className="text-xs font-semibold text-white mt-0.5">{item.name}</h5>
                    </div>
                    <button onClick={() => alert("Downloading asset...")} className="p-1.5 bg-slate-800 hover:bg-[#005A36] text-white rounded-lg transition-colors">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="bg-[#05080E] border border-slate-800 p-5 rounded-xl text-center space-y-2">
                <Phone className="w-5 h-5 text-[#00D2B4] mx-auto" />
                <h4 className="text-sm font-bold text-white">Direct Partner Line</h4>
                <p className="text-slate-400 text-xs">Call or text Roger directly regarding referrals.</p>
                <button 
                  onClick={() => triggerTextMsg("Partner inquiry regarding client setup")} 
                  className="inline-block bg-[#005A36] text-white px-5 py-2.5 rounded-full font-bold text-xs border border-emerald-400/30 animate-wobble"
                >
                  Text Roger: {PHONE_NUMBER}
                </button>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

// --- Hardware Spec Modal ---
const HardwareModal = ({ product, onClose }) => {
  if (!product) return null;
  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-[#05080E]/90 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white text-slate-900 rounded-2xl p-6 sm:p-8 z-[610] shadow-2xl space-y-5">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 p-2">
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col sm:flex-row items-center gap-5">
          <img src={product.img} alt={product.name} className="w-28 h-28 object-contain shrink-0" />
          <div>
            <span className="text-xs font-bold uppercase text-[#007A48] tracking-widest">Vivint Equipment</span>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{product.name}</h3>
            <p className="text-slate-600 text-xs mt-1 leading-relaxed">{product.longDesc}</p>
          </div>
        </div>

        <div className="space-y-2 border-t border-slate-100 pt-4">
          {product.features.map((feat, idx) => (
            <div key={idx} className="flex items-center space-x-2 text-xs font-medium text-slate-700">
              <Check className="w-4 h-4 text-[#007A48]" />
              <span>{feat}</span>
            </div>
          ))}
        </div>

        <button 
          onClick={() => { onClose(); triggerTextMsg(`Hardware Quote for ${product.name}`); }}
          className="w-full py-3.5 bg-[#005A36] hover:bg-[#007A48] text-white rounded-full font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 animate-wobble shadow-lg shadow-emerald-950/20"
        >
          <MessageSquare className="w-4 h-4" />
          <span>TEXT ROGER ABOUT {product.name.toUpperCase()}</span>
        </button>
      </div>
    </div>
  );
};

// --- MAIN LANDING PAGE ---
export default function App() {
  const [partnerModalOpen, setPartnerModalOpen] = useState(false);
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showBottomBar, setShowBottomBar] = useState(true);

  return (
    <div className="bg-[#05080E] text-white min-h-screen font-sans antialiased selection:bg-[#00D2B4]/30 overflow-x-hidden pb-24">

      {/* --- VIVINT VERIFICATION PAGE STYLES & SEESAW ANIMATION --- */}
      <style>{`
        @keyframes seesaw {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-2.5deg); }
          75% { transform: rotate(2.5deg); }
        }
        .animate-wobble:hover {
          animation: seesaw 0.8s ease-in-out infinite;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          letter-spacing: -0.01em;
        }
      `}</style>

      {/* --- HEADER (MATCHES VIVINT VERIFICATION HEADER) --- */}
      <header className="bg-[#05080E]/95 backdrop-blur-md border-b border-white/10 sticky top-0 z-[390] px-5 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          {/* Logo & Identity */}
          <div className="flex items-center space-x-4 cursor-pointer" onClick={() => triggerTextMsg("Home Security Inquiry")}>
            <VivintLogo className="h-6 text-white" />
            <div className="hidden sm:block border-l border-white/20 pl-3">
              <span className="text-[11px] font-bold text-slate-300 tracking-wider uppercase block">Roger Reed</span>
              <span className="text-[9px] text-[#00D2B4] tracking-widest uppercase">Smart Home Expert</span>
            </div>
          </div>

          {/* Quick Contact & Partner Portal */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setOfferModalOpen(true)}
              className="hidden md:inline-flex items-center space-x-1.5 text-xs font-bold text-amber-300 hover:text-white bg-gradient-to-r from-emerald-950 to-[#0D111A] border border-amber-400/40 px-3.5 py-1.5 rounded-full transition-colors shadow-sm"
            >
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              <span>Promo Offer</span>
            </button>

            <button 
              onClick={() => setPartnerModalOpen(true)}
              className="hidden sm:inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-[#0D111A] border border-slate-700 px-3.5 py-1.5 rounded-full transition-colors"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#00D2B4]" />
              <span>Partner Log In</span>
            </button>

            {/* Circular Call Button */}
            <a 
              href={`tel:${PHONE_NUMBER}`} 
              className="w-10 h-10 rounded-full bg-[#00D2B4] hover:bg-[#00baa0] text-black flex items-center justify-center transition-transform hover:scale-105 shadow-lg shadow-cyan-500/20"
              title="Call Roger"
            >
              <Phone className="w-5 h-5 fill-black text-black" />
            </a>
          </div>

        </div>
      </header>

      {/* --- HERO SECTION (MATCHES VIVINT VERIFICATION BANNER AESTHETIC) --- */}
      <section className="relative pt-16 pb-20 px-6 max-w-5xl mx-auto text-center overflow-hidden">
        
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

        {/* Small Uppercase Tracking Lead */}
        <span className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.25em] text-slate-300 mb-4 block">
          STAY INFORMED, STAY PROTECTED
        </span>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white max-w-3xl mx-auto leading-[1.12] mb-6">
          Work Directly With a <br className="hidden sm:inline" />
          <span className="text-white">Vivint Smart Home Expert.</span>
        </h1>

        {/* Supporting Subtext */}
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-normal leading-relaxed mb-10">
          Roger is Vivint's elite field specialist—handling custom system design, professional installation, and direct personal after-the-sale support.
        </p>

        {/* Primary Action Buttons: Setup Quote & View Promo Offer */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <button 
            onClick={() => triggerTextMsg("Hero Setup Quote")} 
            className="w-full sm:w-auto px-10 py-4 bg-[#005A36] hover:bg-[#007A48] text-white rounded-full font-bold text-xs uppercase tracking-widest transition-all shadow-xl shadow-emerald-950/40 border border-emerald-400/40 flex items-center justify-center space-x-2 animate-wobble"
          >
            <MessageSquare className="w-4 h-4" />
            <span>GET MY SETUP QUOTE VIA TEXT</span>
          </button>

          {/* View Promo Offer Button */}
          <button 
            onClick={() => setOfferModalOpen(true)}
            className="w-full sm:w-auto px-8 py-4 bg-[#0D111A] hover:bg-[#161f2e] text-[#00D2B4] hover:text-white rounded-full font-bold text-xs uppercase tracking-widest transition-all border border-[#00D2B4]/40 flex items-center justify-center space-x-2 shadow-lg shadow-cyan-950/20 animate-wobble"
          >
            <Sparkles className="w-4 h-4 text-[#00D2B4]" />
            <span>VIEW PROMO OFFER</span>
          </button>
        </div>

        {/* Main Hero Video Player */}
        <div className="relative rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-[#0D111A] aspect-video max-w-3xl mx-auto group">
          <iframe 
            src="https://player.mediadelivery.net/embed/587199/86db6eb7-5583-4bd9-a701-1fa49be85227?autoplay=false&loop=false&muted=false&preload=none" 
            className="w-full h-full object-cover border-none" 
            allow="accelerometer; gyroscope; encrypted-media; picture-in-picture;" 
            allowFullScreen={true}
            title="Roger Smart Home Expert Hero Video" 
          />
        </div>

      </section>

      {/* --- BLOCK 1: WHITE PANEL (TRADITIONAL PHONE-BASED VS OFFICIAL SMART HOME EXPERT) --- */}
      <section className="py-20 px-6 bg-white text-slate-900 border-y border-slate-200">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#007A48]">AUTHENTIC FIELD EXPERTISE</span>
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 mt-1">Smart Home Expert vs Phone-Based Sales</h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-2">Get direct technician oversight and personalized installation from start to finish.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Traditional Phone-Based Experience */}
            <div className="bg-slate-50 border border-slate-200 p-8 rounded-2xl space-y-4">
              <h3 className="font-bold text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200 pb-3">
                Traditional Phone-Based Experience
              </h3>

              <div className="space-y-3">
                {[
                  "System recommendations handled remotely.",
                  "Limited ability to evaluate your home's layout in person.",
                  "Different teams may handle sales, installation, and support.",
                  "Standard cookie-cutter recommendations."
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-2.5 text-slate-600 text-xs leading-relaxed">
                    <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Official Vivint Smart Home Expert */}
            <div className="bg-[#05080E] text-white border-2 border-[#007A48] p-8 rounded-2xl space-y-4 shadow-2xl">
              <h3 className="font-bold text-white text-xs uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center justify-between">
                <span>Roger Reed • Official Smart Home Expert</span>
                <span className="text-[10px] text-[#00D2B4] bg-[#00D2B4]/10 px-2.5 py-0.5 rounded-full font-bold">SMART HOME EXPERT</span>
              </h3>

              <div className="space-y-3">
                {[
                  "Official Vivint Smart Home Expert authorized to set up new accounts.",
                  "3,000+ custom installations completed across Indiana & nationwide.",
                  "Architectural camera layout & proactive AI deterrence placement.",
                  "Personal cell line for direct after-the-sale field service."
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-2.5 text-slate-100 text-xs leading-relaxed font-semibold">
                    <Check className="w-4 h-4 text-[#00D2B4] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => triggerTextMsg("Official Smart Home Expert Consultation")}
                className="w-full py-3 bg-[#005A36] hover:bg-[#007A48] text-white rounded-full font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 mt-2 border border-emerald-400/30 animate-wobble"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>TEXT ROGER FOR EXPERT SETUP</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* --- VIDEO FEATURETTE: PROACTIVE DEFENSE (ABOVE HARDWARE SECTION) --- */}
      <section className="py-20 px-6 bg-[#05080E] border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#00D2B4]">SYSTEM OVERVIEW</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">See Vivint Proactive Defense in Action</h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1.5">
            Watch how our intelligent cameras and integrated sensors detect and deter threats before they happen.
          </p>
        </div>

        <div className="relative rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-[#0D111A] aspect-video max-w-3xl mx-auto">
          <iframe 
            src="https://play.vidyard.com/wocFzyrv2ZcK1ALvvdw5vA?autoplay=0&loop=1&muted=0&controls=1" 
            className="w-full h-full object-cover border-none" 
            allow="autoplay; fullscreen" 
            title="Vivint Proactive Security Overview Video" 
          />
        </div>
      </section>

      {/* --- BLOCK 2: DARK SLATE PANEL (HARDWARE LINEUP) --- */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#00D2B4]">EQUIPMENT SPECIFICATIONS</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">Vivint Smart Home Hardware</h2>
          <p className="text-slate-400 text-xs mt-1">Select any equipment item to inspect specifications or text Roger directly.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {PRODUCTS.map((prod, idx) => (
            <div 
              key={idx} 
              onClick={() => setSelectedProduct(prod)} 
              className="bg-[#0D111A] border border-slate-800 rounded-2xl p-6 hover:border-[#00D2B4] transition-all cursor-pointer group flex flex-col justify-between shadow-lg"
            >
              <div className="w-full aspect-square flex items-center justify-center p-2 mb-3">
                <img src={prod.img} alt={prod.name} className="max-h-36 object-contain group-hover:scale-105 transition-transform" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#00D2B4] uppercase tracking-wider block">{prod.name}</span>
                <p className="text-xs text-slate-300 font-medium mb-3">{prod.desc}</p>
                <span className="text-xs font-medium text-slate-400 group-hover:text-white flex items-center transition-colors">
                  <span>View Specifications</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1 text-[#00D2B4]" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- BLOCK 3: WHITE PANEL (ABOUT ROGER & DAYCARE HEROICS VIDEO) --- */}
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
            </div>

            <div className="md:col-span-7 space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#007A48]">MEET YOUR TECHNICIAN</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">Roger Reed</h2>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed font-normal">
                As a Smart Home Expert, I approach every home with custom layout logic. Rather than selling generic equipment, I evaluate property architecture and remain available as your direct technical contact after the sale.
              </p>

              <div className="bg-white border border-slate-200 p-4.5 rounded-xl space-y-2 shadow-sm">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">Documented Community Bravery</h4>
                <p className="text-slate-600 text-xs leading-relaxed italic">
                  In 2014, Roger intervened during a break-in at a Muncie, Indiana daycare, protecting children and staff before police arrived—an event covered across Indiana news outlets.
                </p>
              </div>

              {/* Daycare News Video (Autoplay disabled) */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider block">Indiana News Archive Footage</span>
                <div className="rounded-xl overflow-hidden shadow-lg aspect-video border border-slate-300 bg-black">
                  <iframe 
                    src="https://player.mediadelivery.net/embed/587199/414c828d-71ce-4777-879d-780f97f3b880?autoplay=false&loop=false&muted=false&preload=none" 
                    className="w-full h-full border-none" 
                    allow="fullscreen" 
                    title="Roger Daycare Heroics News Feature" 
                  />
                </div>
              </div>

              <div className="pt-2">
                <button 
                  onClick={() => triggerTextMsg("Consultation with Roger Reed")}
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

      {/* --- BLOCK 4: DARK SLATE PANEL (VERIFIED NEXTDOOR PROOF) --- */}
      <section className="py-16 px-6 bg-[#05080E] border-b border-white/10">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#00D2B4]">VERIFIED PROOF</span>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">Local Nextdoor Recommendations</h3>
          <p className="text-slate-400 text-xs mt-1">Click any testimonial card to view in full resolution.</p>
        </div>

        {/* Compact Grid Layout for Nextdoor Reviews */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 max-w-4xl mx-auto">
          {NEXTDOOR_REVIEWS.map((url, i) => (
            <div 
              key={i} 
              onClick={() => setSelectedReview(url)} 
              className="bg-[#0D111A] rounded-xl p-2 border border-slate-800 shadow-md cursor-pointer hover:border-[#00D2B4] transition-all hover:scale-105 flex flex-col items-center group relative overflow-hidden"
            >
              <img 
                src={url} 
                alt={`Nextdoor Review ${i + 1}`} 
                className="w-full h-28 sm:h-32 object-cover object-top rounded-lg" 
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                <Maximize2 className="w-5 h-5 text-[#00D2B4]" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- BLOCK 5: WHITE PANEL (FINAL CTA) --- */}
      <section className="py-20 px-6 bg-white text-slate-900 text-center">
        <div className="max-w-xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#007A48]">GET STARTED</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Ready To Design Your System?</h2>
          <p className="text-slate-600 text-xs font-normal">
            Get direct advice and personal service from an official Vivint Smart Home Expert.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button 
              onClick={() => triggerTextMsg("Bottom Page Quote Request")} 
              className="w-full sm:w-auto px-9 py-4 bg-[#005A36] hover:bg-[#007A48] text-white rounded-full font-bold text-xs uppercase tracking-widest transition-all shadow-xl shadow-emerald-950/30 flex items-center justify-center space-x-2 animate-wobble"
            >
              <MessageSquare className="w-4 h-4" />
              <span>GET MY SETUP QUOTE VIA TEXT</span>
            </button>
            <button 
              onClick={() => setOfferModalOpen(true)}
              className="w-full sm:w-auto px-8 py-4 bg-[#0D111A] hover:bg-[#161f2e] text-[#00D2B4] hover:text-white rounded-full font-bold text-xs uppercase tracking-widest transition-all border border-[#00D2B4]/40 flex items-center justify-center space-x-2 shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-[#00D2B4]" />
              <span>VIEW PROMO OFFER</span>
            </button>
          </div>

          <div className="text-xs text-slate-500 font-medium pt-2">
            Call or text direct: <button onClick={() => triggerTextMsg("Direct Call/Text")} className="text-slate-900 font-bold hover:text-[#007A48] underline">{PHONE_NUMBER}</button>
          </div>
        </div>
      </section>

      {/* --- STICKY BOTTOM VIVINT CALL BAR --- */}
      {showBottomBar && (
        <div className="fixed bottom-0 inset-x-0 bg-[#005A36] text-white px-4 py-3 z-[500] shadow-2xl border-t border-emerald-400/30">
          <div className="max-w-md mx-auto relative flex flex-col items-center text-center">
            
            <button 
              onClick={() => setShowBottomBar(false)} 
              className="absolute top-0 right-0 text-emerald-200 hover:text-white p-1"
              title="Close Banner"
            >
              <X className="w-4 h-4" />
            </button>

            <span className="text-xs font-semibold text-white tracking-tight mb-2">
              Pro Install and $0 Activation
            </span>

            <a 
              href={`tel:${PHONE_NUMBER}`}
              className="w-full max-w-xs py-2.5 px-6 rounded-full border-2 border-white/80 bg-[#00472B] hover:bg-[#003B24] text-white font-bold text-base tracking-wide transition-all shadow-lg flex items-center justify-center space-x-2 animate-wobble"
            >
              <Phone className="w-4 h-4 fill-white" />
              <span>{PHONE_NUMBER}</span>
            </a>

          </div>
        </div>
      )}

      {/* --- PRE-APPROVED OFFER MODAL --- */}
      <PreApprovedOfferModal 
        isOpen={offerModalOpen} 
        onClose={() => setOfferModalOpen(false)} 
      />

      {/* --- VIDEO POPUP MODAL --- */}
      {showVideoModal && (
        <div className="fixed inset-0 z-[650] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#05080E]/90 backdrop-blur-sm" onClick={() => setShowVideoModal(false)} />
          <div className="relative w-full max-w-3xl bg-black rounded-2xl overflow-hidden border border-slate-800 aspect-video z-[660] shadow-2xl">
            <button 
              onClick={() => setShowVideoModal(false)}
              className="absolute top-4 right-4 text-white bg-slate-900/80 p-2 rounded-full z-10 hover:bg-slate-900"
            >
              <X className="w-5 h-5" />
            </button>
            <iframe 
              src="https://player.mediadelivery.net/embed/587199/86db6eb7-5583-4bd9-a701-1fa49be85227?autoplay=true&preload=true" 
              className="w-full h-full object-cover border-none" 
              allow="autoplay; fullscreen" 
              title="Roger Video Overview" 
            />
          </div>
        </div>
      )}

      <ReviewExpandModal 
        reviewUrl={selectedReview} 
        onClose={() => setSelectedReview(null)} 
      />

      <PartnerPortalModal 
        isOpen={partnerModalOpen} 
        onClose={() => setPartnerModalOpen(false)} 
      />

      <HardwareModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />

      {/* --- FOOTER --- */}
      <footer className="py-12 px-6 bg-[#05080E] text-slate-400 text-center border-t border-white/10 text-xs">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="flex justify-center items-center space-x-2 text-white cursor-pointer" onClick={() => triggerTextMsg("Footer Click")}>
            <VivintLogo className="h-5 text-white" />
            <span className="text-xs font-bold tracking-tight border-l border-white/20 pl-2">Roger Reed • Smart Home Expert</span>
          </div>

          <div className="flex justify-center items-center space-x-4 text-xs font-medium">
            <button onClick={() => setOfferModalOpen(true)} className="text-amber-300 hover:text-white">
              Exclusive SHX Promo Offer
            </button>
            <span className="text-slate-600">•</span>
            <button onClick={() => setPartnerModalOpen(true)} className="text-slate-300 hover:text-white">
              Partner Portal
            </button>
          </div>

          <div className="bg-[#0D111A] border border-slate-800 p-4 rounded-xl text-[11px] text-slate-300 leading-relaxed text-left max-w-lg mx-auto">
            <strong className="text-white">DISCLAIMER:</strong> TechRahj / Roger Reed is an official Vivint Smart Home Expert providing new account setup and local field support. For technical support or billing on active accounts, contact Vivint Corporate directly at <a href={`tel:${VIVINT_CORPORATE_SERVICE}`} className="text-[#00D2B4] underline">{VIVINT_CORPORATE_SERVICE}</a>.
          </div>

          <p className="text-[10px] text-slate-500">
            © 2026 TechRahj • Roger Reed Vivint Smart Home Expert
          </p>
        </div>
      </footer>

    </div>
  );
}
