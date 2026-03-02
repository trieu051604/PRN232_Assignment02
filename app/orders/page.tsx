"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Package, ChevronRight, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch("/api/orders");
                if (response.ok) {
                    const data = await response.json();
                    setOrders(data);
                }
            } catch (err) {
                console.error("Failed to fetch orders");
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (isLoading) {
        return <div className="text-center py-20 font-bold text-gray-500 animate-pulse">Loading orders...</div>;
    }

    if (orders.length === 0) {
        return (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">No orders found</h1>
                <p className="text-gray-500 mb-8">You haven't placed any orders yet.</p>
                <Link href="/" className="text-indigo-600 font-bold hover:underline">
                    Go shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-black text-gray-900 mb-8">Order History</h1>
            <div className="space-y-6">
                {orders.map((order) => (
                    <div
                        key={order.id}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                    >
                        <div className="p-6 bg-gray-50/50 flex flex-wrap justify-between items-center gap-4">
                            <div className="flex gap-8">
                                <div>
                                    <p className="text-xs uppercase font-bold text-gray-400 mb-1">Order Placed</p>
                                    <p className="text-sm font-bold text-gray-700">
                                        {format(new Date(order.createdAt), "MMM d, yyyy")}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase font-bold text-gray-400 mb-1">Total Amount</p>
                                    <p className="text-sm font-bold text-indigo-600">${order.totalAmount.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase font-bold text-gray-400 mb-1">Status</p>
                                    <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-xs font-bold uppercase">
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                            <p className="text-xs font-bold text-gray-400">Order #{order.id}</p>
                        </div>
                        <div className="p-6 space-y-4">
                            {order.items.map((item: any) => (
                                <div key={item.id} className="flex gap-4 items-center">
                                    <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                                        {item.product.image ? (
                                            <img src={item.product.image} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <ShoppingBag className="w-6 h-6" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-bold text-gray-900">{item.product.name}</h4>
                                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="text-sm font-bold text-gray-900">${item.price.toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
