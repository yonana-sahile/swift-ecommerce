import React, { useState, useEffect } from "react";
import { Sparkles, ArrowRight, ShieldCheck, Heart, Github, Filter, SlidersHorizontal, Info } from "lucide-react";
import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";
import ProductDetails from "./components/ProductDetails";
import CartDrawer from "./components/CartDrawer";
import CheckoutModal from "./components/CheckoutModal";
import AIChatbot from "./components/AIChatbot";
import AtelierSetupBuilder from "./components/AtelierBuilder";
import Dashboard from "./components/Dashboard";
import { Product, CartItem, APILog } from "./types";
import { CATEGORIES } from "./data";

export default function App() {
  const [activeView, setActiveView] = useState<"store" | "dashboard" | "builder">("store");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Wishlist / Saved Curations State
  const [wishlist, setWishlist] = useState<number[]>(() => {
    const saved = localStorage.getItem("swift_wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  // Cart and Overlays
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("swift_cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortOption, setSortOption] = useState("");

  // REST API log tracer
  const [apiLogs, setApiLogs] = useState<APILog[]>([]);

  // Local Storage Save Cart & Wishlist
  useEffect(() => {
    localStorage.setItem("swift_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("swift_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const handleToggleWishlist = (productId: number) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  // Dynamic API Log Recorder
  const logAPI = (
    method: "GET" | "POST" | "PUT" | "DELETE",
    url: string,
    status: number,
    payload?: any,
    response?: any
  ) => {
    const newLog: APILog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleTimeString(),
      method,
      url,
      status,
      payload,
      response,
    };
    setApiLogs((prev) => [newLog, ...prev]);
  };

  const clearLogs = () => {
    setApiLogs([]);
  };

  // Fetch Products from express API server
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (categoryFilter !== "All") params.append("category", categoryFilter);
      if (sortOption) params.append("sort", sortOption);
      if (searchQuery) params.append("q", searchQuery);

      const url = `/api/products?${params.toString()}`;
      const response = await fetch(url);
      const data = await response.json();

      setProducts(data.results || []);
      logAPI("GET", url, response.status, undefined, data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger fetch when parameters update
  useEffect(() => {
    fetchProducts();
  }, [categoryFilter, sortOption, searchQuery]);

  // Cart Modification Handlers
  const handleAddToCart = (product: Product, selectedColor?: string) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.selectedColor === selectedColor
      );
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.selectedColor === selectedColor
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, selectedColor }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleAddBundleToCart = (bundleProducts: Product[]) => {
    setCart((prev) => {
      let updatedCart = [...prev];
      bundleProducts.forEach((product) => {
        const color = product.colorOptions?.[0]?.name || "Default";
        // Apply 15% discount to the product price for the bundle item
        const discountedProduct = {
          ...product,
          price: Math.round(product.price * 0.85),
          name: `${product.name} (Design Lab Bundle)`
        };
        const existing = updatedCart.find(
          (item) => item.product.id === product.id && item.selectedColor === color
        );
        if (existing) {
          updatedCart = updatedCart.map((item) =>
            item.product.id === product.id && item.selectedColor === color
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          updatedCart.push({ product: discountedProduct, quantity: 1, selectedColor: color });
        }
      });
      return updatedCart;
    });
    setIsCartOpen(true);
    logAPI("POST", "/api/cart/bundle", 201, { items: bundleProducts.map(p => p.id) }, { status: "bundle_added_successfully" });
  };

  // Stock replenishment logic
  const handleReplenish = (productId: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const updatedProduct = { ...p, stock: p.stock + 10 };
          logAPI("PUT", `/api/products/${productId}`, 200, { stock: updatedProduct.stock }, updatedProduct);
          return updatedProduct;
        }
        return p;
      })
    );
  };

  return (
    <div className="min-h-screen bg-neutral-50/40 text-neutral-900 selection:bg-neutral-900 selection:text-white flex flex-col justify-between">
      {/* Navigation */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        cart={cart}
        setIsCartOpen={setIsCartOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenChat={() => setIsChatOpen(true)}
      />

      {/* Main Body */}
      <main className="flex-grow">
        {activeView === "store" && (
          <div className="space-y-12">
            {/* Curated Hero Section */}
            <section className="bg-white border-b border-neutral-150 py-16 sm:py-24 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-neutral-50 via-white to-neutral-50/50 opacity-40"></div>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="space-y-6 lg:col-span-7">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 bg-neutral-100 px-3 py-1 rounded-full uppercase">
                    Autumn Atelier Drop
                  </span>
                  <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-neutral-900 leading-none">
                    Exquisite Desk & <br />
                    <span className="text-neutral-500">Audio Curations.</span>
                  </h1>
                  <p className="text-sm sm:text-base text-neutral-500 max-w-lg leading-relaxed">
                    Designed for creators, engineers, and minimalists. Every item is crafted using premium American hardwoods, lightweight CNC-machined aerospace alloy, or Horween full-grain leather.
                  </p>
                  <div className="flex flex-wrap gap-4 pt-2">
                    <button
                      onClick={() => {
                        const target = document.getElementById("catalog-section");
                        target?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold py-3.5 px-6 rounded-xl shadow-lg hover:scale-[1.01] active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      Browse Atelier Pieces <ArrowRight size={14} />
                    </button>
                    <button
                      onClick={() => setIsChatOpen(true)}
                      className="bg-neutral-50 hover:bg-neutral-100 text-neutral-800 text-xs font-bold py-3.5 px-6 rounded-xl border border-neutral-200 hover:scale-[1.01] active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Sparkles size={14} className="text-amber-500" /> Consult AI Concierge
                    </button>
                  </div>
                </div>

                {/* Hero Showcase Display card */}
                <div className="lg:col-span-5 relative">
                  <div className="absolute -inset-2 bg-gradient-to-tr from-amber-50 to-neutral-100 rounded-3xl blur-2xl opacity-50"></div>
                  <div className="relative bg-white border border-neutral-100 rounded-3xl p-6 shadow-2xl flex flex-col gap-6">
                    <div className="aspect-[4/3] bg-neutral-50 rounded-2xl overflow-hidden flex items-center justify-center border border-neutral-100/50 p-4">
                      <img
                        src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800"
                        alt="Featured Aether"
                        className="max-h-full max-w-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="text-[9px] font-mono font-semibold text-neutral-400 uppercase tracking-widest">Acoustic Audio</span>
                        <h3 className="font-sans font-bold text-lg text-neutral-900 mt-0.5">Aether Wireless Headphones</h3>
                        <p className="text-xs text-neutral-400">Lightweight CNC aerospace alloy</p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-neutral-900 block">$349</span>
                        <button
                          onClick={() => {
                            const headphones = products.find((p) => p.id === 2);
                            if (headphones) setSelectedProduct(headphones);
                          }}
                          className="text-xs font-bold text-neutral-900 underline hover:text-neutral-600 transition-colors cursor-pointer"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Saved Curations Shelf */}
            {wishlist.length > 0 && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 animate-fade-in">
                <div className="bg-neutral-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl border border-neutral-800">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl"></div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Heart size={16} className="text-red-500 fill-red-500 animate-pulse" />
                      <h3 className="font-sans font-bold text-lg">Your Saved Curations ({wishlist.length})</h3>
                    </div>
                    <button
                      onClick={() => setWishlist([])}
                      className="text-xs font-mono font-medium uppercase text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    >
                      Clear Saved
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                    {products.filter(p => wishlist.includes(p.id)).map(p => (
                      <div
                        key={p.id}
                        onClick={() => setSelectedProduct(p)}
                        className="bg-neutral-950/40 border border-neutral-800 rounded-2xl p-3 text-center cursor-pointer hover:border-neutral-700 transition-all group relative"
                      >
                        <div className="aspect-square bg-neutral-900 rounded-xl overflow-hidden mb-2 p-1 flex items-center justify-center">
                          <img src={p.image} alt={p.name} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" />
                        </div>
                        <h4 className="text-xs font-bold text-neutral-200 line-clamp-1 group-hover:text-white">{p.name}</h4>
                        <span className="text-[10px] font-mono font-semibold text-neutral-500 mt-1 block">${p.price}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(p);
                          }}
                          className="mt-2 w-full bg-white text-neutral-950 hover:bg-neutral-100 font-extrabold text-[9px] py-1.5 px-2 rounded-lg uppercase tracking-wider transition-colors"
                        >
                          Add to Bag
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Catalog Filter Bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="catalog-section">
              <div className="bg-white border border-neutral-100 rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                {/* Category filters */}
                <div className="flex items-center gap-2 overflow-x-auto select-none no-scrollbar">
                  <Filter size={14} className="text-neutral-400 flex-shrink-0" />
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                        categoryFilter === cat
                          ? "bg-neutral-900 text-white shadow-md shadow-neutral-950/10"
                          : "bg-neutral-50 hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Sorters and active counts */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal size={14} className="text-neutral-400" />
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-600 font-semibold focus:outline-none focus:border-neutral-400 cursor-pointer"
                    >
                      <option value="">Sort: Curated</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Ratings: Highest first</option>
                      <option value="name">Alphabetical</option>
                    </select>
                  </div>
                  <span className="text-xs font-mono font-medium text-neutral-400 uppercase hidden sm:block">
                    {products.length} dynamic results
                  </span>
                </div>
              </div>
            </div>

            {/* Product Catalog Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[...Array(4)].map((_, idx) => (
                    <div key={idx} className="bg-white border border-neutral-100 rounded-2xl p-5 space-y-4 animate-pulse">
                      <div className="aspect-square bg-neutral-100 rounded-xl"></div>
                      <div className="h-4 bg-neutral-100 rounded w-2/3"></div>
                      <div className="h-3 bg-neutral-100 rounded w-1/2"></div>
                      <div className="h-5 bg-neutral-100 rounded w-1/3 pt-4"></div>
                    </div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-24 bg-white border border-neutral-100 rounded-3xl space-y-3">
                  <Info size={32} className="mx-auto text-neutral-300" />
                  <h3 className="font-bold text-neutral-800">No matching products found.</h3>
                  <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                    We couldn't find any artisan pieces with those filters. Try selecting a different category or refining your search.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onSelect={(p) => setSelectedProduct(p)}
                      onAddToCart={(p, color) => handleAddToCart(p, color)}
                      isWishlisted={wishlist.includes(product.id)}
                      onToggleWishlist={handleToggleWishlist}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* Analytics View */}
        {activeView === "dashboard" && (
          <Dashboard
            products={products}
            onReplenish={handleReplenish}
            logAPI={logAPI}
          />
        )}

        {/* Atelier Setup Builder View */}
        {activeView === "builder" && (
          <AtelierSetupBuilder
            products={products}
            onAddBundleToCart={handleAddBundleToCart}
          />
        )}
      </main>

      {/* Overlays and Modals */}
      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(p, color) => handleAddToCart(p, color)}
          logAPI={logAPI}
          isWishlisted={wishlist.includes(selectedProduct.id)}
          onToggleWishlist={handleToggleWishlist}
        />
      )}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {isCheckoutOpen && (
        <CheckoutModal
          cart={cart}
          onClose={() => setIsCheckoutOpen(false)}
          onClearCart={handleClearCart}
          logAPI={logAPI}
        />
      )}

      {/* Floating AI Assistant */}
      <AIChatbot
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onOpen={() => setIsChatOpen(true)}
        logAPI={logAPI}
      />

      {/* Curated Footer */}
      <footer className="bg-white border-t border-neutral-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-neutral-500 text-xs font-mono font-medium">
            <span>© 2026 SWIFT ATELIER CO.</span>
            <span className="w-1 h-1 rounded-full bg-neutral-300"></span>
            <span>All rights reserved.</span>
          </div>

          <div className="flex items-center gap-3 text-xs font-medium text-neutral-400">
            <span>React 19</span>
            <span>•</span>
            <span>TypeScript</span>
            <span>•</span>
            <span>Vite</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-500 font-semibold font-mono">
              <ShieldCheck size={14} /> DRF Simulated Core
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
