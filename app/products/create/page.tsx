"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { CldUploadWidget } from "next-cloudinary";
import { Upload, Image as ImageIcon, X } from "lucide-react";

export default function CreateProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        image: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                toast.success("Product created successfully!");
                router.push("/");
                router.refresh();
            } else {
                const data = await res.json();
                toast.error(data.error || "Something went wrong");
            }
        } catch (error) {
            console.error("Error creating product:", error);
            toast.error("Failed to create product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <Link
                    href="/"
                    className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center"
                >
                    ← Back to Gallery
                </Link>
                <h1 className="text-3xl font-extrabold text-gray-900 mt-4">Add New Product</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Name
                    </label>
                    <input
                        type="text"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                        placeholder="Cool T-Shirt"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        required
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                        placeholder="Tell us about the product..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price ($)
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                        placeholder="29.99"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Product Image
                    </label>
                    <div className="space-y-4">
                        {formData.image ? (
                            <div className="relative w-full h-48 rounded-2xl overflow-hidden group shadow-lg">
                                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, image: "" })}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-md"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? (
                            <CldUploadWidget
                                uploadPreset="ImageStore"
                                onSuccess={(result: any) => {
                                    setFormData(prev => ({ ...prev, image: result.info.secure_url }));
                                    toast.success("Image uploaded!");
                                }}
                            >
                                {({ open }) => (
                                    <button
                                        type="button"
                                        onClick={() => open()}
                                        className="w-full h-48 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group"
                                    >
                                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                                            <Upload className="w-8 h-8 text-indigo-600" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-black text-gray-900">Click to upload</p>
                                            <p className="text-xs text-gray-400 font-medium">PNG, JPG or WebP (Max. 5MB)</p>
                                        </div>
                                    </button>
                                )}
                            </CldUploadWidget>
                        ) : (
                            <div className="w-full h-48 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 bg-gray-50/50">
                                <ImageIcon className="w-8 h-8 text-gray-300" />
                                <p className="text-xs text-gray-400 font-medium text-center px-4 italic underline decoration-indigo-300">
                                    Cloudinary not configured.
                                </p>
                                <p className="text-[10px] text-gray-400 text-center px-4">
                                    Please paste a URL below or check .env
                                </p>
                            </div>
                        )}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <ImageIcon className="w-4 h-4 text-gray-300" />
                            </div>
                            <input
                                type="url"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none font-medium text-sm"
                                placeholder="Or paste image URL here..."
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors ${loading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                >
                    {loading ? "Creating..." : "Create Product"}
                </button>
            </form>
        </div>
    );
}
