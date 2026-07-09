import React, { useState, useEffect } from "react";
import { Package, LineChart, CheckCircle, RefreshCcw, DollarSign, AlertTriangle, ArrowUpRight, TrendingUp } from "lucide-react";
import { Product, Order } from "../types";

interface Props {
  products: Product[];
  onReplenish: (productId: number) => void;
  logAPI: (method: "GET" | "POST" | "PUT" | "DELETE", url: string, status: number, payload?: any, response?: any) => void;
}

export default function Dashboard({ products, onReplenish, logAPI }: Props) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const url = "/api/orders";
      const response = await fetch(url);
      const data = await response.json();
      setOrders(data);
      logAPI("GET", url, response.status, undefined, data);
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [products]);

  // Aggregate stats
  const totalRevenue = orders.reduce((acc, curr) => acc + curr.total, 0);
  const lowStockProducts = products.filter((p) => p.stock <= 5);
  const totalStockItems = products.reduce((acc, curr) => acc + curr.stock, 0);

  // Custom visual SVG chart data (e.g., past 5 orders, or category distribution)
  const categories = Array.from(new Set(products.map((p) => p.category)));
  const categoryData = categories.map((cat) => {
    const count = products.filter((p) => p.category === cat).length;
    return { name: cat, count };
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8" id="admin-dashboard-root">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-100 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Atelier Analytics Board</h1>
          <p className="text-xs text-neutral-400 font-mono uppercase tracking-wider mt-1">
            Real-time backend telemetry & inventory parameters
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="px-4 py-2 border border-neutral-200 hover:border-neutral-900 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer text-neutral-700 hover:text-neutral-900"
        >
          <RefreshCcw size={14} className={isLoading ? "animate-spin" : ""} />
          Sync REST Database
        </button>
      </div>

      {/* Grid of four key KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue Card */}
        <div className="bg-white border border-neutral-100 p-6 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold">Total Sales Revenue</p>
            <h3 className="text-2xl font-bold text-neutral-900">${totalRevenue.toLocaleString()}</h3>
            <p className="text-[10px] text-emerald-600 flex items-center gap-0.5">
              <TrendingUp size={12} /> +12.4% over benchmark
            </p>
          </div>
          <div className="p-4 bg-neutral-950 text-white rounded-2xl shadow-md shadow-neutral-950/5">
            <DollarSign size={20} />
          </div>
        </div>

        {/* Orders Count Card */}
        <div className="bg-white border border-neutral-100 p-6 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold">Completed Orders</p>
            <h3 className="text-2xl font-bold text-neutral-900">{orders.length}</h3>
            <p className="text-[10px] text-neutral-400 font-mono">Dynamic transactions processed</p>
          </div>
          <div className="p-4 bg-neutral-50 border border-neutral-150 text-neutral-800 rounded-2xl">
            <CheckCircle size={20} />
          </div>
        </div>

        {/* Total Stock Catalog */}
        <div className="bg-white border border-neutral-100 p-6 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold">Total Inventory Count</p>
            <h3 className="text-2xl font-bold text-neutral-900">{totalStockItems} pcs</h3>
            <p className="text-[10px] text-neutral-400">Distributed across {products.length} models</p>
          </div>
          <div className="p-4 bg-neutral-50 border border-neutral-150 text-neutral-800 rounded-2xl">
            <Package size={20} />
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white border border-neutral-100 p-6 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold">Stock Alerts</p>
            <h3 className="text-2xl font-bold text-neutral-900">{lowStockProducts.length} items</h3>
            {lowStockProducts.length > 0 ? (
              <p className="text-[10px] text-red-500 font-semibold flex items-center gap-0.5">
                <AlertTriangle size={12} /> Low stock limits breached
              </p>
            ) : (
              <p className="text-[10px] text-emerald-600 font-semibold">Inventory optimal</p>
            )}
          </div>
          <div
            className={`p-4 rounded-2xl ${
              lowStockProducts.length > 0 ? "bg-red-50 text-red-500 border border-red-100" : "bg-neutral-50 border border-neutral-150 text-neutral-800"
            }`}
          >
            <AlertTriangle size={20} />
          </div>
        </div>
      </div>

      {/* Main Stats Graphs Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Performance Graph */}
        <div className="bg-white border border-neutral-100 p-6 rounded-2xl shadow-sm lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-bold text-neutral-900">Calculated Revenue Performance</h4>
              <p className="text-xs text-neutral-400">Interactive visual flow of orders received</p>
            </div>
            <span className="text-[10px] font-mono font-semibold text-neutral-500 uppercase tracking-widest flex items-center gap-1 bg-neutral-100 px-2 py-1 rounded">
              <LineChart size={12} /> Weekly Velocity
            </span>
          </div>

          {/* Elegant Handmade Custom SVG Graph */}
          <div className="relative w-full h-64 bg-neutral-50 rounded-2xl overflow-hidden p-4 border border-neutral-100 flex items-end">
            {/* Grid Lines */}
            <div className="absolute inset-x-0 top-0 bottom-8 flex flex-col justify-between select-none pointer-events-none px-4">
              <div className="w-full border-t border-neutral-200/50 text-[9px] font-mono text-neutral-400 pt-0.5">$600</div>
              <div className="w-full border-t border-neutral-200/50 text-[9px] font-mono text-neutral-400 pt-0.5">$400</div>
              <div className="w-full border-t border-neutral-200/50 text-[9px] font-mono text-neutral-400 pt-0.5">$200</div>
              <div className="w-full border-t border-neutral-200/50 text-[9px] font-mono text-neutral-400 pt-0.5">$0</div>
            </div>

            {/* SVG Graph path drawing */}
            <svg className="w-full h-full absolute inset-0 p-4 pb-8" viewBox="0 0 500 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#111" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#111" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Area */}
              <path
                d="M 10 180 Q 125 150 250 120 T 490 60 L 490 200 L 10 200 Z"
                fill="url(#chartGradient)"
              />
              {/* Line */}
              <path
                d="M 10 180 Q 125 150 250 120 T 490 60"
                fill="none"
                stroke="#111"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Data points */}
              <circle cx="10" cy="180" r="4.5" fill="#111" />
              <circle cx="250" cy="120" r="4.5" fill="#111" />
              <circle cx="490" cy="60" r="4.5" fill="#111" />
            </svg>

            {/* Labels under the chart */}
            <div className="absolute inset-x-0 bottom-2 flex justify-between px-4 font-mono text-[9px] text-neutral-400">
              <span>Mon, Jul 2</span>
              <span>Wed, Jul 4</span>
              <span>Fri, Jul 6 (Today)</span>
            </div>
          </div>
        </div>

        {/* Category Share chart */}
        <div className="bg-white border border-neutral-100 p-6 rounded-2xl shadow-sm space-y-6">
          <div>
            <h4 className="text-base font-bold text-neutral-900">Category Catalog Share</h4>
            <p className="text-xs text-neutral-400">Catalog representation distribution</p>
          </div>

          <div className="space-y-4">
            {categoryData.map((data, idx) => {
              const percentage = Math.round((data.count / products.length) * 100);
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-neutral-800">{data.name}</span>
                    <span className="text-neutral-500 font-mono">{data.count} items ({percentage}%)</span>
                  </div>
                  {/* Progress bar container */}
                  <div className="w-full bg-neutral-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-neutral-900 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid of details listing (Orders and Stock Replenishment) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dynamic Orders Board */}
        <div className="bg-white border border-neutral-100 p-6 rounded-2xl shadow-sm space-y-4">
          <div>
            <h4 className="text-base font-bold text-neutral-900">Settled Transactions</h4>
            <p className="text-xs text-neutral-400">Real-time settlement activity records</p>
          </div>

          <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
            {isLoading ? (
              <div className="text-center py-10 text-xs text-neutral-400 font-mono animate-pulse">
                Fetching records from Express server...
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-10 text-xs text-neutral-400">
                No purchases settled yet in this session.
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="p-3.5 border border-neutral-100 hover:border-neutral-200 transition-colors rounded-xl flex items-center justify-between text-xs"
                >
                  <div className="space-y-1">
                    <div className="font-bold text-neutral-900">{order.id}</div>
                    <div className="text-neutral-400 font-sans">{order.shippingAddress.fullName}</div>
                    <div className="text-[10px] font-mono text-neutral-400">
                      {new Date(order.orderDate).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="font-bold text-neutral-900">${order.total.toLocaleString()}</div>
                    <span className="bg-emerald-100 text-emerald-700 text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full font-mono uppercase">
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Real-time Inventory Management (Restocking) */}
        <div className="bg-white border border-neutral-100 p-6 rounded-2xl shadow-sm space-y-4">
          <div>
            <h4 className="text-base font-bold text-neutral-900">Inventory Management</h4>
            <p className="text-xs text-neutral-400">Update stock parameters manually</p>
          </div>

          <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
            {products.map((p) => (
              <div
                key={p.id}
                className="p-3.5 border border-neutral-100 rounded-xl flex items-center justify-between text-xs"
              >
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 bg-neutral-50 rounded-lg p-1 border border-neutral-100 flex items-center justify-center">
                    <img src={p.image} alt="" className="max-h-full max-w-full object-contain" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <div className="font-semibold text-neutral-800 line-clamp-1">{p.name}</div>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase">{p.category}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-bold text-neutral-900">{p.stock} units</div>
                    {p.stock <= 5 ? (
                      <span className="text-red-500 font-semibold text-[10px] block">Low Stock</span>
                    ) : (
                      <span className="text-emerald-600 font-semibold text-[10px] block">Healthy</span>
                    )}
                  </div>
                  <button
                    onClick={() => onReplenish(p.id)}
                    className="p-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg transition-colors cursor-pointer"
                    title="Replenish stock (+10)"
                  >
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
