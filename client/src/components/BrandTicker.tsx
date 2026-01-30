"use client";

import { motion } from "framer-motion";

// Custom SVG Logo Paths
const brands = [
    { id: 1, name: "APEX", path: "M12 2L2 22h20L12 2zm0 6l5 10H7l5-10z" },
    { id: 2, name: "BOLT", path: "M13 2L3 14h9l-1 8 10-12h-9l1-8z" },
    { id: 3, name: "CORE", path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" },
    { id: 4, name: "FLUX", path: "M12 2L2 12l10 10 10-10L12 2zm0 15l-5-5 5-5 5 5-5 5z" },
    { id: 5, name: "ZENITH", path: "M22 12l-4-4v3H6v2h12v3l4-4z" },
    { id: 6, name: "OMEGA", path: "M12 2c5.52 0 10 4.48 10 10 0 2.39-0.85 4.59-2.26 6.32l-1.57-1.57C19.1 15.48 19.62 13.82 19.62 12c0-4.2-3.41-7.62-7.62-7.62S4.38 7.8 4.38 12c0 1.83 0.52 3.49 1.45 4.75l-1.57 1.57C2.85 16.59 2 14.39 2 12 2 6.48 6.48 2 12 2zM9 20v2h6v-2H9z" },
    { id: 7, name: "PULSE", path: "M3 13h4l2-5 4 10 3-7h5v2h-4l-2 5-4-10-3 7H3z" },
    { id: 8, name: "ECHO", path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6 2.69-6 6-6zm0 4c1.1 0 2 0.9 2 2s-0.9 2-2 2-2-0.9-2-2 0.9-2 2-2z" },
    { id: 9, name: "NOVA", path: "M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" },
    { id: 10, name: "DRIFT", path: "M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" }
];

export default function BrandTicker() {
    return (
        <section className="py-12 border-y border-white/5 bg-black/50 backdrop-blur-sm overflow-hidden relative z-10">
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-10" />

            <div className="flex">
                <motion.div
                    className="flex gap-12 md:gap-32 items-center"
                    animate={{ x: "-50%" }}
                    transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
                >
                    {/* Tripling the array to ensure smooth infinite scroll */}
                    {[...brands, ...brands, ...brands, ...brands].map((brand, i) => (
                        <div key={i} className="flex items-center gap-4 group cursor-pointer opacity-50 hover:opacity-100 transition-opacity duration-300">
                            {/* SVG Icon Container with Glow */}
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors drop-shadow-[0_0_10px_rgba(255,255,255,0.1)] group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                                <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white">
                                    <path d={brand.path} />
                                </svg>
                            </div>
                            {/* Brand Name Text */}
                            <span className="text-2xl font-black tracking-[0.2em] text-white">
                                {brand.name}
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
