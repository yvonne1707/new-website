import React from 'react';
import { Product } from '../types';
import { X, ShoppingCart, Check, ShieldCheck, Truck, Phone, MessageSquare, AlertCircle, Wrench } from 'lucide-react';
import { BUSINESS_INFO } from '../data/initialData';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  isInCart?: boolean;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  onClose,
  onAddToCart,
  isInCart,
}) => {
  if (!product) return null;

  const whatsappInquiryUrl = `https://wa.me/${BUSINESS_INFO.whatsapp}?text=${encodeURIComponent(
    `Hello Rissau Auto Agency, I am interested in ${product.name} (Part No: ${product.partNumber || 'N/A'}). Please confirm availability at your Kirinyaga Rd or Umoja shop.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div 
        id="product-details-modal"
        className="relative bg-[#111111] text-white w-full max-w-3xl max-h-[92vh] overflow-y-auto border border-zinc-800 shadow-2xl p-6 sm:p-8"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 bg-zinc-900 hover:bg-orange-500 hover:text-black text-zinc-400 flex items-center justify-center border border-zinc-800 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Left Column: Product Image & Badges */}
          <div className="space-y-4">
            <div className="relative h-64 sm:h-72 w-full bg-zinc-900 border border-zinc-800 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-orange-500 text-black px-3 py-1 text-xs font-black uppercase tracking-wider">
                {product.category}
              </div>
            </div>

            {/* Guarantees Box */}
            <div className="bg-zinc-900/80 p-4 border border-zinc-800 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-zinc-300 font-bold uppercase tracking-wider text-[11px]">
                <ShieldCheck className="w-4 h-4 text-orange-500" />
                <span>{product.warranty || '1 Year Manufacturer Warranty'}</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-300 font-bold uppercase tracking-wider text-[11px]">
                <Truck className="w-4 h-4 text-orange-500" />
                <span>Same-Day Nairobi &amp; Countrywide Dispatch</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-300 font-bold uppercase tracking-wider text-[11px]">
                <Wrench className="w-4 h-4 text-orange-500" />
                <span>Fitting Assistance at Umoja &amp; Kirinyaga Rd</span>
              </div>
            </div>
          </div>

          {/* Right Column: Specifications & Actions */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <p className="text-orange-500 font-black uppercase text-xs tracking-widest">
                  {product.brand}
                </p>
                <h2 className="text-2xl sm:text-3xl font-black uppercase font-display text-white mt-1 leading-tight">
                  {product.name}
                </h2>
                {product.partNumber && (
                  <p className="text-xs font-mono text-zinc-400 mt-1">
                    OEM Part No: <span className="text-white font-bold">{product.partNumber}</span>
                  </p>
                )}
              </div>

              {/* Price Banner */}
              <div className="bg-[#050505] p-4 border border-zinc-800 flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] uppercase font-black tracking-widest text-zinc-500 block">
                    Cash &amp; M-Pesa Price
                  </span>
                  <span className="text-3xl font-black text-white font-display">
                    Ksh {product.price.toLocaleString()}
                  </span>
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                  {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
                </span>
              </div>

              {/* Description */}
              <div className="space-y-1 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                <p className="font-bold text-white uppercase text-[11px] tracking-wider">
                  Description &amp; Fitment Details:
                </p>
                <p>{product.description}</p>
              </div>

              {/* Compatible Vehicles */}
              {product.compatibleVehicles && product.compatibleVehicles.length > 0 && (
                <div className="space-y-2">
                  <p className="font-bold text-white uppercase text-[11px] tracking-wider">
                    Compatible Car Models:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {product.compatibleVehicles.map((car, idx) => (
                      <span
                        key={idx}
                        className="bg-zinc-900 border border-zinc-800 text-zinc-300 px-2.5 py-1 text-xs font-bold uppercase tracking-wider"
                      >
                        {car}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-4 border-t border-zinc-800">
              <button
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                disabled={product.stock <= 0}
                className={`w-full py-4 font-black uppercase tracking-tighter text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  product.stock <= 0
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    : isInCart
                    ? 'bg-orange-500 text-black'
                    : 'bg-white text-black hover:bg-orange-500 hover:text-black'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>{isInCart ? 'Added to Cart (View Cart)' : 'Add to Cart (Ksh ' + product.price.toLocaleString() + ')'}</span>
              </button>

              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-800 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>Ask Specialist on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
