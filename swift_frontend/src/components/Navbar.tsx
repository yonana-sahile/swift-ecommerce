import React, { useState } from "react";
import { ShoppingBag, Search, Sparkles, LayoutDashboard, Store, SlidersHorizontal } from "lucide-react";
import { CartItem } from "../types";

interface Props {
  activeView: "store" | "dashboard" | "builder";
  setActiveView: (view: "store" | "dashboard" | "builder") => void;
  cart: CartItem[];
  setIsCartOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenChat: () => void;
}

export default function Navbar({
  activeView,
  setActiveView,
  cart,
  setIsCartOpen,
  searchQuery,
  setSearchQuery,
  onOpenChat,
}: Props) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const cartItemCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-neutral-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-10">
            <button
              onClick={() => setActiveView("store")}
              className="flex items-center gap-2 group cursor-pointer"
            >
              <span className="font-sans font-bold text-2xl tracking-tight text-neutral-900 group-hover:text-neutral-700 transition-colors uppercase">
                Swift
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-900"></span>
              <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">Atelier</span>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <button
                onClick={() => {
                  setActiveView("store");
                  setShowMobileMenu(false);
                }}
                className={`flex items-center gap-1.5 py-2 text-sm font-medium transition-all cursor-pointer ${
                  activeView === "store"
                    ? "text-neutral-900 font-semibold border-b-2 border-neutral-900"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                <Store size={15} /> Storefront
              </button>
              <button
                onClick={() => {
                  setActiveView("dashboard");
                  setShowMobileMenu(false);
                }}
                className={`flex items-center gap-1.5 py-2 text-sm font-medium transition-all cursor-pointer ${
                  activeView === "dashboard"
                    ? "text-neutral-900 font-semibold border-b-2 border-neutral-900"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                <LayoutDashboard size={15} /> Analytics Dashboard
              </button>
              <button
                onClick={() => {
                  setActiveView("builder");
                  setShowMobileMenu(false);
                }}
                className={`flex items-center gap-1.5 py-2 text-sm font-medium transition-all cursor-pointer ${
                  activeView === "builder"
                    ? "text-neutral-900 font-semibold border-b-2 border-neutral-900"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                <SlidersHorizontal size={15} /> Atelier Design Lab
              </button>
            </nav>
          </div>

          {/* Quick Search and Action Icons */}
          <div className="flex items-center gap-6">
            {/* Quick Search */}
            {activeView === "store" && (
              <div className="relative hidden sm:block w-48 md:w-64">
                <input
                  type="text"
                  placeholder="Search curated collection..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-full py-2 pl-9 pr-4 text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-neutral-400 focus:bg-white transition-all duration-300"
                />
                <Search size={14} className="absolute left-3.5 top-3 text-neutral-400" />
              </div>
            )}

            {/* AI Assistant Button */}
            <button
              onClick={onOpenChat}
              className="p-2.5 bg-neutral-900 text-white rounded-full hover:bg-neutral-800 hover:scale-105 active:scale-95 transition-all cursor-pointer relative group"
              title="Open AI Concierge"
            >
              <Sparkles size={16} className="text-amber-300 animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
            </button>

            {/* Shopping Bag Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2.5 bg-neutral-50 text-neutral-900 hover:bg-neutral-100 rounded-full transition-all relative cursor-pointer"
            >
              <ShoppingBag size={18} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-neutral-950 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-bounce">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state. */}
        <div className="md:hidden flex items-center justify-center gap-6 py-2 border-t border-neutral-100">
          <button
            onClick={() => setActiveView("store")}
            className={`flex items-center gap-1.5 py-1 text-xs font-medium transition-all ${
              activeView === "store" ? "text-neutral-900 font-bold" : "text-neutral-500"
            }`}
          >
            <Store size={13} /> Store
          </button>
          <button
            onClick={() => setActiveView("dashboard")}
            className={`flex items-center gap-1.5 py-1 text-xs font-medium transition-all ${
              activeView === "dashboard" ? "text-neutral-900 font-bold" : "text-neutral-500"
            }`}
          >
            <LayoutDashboard size={13} /> Analytics
          </button>
          <button
            onClick={() => setActiveView("builder")}
            className={`flex items-center gap-1.5 py-1 text-xs font-medium transition-all ${
              activeView === "builder" ? "text-neutral-900 font-bold" : "text-neutral-500"
            }`}
          >
            <SlidersHorizontal size={13} /> Design Lab
          </button>
        </div>
      </div>
    </header>
  );
}
