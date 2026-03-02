"use client";

import { useCart } from "@/lib/CartContext";
import { ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";

export default function AddToCartButton({ product }: { product: any }) {
    const { addToCart } = useCart();

    return (
        <button
            onClick={() => {
                addToCart(product);
                toast.success("Added to cart!");
            }}
            className="w-full flex items-center justify-center gap-3 bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 group"
        >
            <ShoppingCart className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
            Add to Shopping Bag
        </button>
    );
}
