import React from 'react';
import { Product } from '../types';
import { ShoppingCart, CheckCircle2, MessageSquare, Shield, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { BUSINESS_INFO } from '../data/initialData';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  isInCart?: boolean;
  index?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onViewDetails,
  isInCart,
  index = 0,
}) => {
  const whatsappUrl = `https://wa.me/${BUSINESS_INFO.whatsapp}?text=${encodeURIComponent(
    `Hello Rissau Auto Agency, I want to order/inquire about: ${product.name} (Part No: ${product.partNumber || 'N/A'}) priced at KES ${product.price.toLocaleString()}. Is it in stock at Kirinyaga Rd or Umoja?`
  )}`;

  const displayIndex = (index + 1).toString().padStart(2, '0');

  return (
    <div
      id={`product-card-${product.id}`}
      className="relative group bg-[#111111] overflow-hidden border border-zinc-800 flex flex-col justify-between p-6 sm:p-7 hover:border-orange-500/80 transition-all duration-300"
    >
      {/* Giant Index Watermark in Top-Right */}
      <div className="absolute top-0 right-0 p-4 pointer-events-none select-none">
        <span className="text-[80px] sm:text-[90px] font-black text-white/5 leading-none font-display tracking-tighter group-hover:text-orange-500/10 transition-colors">
          {displayIndex}
        </span>
      </div>

      {/* Top Section: Category, Genuine Tag & Image */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <p className="text-orange-500 font-black uppercase text-xs tracking-widest">
            {product.category}
          </p>
          {product.isGenuine && (
            <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-zinc-800 text-zinc-300 border border-zinc-700">
              GENUINE OEM
            </span>
          )}
        </div>

        {/* Image Preview with Hover Zoom */}
        <div 
          onClick={() => onViewDetails(product)}
          className="relative h-40 sm:h-44 w-full bg-zinc-900 overflow-hidden mb-4 cursor-pointer border border-zinc-800/80 group-hover:border-zinc-700 transition-colors"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent opacity-60"></div>
          
          <div className="absolute bottom-2.5 right-2.5 bg-black/80 backdrop-blur-xs text-white px-2 py-1 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
            <span>View Specs</span>
            <ArrowUpRight className="w-3 h-3 text-orange-500" />
          </div>
        </div>

        {/* Brand & Part Number */}
        <div className="flex items-center justify-between text-[11px] font-bold text-zinc-500 mb-1 uppercase tracking-wider">
          <span className="text-zinc-400">{product.brand}</span>
          {product.partNumber && (
            <span className="font-mono text-[10px] text-zinc-500 bg-zinc-900 px-1.5 py-0.5 border border-zinc-800">
              {product.partNumber}
            </span>
          )}
        </div>

        {/* Massive Bold Title */}
        <h2
          onClick={() => onViewDetails(product)}
          className="text-xl sm:text-2xl font-black leading-tight uppercase font-display text-white group-hover:text-orange-400 cursor-pointer transition-colors line-clamp-2"
        >
          {product.name}
        </h2>

        {/* Short Subtitle / Vehicle Fit */}
        <p className="text-zinc-400 text-xs mt-2 font-medium line-clamp-2">
          {product.compatibleVehicles?.slice(0, 3).join(' • ') || product.description}
        </p>

        {/* Stock status indicator */}
        <div className="mt-3 flex items-center gap-2">
          {product.stock > 0 ? (
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {product.stock} Units In Stock
            </span>
          ) : (
            <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Bottom Section: Price & Bold Buttons */}
      <div className="mt-6 pt-4 border-t border-zinc-800/80">
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <span className="text-[10px] uppercase font-black tracking-widest text-zinc-500 block">
              Price
            </span>
            <p className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
              Ksh {product.price.toLocaleString()}
            </p>
          </div>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-zinc-500 line-through font-bold">
              Ksh {product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        <div className="space-y-2">
          <button
            onClick={() => onAddToCart(product)}
            disabled={product.stock <= 0}
            className={`w-full py-3.5 font-black uppercase tracking-tighter text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              product.stock <= 0
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : isInCart
                ? 'bg-orange-500 text-black'
                : 'bg-white text-black hover:bg-orange-500 hover:text-black'
            }`}
          >
            {isInCart ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Added To Cart</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>Add To Cart</span>
              </>
            )}
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span>WhatsApp Inquiry</span>
          </a>
        </div>
      </div>
    </div>
  );
};
