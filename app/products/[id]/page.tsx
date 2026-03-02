import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import AddToCartButton from "@/components/AddToCartButton";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
        notFound();
    }

    const product = await prisma.product.findUnique({
        where: { id },
    });

    if (!product) {
        notFound();
    }

    const session = await getSession();
    const user = session?.user;

    return (
        <div className="max-w-4xl mx-auto px-4">
            <Link
                href="/"
                className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center mb-8"
            >
                ← Back to Gallery
            </Link>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="md:flex">
                    <div className="md:w-1/2 bg-gray-50 flex items-center justify-center p-12 border-r border-gray-100">
                        {product.image ? (
                            <img
                                src={product.image}
                                alt={product.name}
                                className="max-h-96 w-full object-contain rounded-2xl shadow-sm hover:scale-105 transition-transform duration-500"
                            />
                        ) : (
                            <div className="text-gray-300 font-medium">No image available</div>
                        )}
                    </div>
                    <div className="md:w-1/2 p-12 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-6">
                                <h1 className="text-4xl font-black text-gray-900 leading-tight">
                                    {product.name}
                                </h1>
                                {user && user.role === "ADMIN" && (
                                    <Link
                                        href={`/products/${product.id}/edit`}
                                        className="bg-white text-indigo-600 px-4 py-2 rounded-xl hover:bg-indigo-50 transition-all text-sm font-bold border border-indigo-100 shadow-sm"
                                    >
                                        Edit
                                    </Link>
                                )}
                            </div>
                            <p className="text-3xl font-black text-indigo-600 mb-8">
                                ${product.price.toFixed(2)}
                            </p>
                            <div className="mb-10">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                                    Description
                                </h3>
                                <p className="text-gray-600 text-lg leading-relaxed">
                                    {product.description}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {(!user || user.role !== "ADMIN") && (
                                <AddToCartButton product={product} />
                            )}
                            <div className="pt-8 border-t border-gray-100">
                                <p className="text-sm text-gray-400 font-medium italic">
                                    Added on: {new Date(product.createdAt).toLocaleDateString("en-US", {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
