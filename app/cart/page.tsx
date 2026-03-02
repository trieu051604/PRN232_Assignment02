"use client";

import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                <ShoppingBag className="w-16 h-16 text-gray-200 mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
                <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
                <Link
                    href="/"
                    className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-2 space-y-4">
                <h1 className="text-3xl font-black text-gray-900 mb-8">Your Cart</h1>
                {cart.map((item) => (
                    <div
                        key={item.id}
                        className="flex flex-col md:flex-row items-center gap-6 bg-white p-6 rounded-3xl shadow-sm border border-gray-100"
                    >
                        {/* Image Section */}
                        <div className="w-full md:w-32 h-48 md:h-32 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0">
                            {item.image ? (
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <ShoppingBag className="w-10 h-10" />
                                </div>
                            )}
                        </div>

                        {/* Content and Controls Section */}
                        <div className="flex-1 w-full min-w-0 flex flex-col sm:flex-row items-center sm:justify-between gap-6">
                            <div className="text-center sm:text-left overflow-hidden">
                                <h3 className="text-xl font-black text-gray-900 truncate mb-1">{item.name}</h3>
                                <p className="text-indigo-600 font-black text-2xl">${item.price.toFixed(2)}</p>
                            </div>

                            <div className="flex items-center gap-4 w-full sm:w-auto justify-center sm:justify-end">
                                <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100 shadow-inner">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="w-10 h-10 flex items-center justify-center bg-white hover:bg-gray-100 rounded-xl transition-all shadow-sm disabled:opacity-30 disabled:shadow-none"
                                        disabled={item.quantity <= 1}
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-12 text-center font-black text-lg text-gray-900">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="w-10 h-10 flex items-center justify-center bg-white hover:bg-gray-100 rounded-xl transition-all shadow-sm"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="w-12 h-12 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-2xl transition-all border border-transparent hover:border-red-100"
                                    title="Remove item"
                                >
                                    <Trash2 className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="lg:col-span-1">
                <div className="bg-white p-8 rounded-3xl shadow-xl shadow-indigo-50 border border-indigo-50 sticky top-24">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                    <div className="space-y-4 mb-8">
                        <div className="flex justify-between text-gray-500">
                            <span>Subtotal</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-500">
                            <span>Shipping</span>
                            <span className="text-green-500 font-medium">Free</span>
                        </div>
                        <div className="pt-4 border-t border-gray-100 flex justify-between">
                            <span className="text-lg font-bold text-gray-900">Total</span>
                            <span className="text-2xl font-black text-indigo-600">
                                ${cartTotal.toFixed(2)}
                            </span>
                        </div>
                    </div>
                    <Link
                        href="/checkout"
                        className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 group"
                    >
                        Checkout
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <p className="mt-6 text-center text-xs text-gray-400">
                        Secure and encrypted checkout process
                    </p>
                </div>
            </div>
        </div>
    );
}
