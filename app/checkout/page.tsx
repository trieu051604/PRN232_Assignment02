"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/CartContext";
import { toast } from "react-hot-toast";
import { CreditCard, Truck, ShieldCheck, ArrowRight, ShoppingBag, ShoppingCart } from "lucide-react";

export default function CheckoutPage() {
    const { cart, cartTotal, clearCart } = useCart();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<"COD" | "CARD">("COD");
    const [cardData, setCardData] = useState({ number: "", expiry: "", cvc: "" });
    const [isVerifying, setIsVerifying] = useState(false);

    useEffect(() => {
        if (cart.length === 0) {
            router.push("/cart");
        }
    }, [cart, router]);

    if (cart.length === 0) {
        return null;
    }

    const handlePlaceOrder = async () => {
        setIsLoading(true);

        // Simulate payment verification if using card
        if (paymentMethod === "CARD") {
            setIsVerifying(true);
            await new Promise(resolve => setTimeout(resolve, 2500)); // 2.5s delay
            setIsVerifying(false);
        }

        try {
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: cart,
                    totalAmount: cartTotal,
                    paymentMethod,
                }),
            });

            if (response.ok) {
                toast.success(paymentMethod === "CARD" ? "Payment successful & Order placed!" : "Order placed successfully!");
                clearCart();
                router.push("/orders");
            } else {
                const data = await response.json();
                toast.error(data.error || "Failed to place order");
            }
        } catch (err) {
            toast.error("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isVerifying) {
        return (
            <div className="flex flex-col items-center justify-center py-32 space-y-6">
                <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                <div className="text-center">
                    <h2 className="text-2xl font-black text-gray-900 mb-2">Verifying Payment</h2>
                    <p className="text-gray-500">Please do not refresh the page...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-3xl font-black text-gray-900 mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Truck className="w-5 h-5 text-indigo-600" />
                            Shipping Information
                        </h2>
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                            <p className="text-gray-600">Free Standard Shipping (3-5 business days)</p>
                            <div className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-green-500" />
                                Delivery to your registered address.
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-indigo-600" />
                            Payment Method
                        </h2>
                        <div className="space-y-4">
                            {/* COD Option */}
                            <button
                                onClick={() => setPaymentMethod("COD")}
                                className={`w-full p-6 rounded-3xl border-2 transition-all flex items-center justify-between group ${paymentMethod === "COD" ? "border-indigo-600 bg-indigo-50/50" : "border-gray-100 bg-white hover:border-indigo-200"}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === "COD" ? "border-indigo-600" : "border-gray-300"}`}>
                                        {paymentMethod === "COD" && <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>}
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-gray-900">Cash on Delivery</p>
                                        <p className="text-xs text-gray-500">Pay when you receive your order</p>
                                    </div>
                                </div>
                                <ShoppingBag className={`w-6 h-6 transition-colors ${paymentMethod === "COD" ? "text-indigo-600" : "text-gray-300"}`} />
                            </button>

                            {/* Card Option */}
                            <button
                                onClick={() => setPaymentMethod("CARD")}
                                className={`w-full p-6 rounded-3xl border-2 transition-all flex flex-col gap-6 ${paymentMethod === "CARD" ? "border-indigo-600 bg-indigo-50/50" : "border-gray-100 bg-white hover:border-indigo-200"}`}
                            >
                                <div className="w-full flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === "CARD" ? "border-indigo-600" : "border-gray-300"}`}>
                                            {paymentMethod === "CARD" && <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>}
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold text-gray-900">Credit / Debit Card</p>
                                            <p className="text-xs text-gray-500">Secure payment via simulated gateway</p>
                                        </div>
                                    </div>
                                    <CreditCard className={`w-6 h-6 transition-colors ${paymentMethod === "CARD" ? "text-indigo-600" : "text-gray-300"}`} />
                                </div>

                                {paymentMethod === "CARD" && (
                                    <div className="w-full space-y-4 pt-4 border-t border-indigo-100 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <input
                                            type="text"
                                            placeholder="Card Number"
                                            className="w-full px-4 py-3 rounded-xl border border-indigo-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono"
                                            value={cardData.number}
                                            onChange={e => setCardData({ ...cardData, number: e.target.value })}
                                        />
                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                placeholder="MM/YY"
                                                className="px-4 py-3 rounded-xl border border-indigo-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono"
                                                value={cardData.expiry}
                                                onChange={e => setCardData({ ...cardData, expiry: e.target.value })}
                                            />
                                            <input
                                                type="text"
                                                placeholder="CVC"
                                                className="px-4 py-3 rounded-xl border border-indigo-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono"
                                                value={cardData.cvc}
                                                onChange={e => setCardData({ ...cardData, cvc: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                )}
                            </button>
                        </div>
                    </section>
                </div>

                <div className="space-y-8">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-indigo-50/50 border border-indigo-50 h-fit sticky top-24">
                        <h2 className="text-xl font-black text-gray-900 mb-8">Order Summary</h2>
                        <div className="space-y-4 mb-8">
                            {cart.map((item) => (
                                <div key={item.id} className="flex justify-between items-center bg-gray-50/50 p-3 rounded-2xl">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-900">{item.name}</span>
                                        <span className="text-xs text-gray-500">Quantity: {item.quantity}</span>
                                    </div>
                                    <span className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-3 mb-8 pt-6 border-t border-gray-100">
                            <div className="flex justify-between text-gray-500 text-sm">
                                <span>Subtotal</span>
                                <span className="font-bold text-gray-900">${cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-500 text-sm">
                                <span>Processing Fee</span>
                                <span className="text-green-500 font-bold">Free</span>
                            </div>
                            <div className="flex justify-between items-center pt-4">
                                <span className="text-lg font-black text-gray-900">Total</span>
                                <span className="text-3xl font-black text-indigo-600">
                                    ${cartTotal.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            disabled={isLoading || (paymentMethod === "CARD" && (!cardData.number || !cardData.expiry || !cardData.cvc))}
                            className="w-full relative overflow-hidden group bg-indigo-600 text-white py-5 rounded-3xl font-black text-lg hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 disabled:opacity-50 disabled:shadow-none"
                        >
                            <span className="flex items-center justify-center gap-3">
                                {isLoading ? "Processing..." : paymentMethod === "CARD" ? "Confirm & Pay" : "Place Order"}
                                <ArrowRight className={`w-6 h-6 transition-transform duration-300 ${!isLoading && 'group-hover:translate-x-1'}`} />
                            </span>
                        </button>
                        <p className="mt-6 text-center text-xs text-gray-400 font-medium">
                            🔒 256-bit Secure SSL Encryption
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
