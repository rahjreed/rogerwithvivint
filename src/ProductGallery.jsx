import React from 'react';
import { ChevronRight } from 'lucide-react';
import { PRODUCTS } from './brand.jsx';

export default function ProductGallery({ onSelect }) {
  return <div className="product-gallery grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    {PRODUCTS.map(product => <button type="button" key={product.name} onClick={() => onSelect(product)} className="bg-[#0D111A] border border-slate-800 rounded-2xl p-6 hover:border-[#00D2B4] transition-all cursor-pointer group flex flex-col justify-between shadow-lg">
      <div className="w-full aspect-square flex items-center justify-center p-2 mb-3"><img src={product.img} alt={product.name} className="max-h-36 object-contain group-hover:scale-105 transition-transform" /></div>
      <div><span className="text-xs font-bold text-[#00D2B4] uppercase tracking-wider block">{product.name}</span><p className="text-xs text-slate-300 font-medium mb-3">{product.desc}</p><span className="text-xs font-medium text-slate-400 group-hover:text-white flex items-center transition-colors"><span>View Details</span><ChevronRight className="w-3.5 h-3.5 ml-1 text-[#00D2B4]" /></span></div>
    </button>)}
  </div>;
}
