"use client";

import { motion } from "framer-motion";
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { Button } from "./ui/button";
import { useCartStore } from "@/store/cartStore";

const products = [
    {
        id: 1,
        name: "Cyber Bomber",
        category: "Fashion",
        price: 299,
        rating: 4.8,
        image: "/images/hero-wear-jacket.png",
        color: "shadow-pink-500/20",
        gradient: "from-pink-500 to-purple-600"
    },
    {
        id: 2,
        name: "Velocita X1",
        category: "Sneakers",
        price: 189,
        rating: 4.9,
        image: "/images/hero-wear-sneaker.png",
        color: "shadow-cyan-500/20",
        gradient: "from-cyan-400 to-blue-500"
    },
    {
        id: 3,
        name: "Nexus Vision Pro",
        category: "VR/AR",
        price: 999,
        rating: 5.0,
        image: "/images/hero-vr.png",
        color: "shadow-green-500/20",
        gradient: "from-green-400 to-emerald-600"
    },
    {
        id: 4,
        name: "Chrono Void",
        category: "Luxury",
        price: 549,
        rating: 4.7,
        image: "/images/cat-accessories.png",
        color: "shadow-yellow-500/20",
        gradient: "from-yellow-400 to-amber-600"
    },
    {
        id: 5,
        name: "Sonic Pulse",
        category: "Audio",
        price: 349,
        rating: 4.8,
        image: "/images/hero-headphone.png",
        color: "shadow-indigo-500/20",
        gradient: "from-indigo-400 to-violet-600"
    },
    {
        id: 6,
        name: "Holo Watch",
        category: "Tech",
        price: 429,
        rating: 4.6,
        image: "/images/hero-smartwatch.png",
        color: "shadow-orange-500/20",
        gradient: "from-orange-400 to-red-600"
    },
    {
        id: 7,
        name: "Stealth Drone",
        category: "Drones",
        price: 799,
        rating: 4.9,
        image: "/images/cat-electronics.png",
        color: "shadow-blue-500/20",
        gradient: "from-blue-400 to-sky-600"
    },
    {
        id: 8,
        name: "Neo Controller",
        category: "Gaming",
        price: 129,
        rating: 4.7,
        image: "/images/cat-gaming.png",
        color: "shadow-purple-500/20",
        gradient: "from-purple-400 to-fuchsia-600"
    }
];

export default function TrendingDrops() {
    return (
        <section className="py-12 md:py-24 relative z-10">
            <div className="container mx-auto px-6">
                <div className="text-center mb-10 md:mb-16 space-y-4">
                    <h2 className="text-3xl md:text-6xl font-black text-white uppercase tracking-tighter"
                        style={{ textShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
                        Trending <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Drops</span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Exclusive limited-time releases. Secure your gear before it vanishes from the grid.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product, i) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <div className={`
                        group relative bg-zinc-900/40 backdrop-blur-xl border border-white/10 
                        rounded-3xl overflow-hidden hover:border-white/20 transition-all duration-500
                        hover:bg-zinc-800/60 ${product.color} hover:shadow-2xl
                    `}>
                                {/* Image Area */}
                                <div className="relative h-64 p-6 flex items-center justify-center bg-gradient-to-b from-white/5 to-transparent">
                                    <motion.div
                                        whileHover={{ scale: 1.1, rotate: 5, y: -10 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                        className="relative w-full h-full"
                                    >
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="absolute inset-0 w-full h-full object-contain drop-shadow-xl"
                                        />
                                    </motion.div>

                                    {/* Floating Badges */}
                                    <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-medium text-gray-300">
                                        {product.category}
                                    </div>
                                    <button className="absolute top-4 right-4 p-2 rounded-full bg-black/50 border border-white/10 text-gray-400 hover:text-red-500 hover:bg-white/10 transition-colors">
                                        <Heart className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Content Area */}
                                <div className="p-6 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-colors">
                                                {product.name}
                                            </h3>
                                            <div className="flex items-center gap-1 mt-1">
                                                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                                <span className="text-xs text-gray-400">{product.rating}</span>
                                            </div>
                                        </div>
                                        <div className="text-lg font-bold text-white bg-white/10 px-3 py-1 rounded-lg">
                                            ${product.price}
                                        </div>
                                    </div>

                                    <Link href="/products" className="w-full">
                                        <Button
                                            className={`
                                w-full font-bold relative overflow-hidden group/btn
                                bg-gradient-to-r ${product.gradient} border-0
                            `}>
                                            <span className="relative z-10 flex items-center justify-center gap-2">
                                                <ShoppingCart className="w-4 h-4" />
                                                Shop Now
                                            </span>
                                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <Link href="/products">
                        <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-white min-w-[200px] py-6 rounded-full text-lg">
                            View All Collection
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
