import React, { useState } from "react";
import { Sparkles, Check, Plus, ShoppingBag, ArrowRight, Laptop, Keyboard, Headphones, HelpCircle, Monitor } from "lucide-react";
import { Product } from "../types";

interface Props {
  products: Product[];
  onAddBundleToCart: (products: Product[]) => void;
}

export default function AtelierSetupBuilder({ products, onAddBundleToCart }: Props) {
  // Find specific components for the builder
  const deskShelves = products.filter((p) => p.id === 1 || p.id === 4); // Desk shelf or Lamp
  const keyboards = products.filter((p) => p.id === 5); // Keyboard
  const accessories = products.filter((p) => p.id === 2 || p.id === 6 || p.id === 3); // Headphones, MagSafe, Laptop Sleeve

  // Selection states
  const [selectedShelf, setSelectedShelf] = useState<Product | null>(products.find((p) => p.id === 1) || null);
  const [selectedKeyboard, setSelectedKeyboard] = useState<Product | null>(products.find((p) => p.id === 5) || null);
  const [selectedAccessory, setSelectedAccessory] = useState<Product | null>(products.find((p) => p.id === 2) || null);

  // Active color options for selections
  const [shelfColor, setShelfColor] = useState(selectedShelf?.colorOptions?.[0]?.name || "Natural");
  const [keyboardColor, setKeyboardColor] = useState(selectedKeyboard?.colorOptions?.[0]?.name || "Default");
  const [accessoryColor, setAccessoryColor] = useState(selectedAccessory?.colorOptions?.[0]?.name || "Default");

  // Calculations
  const selectedItems = [selectedShelf, selectedKeyboard, selectedAccessory].filter((item): item is Product => item !== null);
  const subtotal = selectedItems.reduce((sum, item) => sum + item.price, 0);
  const discountRate = selectedItems.length >= 3 ? 0.15 : selectedItems.length === 2 ? 0.08 : 0;
  const discountAmount = Math.round(subtotal * discountRate);
  const total = subtotal - discountAmount;

  const handleAddBundle = () => {
    if (selectedItems.length === 0) return;
    onAddBundleToCart(selectedItems);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-10" id="atelier-builder-root">
      {/* Header */}
      <div className="border-b border-neutral-100 pb-6 text-center md:text-left">
        <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 bg-neutral-100 px-3 py-1 rounded-full uppercase">
          Interactive Design Lab
        </span>
        <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight mt-3">Atelier Custom Setup Builder</h1>
        <p className="text-xs text-neutral-400 font-mono uppercase tracking-wider mt-1">
          Combine premium hardwoods, CNC accessories, and hi-fi audio. Curate 3 pieces to unlock 15% Bundle Discount.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Real-time 2D Minimalist Visual Mockup of the Desk */}
        <div className="lg:col-span-5 bg-neutral-900 rounded-3xl p-8 text-white relative shadow-2xl overflow-hidden aspect-square flex flex-col justify-between border border-neutral-800">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

          {/* Header info */}
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <span className="text-[9px] font-mono tracking-widest uppercase text-amber-300 font-bold flex items-center gap-1.5">
                <Sparkles size={11} /> Real-time Render
              </span>
              <h3 className="font-sans font-bold text-sm text-neutral-200 mt-1">Your Curated Workspace</h3>
            </div>
            <div className="text-right">
              {discountRate > 0 && (
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                  -{Math.round(discountRate * 100)}% Setup Discount
                </span>
              )}
            </div>
          </div>

          {/* Setup Visualizer Workspace Area */}
          <div className="flex-1 flex flex-col justify-center items-center relative py-10 min-h-[250px]">
            {/* Monitor Silhouette in the background */}
            <div className="w-48 h-28 border border-neutral-800 rounded-lg bg-neutral-950/40 relative flex items-center justify-center transition-all duration-500 animate-pulse">
              <Monitor size={44} className="text-neutral-800" />
              <div className="absolute bottom-[-16px] w-12 h-4 bg-neutral-800 rounded-b-md"></div>
            </div>

            {/* Shelf Level Container */}
            <div className="w-full flex flex-col items-center mt-6 relative z-15">
              {selectedShelf ? (
                <div
                  className="w-72 h-4 rounded-t-md transition-all duration-500 shadow-md flex items-center justify-center text-[8px] font-mono text-neutral-900 font-bold"
                  style={{
                    backgroundColor: selectedShelf.id === 1
                      ? (shelfColor.includes("Charcoal") ? "#4C3F35" : "#E8D8C8")
                      : "#718096"
                  }}
                >
                  <span className="opacity-40">{selectedShelf.name}</span>
                </div>
              ) : (
                <div className="w-72 h-1 border-t border-dashed border-neutral-800"></div>
              )}

              {/* Shelf legs / space under shelf */}
              {selectedShelf && selectedShelf.id === 1 && (
                <div className="w-64 h-8 flex justify-between px-4">
                  <div className="w-2 bg-neutral-600 h-full"></div>
                  <div className="w-2 bg-neutral-600 h-full"></div>
                </div>
              )}
            </div>

            {/* Desktop Surface line */}
            <div className="w-full h-1.5 bg-neutral-800 mt-1 relative z-10 rounded"></div>

            {/* Keyboard Layout on top of the desk */}
            <div className="absolute bottom-12 z-20 flex justify-center items-center">
              {selectedKeyboard ? (
                <div
                  className="w-36 h-8 rounded-md flex items-center justify-center gap-1.5 px-2 border transition-all duration-300 shadow-lg text-[9px] font-mono font-bold uppercase"
                  style={{
                    backgroundColor: keyboardColor.includes("Void") ? "#1A202C" : keyboardColor.includes("Sage") ? "#8FBC8F" : "#718096",
                    borderColor: "#333",
                    color: keyboardColor.includes("Void") ? "#FFF" : "#1A202C"
                  }}
                >
                  <Keyboard size={12} />
                  <span>Modus</span>
                </div>
              ) : null}
            </div>

            {/* Accessories Placement Left/Right */}
            <div className="absolute bottom-16 right-6 z-20">
              {selectedAccessory && selectedAccessory.id === 2 && (
                <div className="p-2 bg-neutral-800 rounded-full text-amber-300 shadow-md flex items-center justify-center border border-neutral-700 animate-bounce">
                  <Headphones size={16} />
                </div>
              )}
            </div>

            <div className="absolute bottom-14 left-8 z-20">
              {selectedAccessory && selectedAccessory.id === 6 && (
                <div className="w-8 h-10 bg-neutral-800 rounded-md border border-neutral-700 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full border border-neutral-600 bg-neutral-900 flex items-center justify-center text-[6px]">⚡</div>
                </div>
              )}
              {selectedAccessory && selectedAccessory.id === 3 && (
                <div className="w-12 h-6 bg-amber-800 rounded-sm shadow border border-amber-900 flex items-center justify-center text-[7px] text-amber-200 uppercase font-bold font-mono">
                  Sleeve
                </div>
              )}
            </div>
          </div>

          {/* Footer list summary of active bundle */}
          <div className="border-t border-neutral-800 pt-4 flex justify-between items-end">
            <div className="text-xs space-y-1">
              <span className="text-[10px] font-mono text-neutral-400">Selected Items:</span>
              <div className="flex flex-wrap gap-1.5 max-w-[280px]">
                {selectedItems.map((item) => (
                  <span key={item.id} className="bg-neutral-800 px-2 py-0.5 rounded text-[10px] text-neutral-300">
                    {item.name.split(" ")[0]}
                  </span>
                ))}
                {selectedItems.length === 0 && <span className="text-neutral-500 font-mono text-[10px]">No selections yet</span>}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[9px] font-mono text-neutral-400 block">Setup Price:</span>
              <span className="text-lg font-bold text-white">${total}</span>
              {discountAmount > 0 && <span className="text-[9px] text-amber-300 block line-through">${subtotal}</span>}
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Selection Controls */}
        <div className="lg:col-span-7 space-y-6">

          {/* STEP 1: CHOOSE HARDWOOD BASE / SHELF */}
          <div className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-mono font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
                <span className="h-5 w-5 bg-neutral-900 text-white rounded-full flex items-center justify-center text-[10px]">01</span>
                Foundation Layer
              </h4>
              <span className="text-xs font-semibold text-neutral-500">Pick wood or lamp</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {deskShelves.map((p) => {
                const isSelected = selectedShelf?.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelectedShelf(isSelected ? null : p);
                      if (p.colorOptions?.[0]) setShelfColor(p.colorOptions[0].name);
                    }}
                    className={`p-4 border rounded-xl cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? "border-neutral-900 bg-neutral-50 shadow-sm"
                        : "border-neutral-150 hover:border-neutral-300 bg-white"
                    }`}
                  >
                    <div className="flex gap-3 items-center">
                      <div className="w-10 h-10 bg-neutral-50 rounded-lg p-1 flex items-center justify-center border border-neutral-100 flex-shrink-0">
                        <img src={p.image} alt="" className="max-h-full max-w-full object-contain" referrerPolicy="no-referrer" />
                      </div>
                      <div className="text-xs">
                        <div className="font-bold text-neutral-950">{p.name}</div>
                        <div className="text-neutral-500 font-bold mt-0.5">${p.price}</div>
                      </div>
                    </div>
                    <div className={`p-1 rounded-full ${isSelected ? "bg-neutral-900 text-white" : "border border-neutral-300 text-transparent"}`}>
                      <Check size={12} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Wood color selection if desk shelf selected */}
            {selectedShelf && selectedShelf.colorOptions && (
              <div className="pt-2 border-t border-neutral-100 flex items-center gap-3">
                <span className="text-[10px] font-mono text-neutral-400 font-bold uppercase">Hardwood Option:</span>
                <div className="flex gap-2">
                  {selectedShelf.colorOptions.map((col) => (
                    <button
                      key={col.name}
                      onClick={() => setShelfColor(col.name)}
                      className={`px-2.5 py-1 text-[10px] rounded-lg transition-colors font-semibold ${
                        shelfColor === col.name
                          ? "bg-neutral-900 text-white"
                          : "bg-neutral-100 hover:bg-neutral-200 text-neutral-600"
                      }`}
                    >
                      {col.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* STEP 2: CHOOSE WRITING INSTRUMENT */}
          <div className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-mono font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
                <span className="h-5 w-5 bg-neutral-900 text-white rounded-full flex items-center justify-center text-[10px]">02</span>
                Keystroke Input
              </h4>
              <span className="text-xs font-semibold text-neutral-500">Pick gasket mechanicals</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {keyboards.map((p) => {
                const isSelected = selectedKeyboard?.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelectedKeyboard(isSelected ? null : p);
                      if (p.colorOptions?.[0]) setKeyboardColor(p.colorOptions[0].name);
                    }}
                    className={`p-4 border rounded-xl cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? "border-neutral-900 bg-neutral-50 shadow-sm"
                        : "border-neutral-150 hover:border-neutral-300 bg-white"
                    }`}
                  >
                    <div className="flex gap-3 items-center">
                      <div className="w-10 h-10 bg-neutral-50 rounded-lg p-1 flex items-center justify-center border border-neutral-100 flex-shrink-0">
                        <img src={p.image} alt="" className="max-h-full max-w-full object-contain" referrerPolicy="no-referrer" />
                      </div>
                      <div className="text-xs">
                        <div className="font-bold text-neutral-950">{p.name}</div>
                        <div className="text-neutral-500 font-bold mt-0.5">${p.price}</div>
                      </div>
                    </div>
                    <div className={`p-1 rounded-full ${isSelected ? "bg-neutral-900 text-white" : "border border-neutral-300 text-transparent"}`}>
                      <Check size={12} />
                    </div>
                  </div>
                );
              })}

              {/* Skip option */}
              <div
                onClick={() => setSelectedKeyboard(null)}
                className={`p-4 border rounded-xl cursor-pointer transition-all flex items-center justify-between ${
                  selectedKeyboard === null
                    ? "border-neutral-900 bg-neutral-50 shadow-sm"
                    : "border-neutral-150 hover:border-neutral-300 bg-white"
                }`}
              >
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 bg-neutral-50 rounded-lg flex items-center justify-center border border-neutral-100 flex-shrink-0 text-neutral-400 font-bold text-xs font-mono">
                    SKIP
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-neutral-950">No keyboard</div>
                    <div className="text-neutral-400 mt-0.5">Use existing peripheral</div>
                  </div>
                </div>
                <div className={`p-1 rounded-full ${selectedKeyboard === null ? "bg-neutral-900 text-white" : "border border-neutral-300 text-transparent"}`}>
                  <Check size={12} />
                </div>
              </div>
            </div>

            {/* Keyboard color options if selected */}
            {selectedKeyboard && selectedKeyboard.colorOptions && (
              <div className="pt-2 border-t border-neutral-100 flex items-center gap-3">
                <span className="text-[10px] font-mono text-neutral-400 font-bold uppercase">Keycap Theme:</span>
                <div className="flex gap-2">
                  {selectedKeyboard.colorOptions.map((col) => (
                    <button
                      key={col.name}
                      onClick={() => setKeyboardColor(col.name)}
                      className={`px-2.5 py-1 text-[10px] rounded-lg transition-colors font-semibold ${
                        keyboardColor === col.name
                          ? "bg-neutral-900 text-white"
                          : "bg-neutral-100 hover:bg-neutral-200 text-neutral-600"
                      }`}
                    >
                      {col.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* STEP 3: CHOOSE AN ACCESSORY COMPANION */}
          <div className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-mono font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
                <span className="h-5 w-5 bg-neutral-900 text-white rounded-full flex items-center justify-center text-[10px]">03</span>
                Acoustic & Power Setup
              </h4>
              <span className="text-xs font-semibold text-neutral-500">Pick active headphones or EDC</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {accessories.map((p) => {
                const isSelected = selectedAccessory?.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelectedAccessory(isSelected ? null : p);
                      if (p.colorOptions?.[0]) setAccessoryColor(p.colorOptions[0].name);
                    }}
                    className={`p-4 border rounded-xl cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? "border-neutral-900 bg-neutral-50 shadow-sm"
                        : "border-neutral-150 hover:border-neutral-300 bg-white"
                    }`}
                  >
                    <div className="flex gap-3 items-center">
                      <div className="w-10 h-10 bg-neutral-50 rounded-lg p-1 flex items-center justify-center border border-neutral-100 flex-shrink-0">
                        <img src={p.image} alt="" className="max-h-full max-w-full object-contain" referrerPolicy="no-referrer" />
                      </div>
                      <div className="text-xs">
                        <div className="font-bold text-neutral-950">{p.name.split(" ")[0]} {p.name.split(" ")[1] || ""}</div>
                        <div className="text-neutral-500 font-bold mt-0.5">${p.price}</div>
                      </div>
                    </div>
                    <div className={`p-1 rounded-full ${isSelected ? "bg-neutral-900 text-white" : "border border-neutral-300 text-transparent"}`}>
                      <Check size={12} />
                    </div>
                  </div>
                );
              })}

              {/* Skip option */}
              <div
                onClick={() => setSelectedAccessory(null)}
                className={`p-4 border rounded-xl cursor-pointer transition-all flex items-center justify-between ${
                  selectedAccessory === null
                    ? "border-neutral-900 bg-neutral-50 shadow-sm"
                    : "border-neutral-150 hover:border-neutral-300 bg-white"
                }`}
              >
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 bg-neutral-50 rounded-lg flex items-center justify-center border border-neutral-100 flex-shrink-0 text-neutral-400 font-bold text-xs font-mono">
                    SKIP
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-neutral-950">No accessory</div>
                    <div className="text-neutral-400 mt-0.5">Focus solely on workspace</div>
                  </div>
                </div>
                <div className={`p-1 rounded-full ${selectedAccessory === null ? "bg-neutral-900 text-white" : "border border-neutral-300 text-transparent"}`}>
                  <Check size={12} />
                </div>
              </div>
            </div>

            {/* Accessory colors if selected */}
            {selectedAccessory && selectedAccessory.colorOptions && (
              <div className="pt-2 border-t border-neutral-100 flex items-center gap-3">
                <span className="text-[10px] font-mono text-neutral-400 font-bold uppercase">Color/Finish:</span>
                <div className="flex gap-2">
                  {selectedAccessory.colorOptions.map((col) => (
                    <button
                      key={col.name}
                      onClick={() => setAccessoryColor(col.name)}
                      className={`px-2.5 py-1 text-[10px] rounded-lg transition-colors font-semibold ${
                        accessoryColor === col.name
                          ? "bg-neutral-900 text-white"
                          : "bg-neutral-100 hover:bg-neutral-200 text-neutral-600"
                      }`}
                    >
                      {col.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ADD TO CART ACTION BOX */}
          <div className="bg-gradient-to-tr from-neutral-900 via-neutral-950 to-neutral-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row justify-between items-center gap-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-amber-400/5 rounded-full blur-2xl"></div>
            <div className="space-y-2 text-center sm:text-left relative z-10">
              <h3 className="font-bold text-lg">Uncompromising Craftsmanship</h3>
              <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
                Each wood layer is seasoned, hand-sanded with organic beeswax, and fitted with precise, durable CNC metal supports.
              </p>
              {discountRate > 0 && (
                <div className="pt-1 flex items-center justify-center sm:justify-start gap-2">
                  <span className="bg-amber-400 text-neutral-950 font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded font-mono">
                    {Math.round(discountRate * 100)}% Discount Applied
                  </span>
                  <span className="text-xs text-amber-300 font-mono font-semibold">Saved ${discountAmount}!</span>
                </div>
              )}
            </div>

            <div className="text-center sm:text-right flex flex-col items-center sm:items-end gap-3 flex-shrink-0 w-full sm:w-auto relative z-10">
              <div>
                <span className="text-xs text-neutral-400 block font-mono">Curated Bundle Total</span>
                <span className="text-3xl font-extrabold text-white tracking-tight">${total}</span>
              </div>
              <button
                onClick={handleAddBundle}
                disabled={selectedItems.length === 0}
                className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-neutral-950 font-extrabold text-xs tracking-wider uppercase px-8 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 disabled:bg-neutral-800 disabled:text-neutral-500"
              >
                <ShoppingBag size={14} /> Add Curated Setup
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
