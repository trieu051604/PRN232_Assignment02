"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    type?: "danger" | "info";
    isLoading?: boolean;
}

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Are you sure?",
    message = "This action cannot be undone.",
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    type = "danger",
    isLoading = false,
}: ConfirmModalProps) {
    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden"
                    >
                        <div className="p-6">
                            <div className="flex items-start gap-4">
                                <div
                                    className={cn(
                                        "p-3 rounded-full flex-shrink-0",
                                        type === "danger" ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
                                    )}
                                >
                                    <AlertCircle className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 leading-none mb-2">
                                        {title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {message}
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 flex flex-col sm:flex-row-reverse gap-3">
                            <button
                                disabled={isLoading}
                                onClick={onConfirm}
                                className={cn(
                                    "flex-1 px-4 py-2.5 rounded-xl font-bold text-white transition-all shadow-sm active:scale-95 disabled:opacity-50",
                                    type === "danger"
                                        ? "bg-red-600 hover:bg-red-700 shadow-red-100"
                                        : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100"
                                )}
                            >
                                {isLoading ? "Processing..." : confirmLabel}
                            </button>
                            <button
                                disabled={isLoading}
                                onClick={onClose}
                                className="flex-1 px-4 py-2.5 rounded-xl font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {cancelLabel}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
