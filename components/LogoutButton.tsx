"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const response = await fetch("/api/auth/logout", {
                method: "POST",
            });

            if (response.ok) {
                toast.success("Logged out successfully");
                router.push("/login");
                router.refresh();
            } else {
                toast.error("Logout failed");
            }
        } catch (err) {
            toast.error("An error occurred during logout");
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md font-medium transition-colors"
        >
            Logout
        </button>
    );
}
