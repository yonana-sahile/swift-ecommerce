import React, { useState } from "react";
import { Star, Eye, ShoppingCart, Heart } from "lucide-react";
import { Product } from "../types";

interface Props {
  key?: any;
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product, selectedColor?: string) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: number) => void;
}

export default function ProductCard({
  product,
  onSelect,
  onAddToCart,
  isWishlisted,
  onToggleWishlist
}: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colorOptions[0]?.name || "");

  return (
    <div
      className="group bg-white rounded-2xl overflow-hidden border border-neutral-100 hover:border-neutral-200 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      id={`product-card-${product.id}`}
    >
      {/* Product Image Stage */}
      <div className="relative aspect-square overflow-hidden bg-neutral-50 cursor-pointer" onClick={() => onSelect(product)}>
        <img
          src={isHovered ? product.secondaryImage : product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-700 scale-100 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5">
          <span className="bg-white/90 backdrop-blur-md text-neutral-900 text-[10px] font-semibold font-mono tracking-widest px-2.5 py-1 rounded-full border border-neutral-100 shadow-sm uppercase">
            {product.category}
          </span>
          {product.stock <= 5 && (
            <span className="bg-red-500 text-white text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full shadow-sm uppercase animate-pulse">
              Only {product.stock} left
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-md border border-neutral-100 shadow-sm text-neutral-400 hover:text-red-500 transition-colors z-20"
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={14} className={isWishlisted ? "fill-red-500 text-red-500 scale-110" : ""} />
        </button>

        {/* Quick Actions Hover Mask */}
        <div className="absolute inset-0 bg-neutral-950/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="p-3 bg-white text-neutral-900 rounded-full hover:bg-neutral-50 hover:scale-110 transition-all shadow-lg cursor-pointer"
            title="Quick View"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product, selectedColor);
            }}
            className="p-3 bg-white text-neutral-900 rounded-full hover:bg-neutral-50 hover:scale-110 transition-all shadow-lg cursor-pointer"
            title="Add to Bag"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>

      {/* Content details */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                className={i < Math.floor(product.rating) ? "text-amber-400" : "text-neutral-200"}
              />
            ))}
          </div>
          <span className="text-[11px] font-mono font-medium text-neutral-500">
            {product.rating} ({product.reviewsCount})
          </span>
        </div>

        {/* Title */}
        <h3
          className="font-sans font-semibold text-base text-neutral-900 hover:text-neutral-600 transition-colors cursor-pointer line-clamp-1 mb-1"
          onClick={() => onSelect(product)}
        >
          {product.name}
        </h3>

        {/* Short Description */}
        <p className="text-xs text-neutral-400 line-clamp-2 mb-4 flex-grow">
          {product.description}
        </p>

        {/* Footer info: color selector & price */}
        <div className="flex items-center justify-between border-t border-neutral-50 pt-4 mt-auto">
          {/* Colors Selection Preview */}
          <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
            {product.colorOptions.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color.name)}
                className={`w-4 h-4 rounded-full border transition-all ${
                  selectedColor === color.name
                    ? "ring-2 ring-offset-2 ring-neutral-900 border-transparent"
                    : "border-neutral-200 hover:scale-110"
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>

          {/* Price */}
          <span className="font-sans font-bold text-lg text-neutral-900">
            ${product.price.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
