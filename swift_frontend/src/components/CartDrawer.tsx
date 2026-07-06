import React, { useState } from "react";
import { X, Trash2, Plus, Minus, Tag, Check, ArrowRight } from "lucide-react";
import { CartItem } from "../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: Props) {
  const [promoCode, setPromoCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0); // decimal multiplier
  const [discountMessage, setDiscountMessage] = useState("");

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = subtotal * appliedDiscount;
  const total = subtotal - discountAmount;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === "SWIFTMIND") {
      setAppliedDiscount(0.15);
      setDiscountMessage("15% Promo applied successfully!");
    } else {
      setDiscountMessage("Invalid promo code. Try 'SWIFTMIND' (suggested by AI assistant!)");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" id="cart-drawer-container">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full border-l border-neutral-100">
          {/* Drawer Header */}
          <div className="px-6 py-6 border-b border-neutral-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-neutral-900 font-sans uppercase tracking-wider flex items-center gap-2">
              Your Atelier Bag
              {cart.length > 0 && (
                <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full font-mono">
                  {cart.length}
                </span>
              )}
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-full bg-neutral-50 hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Drawer Body (Cart Items) */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-neutral-400 py-12 space-y-4">
                <div className="p-4 bg-neutral-50 rounded-full text-neutral-300">
                  <Tag size={36} />
                </div>
                <div>
                  <p className="font-semibold text-neutral-600 text-sm">Your shopping bag is empty.</p>
                  <p className="text-xs max-w-xs mt-1">Explore our exquisite, handcrafted designs and add items to begin your aesthetic curation.</p>
                </div>
                <button
                  onClick={onClose}
                  className="mt-2 text-xs font-bold text-neutral-900 underline hover:text-neutral-600 transition-colors cursor-pointer"
                >
                  Continue Browsing
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-3 border border-neutral-100 rounded-xl hover:border-neutral-200 transition-all"
                >
                  {/* Item Image */}
                  <div className="w-20 h-20 bg-neutral-50 rounded-lg overflow-hidden border border-neutral-100 p-2 flex items-center justify-center">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="max-h-full max-w-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="font-semibold text-xs text-neutral-800 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <span className="font-bold text-xs text-neutral-900 pl-2">
                          ${(item.product.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                      {item.selectedColor && (
                        <p className="text-[10px] text-neutral-400 font-mono mt-0.5">
                          Finish: {item.selectedColor}
                        </p>
                      )}
                    </div>

                    {/* Quantity Controls & Delete */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2.5 bg-neutral-100 rounded-lg p-1">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 hover:bg-white text-neutral-500 hover:text-neutral-900 rounded transition-colors cursor-pointer"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="text-xs font-bold text-neutral-800 font-mono w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 hover:bg-white text-neutral-500 hover:text-neutral-900 rounded transition-colors cursor-pointer"
                        >
                          <Plus size={11} />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
                        title="Remove piece"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer (Checkout and Summary) */}
          {cart.length > 0 && (
            <div className="border-t border-neutral-100 px-6 py-6 space-y-4 bg-neutral-50">
              {/* Promo code application */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo Code (SWIFTMIND)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs placeholder-neutral-400 focus:outline-none focus:border-neutral-400"
                />
                <button
                  type="submit"
                  className="bg-neutral-900 text-white hover:bg-neutral-800 px-4 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </form>
              {discountMessage && (
                <p className={`text-[10px] font-mono ${appliedDiscount > 0 ? "text-emerald-600" : "text-red-500"}`}>
                  {discountMessage}
                </p>
              )}

              {/* Price Calculations */}
              <div className="space-y-1.5 border-t border-neutral-200/60 pt-4">
                <div className="flex justify-between text-xs text-neutral-500">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-xs text-emerald-600">
                    <span>Atelier Promo (-15%)</span>
                    <span>-${discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs text-neutral-500">
                  <span>Insured Shipping</span>
                  <span className="text-emerald-600 font-mono uppercase text-[10px] font-bold">Complimentary</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-neutral-900 pt-2 border-t border-dashed border-neutral-200">
                  <span>Estimated Total</span>
                  <span>${total.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Trigger */}
              <button
                onClick={onCheckout}
                className="w-full bg-neutral-900 text-white hover:bg-neutral-800 py-3.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 transition-all shadow-lg cursor-pointer mt-2"
              >
                Proceed to Secure Checkout
                <ArrowRight size={15} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
