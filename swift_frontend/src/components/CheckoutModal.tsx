import React, { useState } from "react";
import { X, CreditCard, ShieldCheck, ShoppingBag, Check, ChevronRight, AlertCircle } from "lucide-react";
import { CartItem, Order } from "../types";

interface Props {
  cart: CartItem[];
  onClose: () => void;
  onClearCart: () => void;
  logAPI: (method: "GET" | "POST" | "PUT" | "DELETE", url: string, status: number, payload?: any, response?: any) => void;
}

export default function CheckoutModal({ cart, onClose, onClearCart, logAPI }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("United States");

  // Virtual Card Fields
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountMultiplier = 0.15; // Assume static applied discount if coupon was in state, or calculate based on subtotal. Let's make it direct
  const isPromoUsed = false; // We can adjust or simplify: let's calculate total simply
  const total = subtotal;

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!fullName || !address || !city || !postalCode) {
        setErrorMsg("Please complete all address details.");
        return;
      }
      setErrorMsg("");
      setStep(2);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardExpiry || !cardCvv) {
      setErrorMsg("Please fill out complete card parameters.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    const orderPayload = {
      items: cart.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        color: item.selectedColor,
      })),
      total,
      shippingAddress: {
        fullName,
        address,
        city,
        postalCode,
        country,
      },
    };

    try {
      const url = "/api/orders";
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await response.json();
      logAPI("POST", url, response.status, orderPayload, data);

      if (response.ok) {
        setCompletedOrder(data);
        onClearCart();
        setStep(3);
      } else {
        setErrorMsg(data.detail || "Failed to process checkout transaction.");
      }
    } catch (err) {
      setErrorMsg("A connection timeout occurred on the API server. Please retry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" id="checkout-modal-root">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-6 lg:p-8">
        <div className="relative transform overflow-hidden rounded-3xl bg-white text-left align-middle shadow-2xl transition-all w-full max-w-3xl border border-neutral-100 flex flex-col md:flex-row h-full max-h-[90vh]">
          {/* Close Button */}
          {step !== 3 && (
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-10 p-2 text-neutral-400 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-full transition-all cursor-pointer"
            >
              <X size={16} />
            </button>
          )}

          {/* Left Panel: Summary list of purchases */}
          <div className="w-full md:w-2/5 bg-neutral-50 p-6 sm:p-8 border-b md:border-b-0 md:border-r border-neutral-100 flex flex-col justify-between overflow-y-auto">
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400 mb-6 flex items-center gap-1.5">
                <ShoppingBag size={14} /> Order Summary
              </h3>

              <div className="space-y-4 max-h-[45vh] overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex gap-3 text-xs border-b border-neutral-100 pb-3">
                    <div className="w-12 h-12 bg-white rounded-lg border border-neutral-150 p-1 flex items-center justify-center flex-shrink-0">
                      <img src={item.product.image} alt="" className="max-h-full max-w-full object-contain" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-neutral-800 line-clamp-1">{item.product.name}</div>
                      <div className="text-neutral-400 font-mono mt-0.5 text-[10px]">
                        Qty: {item.quantity} {item.selectedColor && `| ${item.selectedColor}`}
                      </div>
                    </div>
                    <div className="font-bold text-neutral-900">
                      ${(item.product.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-neutral-200/60 pt-4 mt-6 text-xs space-y-1.5">
              <div className="flex justify-between text-neutral-500">
                <span>Items Subtotal</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Insured Transit</span>
                <span className="text-emerald-600 font-bold uppercase text-[9px] font-mono">Free</span>
              </div>
              <div className="flex justify-between font-bold text-neutral-900 text-sm pt-2 border-t border-dashed border-neutral-200">
                <span>Calculated Total</span>
                <span>${total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Right Panel: Sleek input forms */}
          <div className="w-full md:w-3/5 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto h-full max-h-[80vh] md:max-h-full">
            {/* Step indicators */}
            <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-wider text-neutral-400 border-b border-neutral-100 pb-4 mb-6">
              <span className={step === 1 ? "text-neutral-900 font-bold" : "text-neutral-400"}>01. Shipping</span>
              <ChevronRight size={10} />
              <span className={step === 2 ? "text-neutral-900 font-bold" : "text-neutral-400"}>02. Settlement</span>
              <ChevronRight size={10} />
              <span className={step === 3 ? "text-neutral-900 font-bold" : "text-neutral-400"}>03. Receipt</span>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs flex items-center gap-2 mb-4">
                <AlertCircle size={14} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* STEP 1: SHIPPING DETAILS */}
            {step === 1 && (
              <form onSubmit={handleNextStep} className="space-y-4">
                <h3 className="text-base font-bold text-neutral-900">Where shall we send your selection?</h3>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-neutral-400 font-semibold mb-1">Receiver's Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Marcus Aurelius"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-neutral-400 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-neutral-400 font-semibold mb-1">Postal Address</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="128 Custom House Quay"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-neutral-400 focus:bg-white transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-400 font-semibold mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Boston"
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-neutral-400 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-400 font-semibold mb-1">Postal Code</label>
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="02110"
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-neutral-400 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Proceed to Settlement <ChevronRight size={14} />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: PAYMENT & SETTLEMENT */}
            {step === 2 && (
              <form onSubmit={handleSubmitOrder} className="space-y-5">
                <h3 className="text-base font-bold text-neutral-900">Insured Settlement</h3>

                {/* Virtual Card Rendering */}
                <div className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-950 p-6 rounded-2xl text-white font-mono shadow-xl relative overflow-hidden flex flex-col justify-between h-40">
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
                  <div className="flex justify-between items-start">
                    <span className="text-xs uppercase tracking-widest text-neutral-400">Swift Premium</span>
                    <CreditCard size={24} className="text-white/80" />
                  </div>
                  <div className="text-sm md:text-base tracking-widest py-2">
                    {cardNumber ? cardNumber.replace(/(\d{4})/g, "$1 ").trim() : "•••• •••• •••• ••••"}
                  </div>
                  <div className="flex justify-between items-center text-[10px] uppercase text-neutral-400">
                    <div>
                      <span>Cardholder</span>
                      <div className="text-white font-semibold mt-0.5">{fullName || "Holder Name"}</div>
                    </div>
                    <div className="text-right">
                      <span>Expires</span>
                      <div className="text-white font-semibold mt-0.5">{cardExpiry || "MM/YY"}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-neutral-400 font-semibold mb-1">Card Number</label>
                    <input
                      type="text"
                      required
                      maxLength={16}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
                      placeholder="4000123456789010"
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-neutral-400 focus:bg-white transition-all font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-neutral-400 font-semibold mb-1">Expiration</label>
                      <input
                        type="text"
                        required
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-neutral-400 focus:bg-white transition-all font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-neutral-400 font-semibold mb-1">Security Code (CVV)</label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                        placeholder="•••"
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-neutral-400 focus:bg-white transition-all font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 py-3 border border-neutral-200 text-neutral-600 hover:text-neutral-900 rounded-xl text-xs uppercase tracking-wider transition-all text-center cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-2/3 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
                  >
                    <ShieldCheck size={14} /> {isSubmitting ? "Settling with DRF API..." : `Authorize $${total}`}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: TRANSACTION SUCCESS / RECEIPT */}
            {step === 3 && completedOrder && (
              <div className="text-center py-6 space-y-5 flex flex-col items-center justify-center">
                <div className="p-4 bg-emerald-50 text-emerald-600 rounded-full inline-flex animate-bounce">
                  <Check size={36} strokeWidth={3} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 tracking-tight">Order settled successfully!</h3>
                  <p className="text-xs text-neutral-400 mt-1">A confirmation record has been saved on the server database.</p>
                </div>

                {/* Receipt Card */}
                <div className="w-full bg-neutral-50 border border-neutral-200/80 rounded-2xl p-5 text-left text-xs font-mono space-y-3 shadow-inner">
                  <div className="border-b border-dashed border-neutral-200 pb-3">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Order ID:</span>
                      <span className="font-bold text-neutral-900">{completedOrder.id}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-neutral-400">Timestamp:</span>
                      <span>{new Date(completedOrder.orderDate).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="border-b border-dashed border-neutral-200 pb-3 space-y-1">
                    <span className="text-neutral-400 block mb-1">Delivered to:</span>
                    <div className="font-sans font-semibold text-neutral-800">{completedOrder.shippingAddress.fullName}</div>
                    <div className="font-sans text-neutral-500">{completedOrder.shippingAddress.address}</div>
                    <div className="font-sans text-neutral-500">{completedOrder.shippingAddress.city}, {completedOrder.shippingAddress.postalCode}</div>
                  </div>

                  <div className="flex justify-between font-bold text-neutral-900 pt-1 text-sm font-sans">
                    <span>Authorized Charge</span>
                    <span>${completedOrder.total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-4 w-full">
                  <button
                    onClick={onClose}
                    className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg"
                  >
                    Return to Atelier
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
