"use client";

import { useState } from "react";
import Link from "next/link";
import ConfirmModal from "./ConfirmModal";
import { Trash2, Edit, ExternalLink, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "@/lib/CartContext";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string | null;
    createdAt: Date;
}

export default function ProductGrid({ initialProducts, user }: { initialProducts: Product[], user?: any }) {
    const [products, setProducts] = useState(initialProducts);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const { addToCart } = useCart();

    const handleDeleteClick = (id: number) => {
        setProductToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (productToDelete === null) return;
        setIsDeleting(true);

        try {
            const res = await fetch(`/api/products/${productToDelete}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setProducts(products.filter((p) => p.id !== productToDelete));
                setIsDeleteModalOpen(false);
                toast.success("Product deleted successfully!");
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to delete product");
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            toast.error("An unexpected error occurred");
        } finally {
            setIsDeleting(false);
            setProductToDelete(null);
        }
    };

    if (products.length === 0) {
        return (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm border">
                <p className="text-gray-500 text-lg">No products found. Start by adding some!</p>
            </div>
        );
    }

    return (
        <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                        <div className="relative h-56 bg-gray-50 overflow-hidden">
                            {product.image ? (
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    No image
                                </div>
                            )}
                            <div className="absolute top-3 right-3">
                                <span className="bg-white/90 backdrop-blur-md text-indigo-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                    ${product.price.toFixed(2)}
                                </span>
                            </div>
                        </div>
                        <div className="p-5">
                            <h2 className="text-lg font-bold text-gray-900 mb-2 truncate group-hover:text-indigo-600 transition-colors">
                                {product.name}
                            </h2>
                            <p className="text-gray-500 text-sm mb-6 line-clamp-2 h-10 leading-relaxed">
                                {product.description}
                            </p>

                            <div className="flex flex-col gap-2">
                                {(!user || user.role !== "ADMIN") && (
                                    <button
                                        onClick={() => {
                                            addToCart(product);
                                            toast.success("Added to cart!");
                                        }}
                                        className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-3 py-2.5 rounded-xl hover:bg-indigo-700 transition-all text-sm font-bold shadow-sm"
                                    >
                                        <ShoppingCart className="w-4 h-4" />
                                        Add to Cart
                                    </button>
                                )}
                                <div className="flex gap-2">
                                    <Link
                                        href={`/products/${product.id}`}
                                        className="flex-1 flex items-center justify-center gap-2 bg-gray-50 text-gray-700 px-3 py-2 rounded-xl hover:bg-gray-100 transition-all text-sm font-bold border border-gray-100"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        Details
                                    </Link>
                                    {user && user.role === "ADMIN" && (
                                        <>
                                            <Link
                                                href={`/products/${product.id}/edit`}
                                                className="flex items-center justify-center bg-indigo-50 text-indigo-600 p-2 rounded-xl hover:bg-indigo-100 transition-all border border-indigo-100"
                                                title="Edit product"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteClick(product.id)}
                                                className="flex items-center justify-center bg-red-50 text-red-600 p-2 rounded-xl hover:bg-red-100 transition-all border border-red-100"
                                                title="Delete product"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                isLoading={isDeleting}
                title="Delete Product?"
                message="Are you sure you want to delete this product? This action will permanently remove it from the store catalog."
                confirmLabel="Delete Now"
                type="danger"
            />
        </div>
    );
}
