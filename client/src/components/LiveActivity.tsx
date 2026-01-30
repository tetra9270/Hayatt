"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X } from "lucide-react";
import Image from "next/image"; // Kept import if we want to use tiny product thumbs later

const names = ["User_99", "CyberShadow", "NeoDrifter", "PixelHunt", "Vortex_X", "Glitch_01"];
const products = ["Golden Cyber Jacket", "Neural Headset", "Levitating Sneakers", "Quantum Watch", "Holo-Visor"];
const locations = ["Neo Tokyo", "Silicon Valley", "Cyber City", "Metaverse Sector 7", "New York"];

export default function LiveActivity() {
    const [notification, setNotification] = useState<{ name: string; product: string; location: string } | null>(null);

    useEffect(() => {
        // Initial delay
        const initialTimeout = setTimeout(() => {
            triggerNotification();
        }, 3000);

        // Interval loop
        const interval = setInterval(() => {
            triggerNotification();
        }, 300000); // Trigger every 5 minutes

        return () => {
            clearTimeout(initialTimeout);
            clearInterval(interval);
        };
    }, []);

    const triggerNotification = () => {
        // 50% chance to show a notification if one isn't already showing
        setNotification({
            name: names[Math.floor(Math.random() * names.length)],
            product: products[Math.floor(Math.random() * products.length)],
            location: locations[Math.floor(Math.random() * locations.length)],
        });

        // Auto hide after 4 seconds
        setTimeout(() => {
            setNotification(null);
        }, 4000);
    };

    if (!notification) return null;

    return (
        <AnimatePresence>
            {notification && (
                <motion.div
                    initial={{ opacity: 0, x: -50, y: 50 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0, x: -50, scale: 0.9 }}
                    className="fixed bottom-6 left-6 z-50 max-w-sm w-full"
                >
                    <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-[0_0_20px_rgba(0,0,0,0.5)] flex items-center gap-4 relative overflow-hidden group">
                        {/* Animated Border Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-50 group-hover:opacity-100 transition-opacity" />

                        <div className="relative z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                            <ShoppingBag className="w-5 h-5 text-green-400" />
                        </div>

                        <div className="relative z-10 flex-1">
                            <p className="text-sm text-gray-200">
                                <span className="font-bold text-white">{notification.name}</span> purchased
                            </p>
                            <p className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                                {notification.product}
                            </p>
                            <p className="text-[10px] text-gray-500 uppercase mt-1">
                                From {notification.location} • Just now
                            </p>
                        </div>

                        <button
                            onClick={() => setNotification(null)}
                            className="relative z-10 text-gray-500 hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
