import React from 'react';
export const PHONE_NUMBER = '463-281-3454';
export const VIVINT_CORPORATE_SERVICE = '800-216-5232';
export const INSTAGRAM_URL = 'https://www.instagram.com/rogerwithvivint';
export const TIKTOK_URL = 'https://www.tiktok.com/@rogerwithvivint';
export const SOCIAL_HANDLE = '@rogerwithvivint';
export const IMG_RAHJ_PROFILE = 'https://images.travelprox.com/techrahj/Rahjvivint.png';
export const IMG_PRO_INSTALL = 'https://www.vivint.com/sites/default/files/styles/desktop_1600_hq/public/image/2024-01/ProInstall-1-Full-1600.jpg.webp?itok=FY9zy1nT';
export const triggerTextMsg = (note = 'a smart home consultation') => {
  window.location.href = `sms:14632813454?body=${encodeURIComponent('I saw your website and I am interested in: ' + note)}`;
};
export const VivintLogo = ({ className = "h-6 text-white" }) => (
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

export const InstagramIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export const TikTokIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743 2.89 2.89 0 0 1 2.31-4.646c.307 0 .604.05.882.138V9.373a6.34 6.34 0 0 0-.882-.063C5.975 9.31 3 12.284 3 15.792 3 19.3 5.975 22.274 9.483 22.274c3.509 0 6.484-2.974 6.484-6.482V8.92a8.18 8.18 0 0 0 4.757 1.503v-3.47a4.83 4.83 0 0 1-1.135-.267z" />
  </svg>
);

export const PRODUCTS = [
  {
    name: "Outdoor Camera Pro",
    desc: "Outdoor protection",
    img: "https://www.vivint.com/sites/default/files/styles/square_hq_280x280/public/image/2026-02/Image_4.png.webp?itok=PQmCh1nt",
    longDesc: "Explore outdoor camera coverage and deterrence options with a layout designed for your home. Roger can confirm the current model and supported features.",
    features: ["Outdoor camera placement", "Deterrence options", "Connected home viewing"]
  },
  {
    name: "Doorbell Camera Pro",
    desc: "Front-door awareness",
    img: "https://www.vivint.com/sites/default/files/styles/square_hq_280x280/public/image/2022-07/Carousel-DBC-Desktop.png.webp?itok=Sbl-kZmg",
    longDesc: "See who is at your front door and talk with Roger about porch coverage and package-awareness features for the current model.",
    features: ["Front-door camera coverage", "Visitor awareness", "Connected home viewing"]
  },
  {
    name: "Smart Lock",
    desc: "Keyless Access",
    img: "https://www.vivint.com/sites/default/files/styles/square_hq_280x280/public/image/2023-12/Carousel-lock.png.webp?itok=QqCU9qG3",
    longDesc: "Explore keyless access and connected lock options. Roger can help you check door compatibility and plan access for your household.",
    features: ["Keyless entry options", "Household access planning", "Door compatibility consultation"]
  },
  {
    name: "Vivint Smart Hub",
    desc: "Command Center",
    img: "https://www.vivint.com/sites/default/files/styles/square_hq_280x280/public/image/2023-12/Carousel_smartcontrol.png.webp?itok=08uMPQGz",
    longDesc: "A central place to interact with your Vivint system. Ask Roger how the hub connects the equipment selected for your home.",
    features: ["Central system controls", "Connected equipment", "Personal installation walkthrough"]
  },
  {
    name: "Smart Thermostat",
    desc: "Comfort & control",
    img: "https://www.vivint.com/sites/default/files/styles/square_hq_280x280/public/image/2023-07/Thermostat-Carousel.png.webp?itok=WPdRZrNu",
    longDesc: "Explore connected temperature control for your home. Roger can confirm HVAC compatibility and available settings before installation.",
    features: ["Connected climate control", "Temperature settings", "HVAC compatibility consultation"]
  },
  {
    name: "Water & Freeze Sensor",
    desc: "Water & temperature alerts",
    img: "https://www.vivint.com/sites/default/files/image/2024-07/productViewAll_water_sensor.png",
    longDesc: "Talk with Roger about monitoring areas where water leaks or cold temperatures are a concern, and confirm placement and alert options.",
    features: ["Leak awareness", "Cold-temperature awareness", "Sensor placement planning"]
  }
];

export const NEXTDOOR_REVIEWS = [
  "https://images.travelprox.com/techrahj/nd1.png",
  "https://images.travelprox.com/techrahj/nd2.png",
  "https://images.travelprox.com/techrahj/nd3.png",
  "https://images.travelprox.com/techrahj/nd4.png",
  "https://images.travelprox.com/techrahj/nd5.png"
];
