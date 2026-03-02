"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, Send, X, User, ShieldCheck } from "lucide-react";
import { toast } from "react-hot-toast";
import { usePathname } from "next/navigation";

export default function ChatWidget({ user }: { user: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [activeThread, setActiveThread] = useState<number | null>(null); // For Admin: which user are we chatting with?
    const scrollRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    // Clear messages when opening/closing, switching threads, or switching accounts to avoid leaks
    useEffect(() => {
        setMessages([]);
        if (isOpen && user) {
            fetchMessages();
        } else if (!isOpen) {
            // Also clear for safety when closed
            setMessages([]);
            if (user?.role === "ADMIN") setActiveThread(null);
        }
    }, [isOpen, activeThread, user?.id]);


    // Fix for "frozen" page after Cloudinary upload
    useEffect(() => {
        document.body.style.overflow = "auto";
    }, [pathname]);

    useEffect(() => {
        if (isOpen && user) {
            const interval = setInterval(fetchMessages, 5000); // Poll every 5s
            return () => clearInterval(interval);
        }
    }, [isOpen, user, activeThread]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const fetchMessages = async () => {
        try {
            setIsFetching(true);
            // If Admin and no active thread, we might be looking for all to show threads list
            // Or if active thread, fetch only for that user
            const url = user.role === "ADMIN" && activeThread
                ? `/api/messages?userId=${activeThread}`
                : "/api/messages";

            const res = await fetch(url);
            if (!res.ok) {
                const error = await res.json();
                console.error("Chat Error:", error);
                return;
            }
            const data = await res.json();
            if (Array.isArray(data)) setMessages(data);
        } catch (err) {
            // Ignore common aborted request errors during dev/reload
            if (err instanceof TypeError && err.message === "Failed to fetch") {
                console.warn("Poll failed (likely server restart):", err.message);
            } else {
                console.error("Fetch Messages Failed:", err);
            }
        } finally {
            setIsFetching(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        const content = input.trim();
        if (!content || isLoading) return;

        setIsLoading(true);
        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content,
                    targetUserId: user.role === "ADMIN" ? activeThread : undefined
                }),
            });

            if (res.ok) {
                setInput("");
                await fetchMessages();
            } else {
                const error = await res.json();
                toast.error(error.error || "Failed to send message");
            }
        } catch (err) {
            console.error("Send Message Error:", err);
            toast.error("Network error. Try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) return null;

    // For Admin: Calculate unique threads from messages
    const threads = user.role === "ADMIN" && !activeThread
        ? Array.from(new Set(messages.map(m => m.userId)))
            .map(uid => {
                const threadMessages = messages.filter(m => m.userId === uid);
                const userObj = threadMessages.find(m => m.user?.role !== "ADMIN")?.user || threadMessages[0]?.user;
                return {
                    id: uid,
                    name: userObj?.name || `User ${uid}`,
                    role: userObj?.role,
                    lastMessage: threadMessages[threadMessages.length - 1]?.content
                };
            })
            .filter(t => t.role !== "ADMIN")
        : [];

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen ? (
                <div className="bg-white w-80 sm:w-96 h-[32rem] rounded-3xl shadow-2xl border border-indigo-50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                    {/* Header */}
                    <div className="bg-indigo-600 p-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {user.role === "ADMIN" && activeThread && (
                                <button
                                    onClick={() => {
                                        setActiveThread(null);
                                        setMessages([]);
                                        fetchMessages();
                                    }}
                                    className="text-white hover:bg-white/20 p-1 rounded-lg transition-colors mr-1"
                                >
                                    ←
                                </button>
                            )}
                            <div className="bg-white/20 p-2 rounded-xl">
                                <MessageCircle className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-white font-black">
                                    {user.role === "ADMIN"
                                        ? (activeThread ? `Chat with ${threads.find(t => t.id === activeThread)?.name || 'User'}` : "Conversations")
                                        : "Support Chat"}
                                </h3>
                                <p className="text-indigo-100 text-xs font-medium">
                                    {user.role === "ADMIN" && !activeThread ? "Select a customer" : "We're online to help"}
                                </p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-indigo-200 hover:text-white transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                        {user.role === "ADMIN" && !activeThread ? (
                            /* Admin: Thread List View */
                            <div className="space-y-2">
                                {threads.length === 0 ? (
                                    <div className="text-center py-10 text-gray-400 text-sm">No conversations yet</div>
                                ) : (
                                    threads.map(thread => (
                                        <button
                                            key={thread.id}
                                            onClick={() => setActiveThread(thread.id)}
                                            className="w-full bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all text-left group"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-black text-gray-900 group-hover:text-indigo-600 transition-colors truncate">{thread.name}</p>
                                                    <p className="text-xs text-gray-400 truncate mt-1">{thread.lastMessage}</p>
                                                </div>
                                                <div className="bg-indigo-50 text-indigo-600 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Send className="w-3.5 h-3.5" />
                                                </div>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        ) : (
                            /* Chat View (Customer or Focused Admin) */
                            <>
                                {isFetching && messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                                        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-gray-400 text-sm font-medium">Loading messages...</p>
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="text-center py-10">
                                        <p className="text-gray-400 text-sm font-medium">No messages yet. Say hello!</p>
                                    </div>
                                ) : (
                                    messages.map((msg, i) => {
                                        const isMe = (user.role === "ADMIN" && msg.isAdmin) || (user.role !== "ADMIN" && !msg.isAdmin);
                                        return (
                                            <div key={i} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                                                <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium shadow-sm ${isMe
                                                    ? "bg-indigo-600 text-white rounded-tr-none"
                                                    : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
                                                    }`}>
                                                    {msg.content}
                                                </div>
                                                <span className="text-[10px] text-gray-400 mt-1 flex items-center gap-1 px-1">
                                                    {msg.isAdmin ? <ShieldCheck className="w-2.5 h-2.5" /> : <User className="w-2.5 h-2.5" />}
                                                    {msg.isAdmin ? "Admin" : (msg.user?.name || "Customer")} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        );
                                    })
                                )}
                            </>
                        )}
                    </div>

                    {/* Input (Hidden for Admin in List View) */}
                    {(!user || user.role !== "ADMIN" || activeThread) && (
                        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-2">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                className="flex-1 bg-gray-50 px-4 py-3 rounded-2xl text-sm outline-none border border-transparent focus:border-indigo-100 transition-all font-medium"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="bg-indigo-600 text-white p-3 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 disabled:shadow-none"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </form>
                    )}
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-indigo-600 text-white p-5 rounded-3xl shadow-2xl hover:bg-indigo-700 hover:scale-110 transition-all group relative"
                >
                    <MessageCircle className="w-8 h-8" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                    <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-gray-900 px-4 py-2 rounded-2xl shadow-xl border border-gray-100 text-sm font-black whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        Chat with us! 👋
                    </div>
                </button>
            )
            }
        </div >
    );
}
