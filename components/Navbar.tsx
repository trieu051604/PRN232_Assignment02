import Link from "next/link";
import { getSession } from "@/lib/auth";
import LogoutButton from "./LogoutButton";

export default async function Navbar() {
    const session = await getSession();
    const user = session?.user;

    return (
        <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="text-2xl font-black text-indigo-600 tracking-tight">
                            ClothStore
                        </Link>
                        <div className="hidden md:flex space-x-4">
                            <Link href="/" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md font-medium transition-colors">
                                Home
                            </Link>
                            {user && user.role === "ADMIN" ? (
                                <Link href="/products/create" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md font-medium transition-colors">
                                    Add Product
                                </Link>
                            ) : user && (
                                <Link href="/orders" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md font-medium transition-colors">
                                    Orders
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        {(!user || user.role !== "ADMIN") && (
                            <Link href="/cart" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md font-medium transition-colors flex items-center gap-2">
                                Cart
                            </Link>
                        )}

                        {user ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-500">Hi, {user.name || user.email}</span>
                                <LogoutButton />
                            </div>
                        ) : (
                            <div className="flex space-x-2">
                                <Link href="/login" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md font-medium transition-colors">
                                    Login
                                </Link>
                                <Link href="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 transition-colors">
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
