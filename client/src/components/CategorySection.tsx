"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';

const categories = [
    { name: "Fashion", image: "/images/cat-fashion.png", color: "shadow-purple-500/40" },
    { name: "Sneakers", image: "/images/cat-shoes.png", color: "shadow-blue-500/40" },
    { name: "Gaming", image: "/images/cat-gaming.png", color: "shadow-green-500/40" },
    { name: "Tech", image: "/images/cat-electronics.png", color: "shadow-cyan-500/40" },
    { name: "Luxury", image: "/images/cat-accessories.png", color: "shadow-yellow-500/40" },
    { name: "Streetwear", image: "/images/cat-fashion.png", color: "shadow-pink-500/40" },
    { name: "Sport", image: "/images/cat-shoes.png", color: "shadow-orange-500/40" },
    { name: "VR/AR", image: "/images/hero-vr.png", color: "shadow-indigo-500/40" },
    { name: "Smart Home", image: "/images/cat-electronics.png", color: "shadow-teal-500/40" },
];

export default function CategorySection() {
    const marqueeList = [...categories, ...categories, ...categories];

    return (
        <section className="py-16 relative z-10 w-full overflow-hidden">
            <div className="container mx-auto px-6 mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="w-full md:w-auto">
                    <h2 className="text-3xl md:text-6xl font-black text-white mb-4 uppercase tracking-tighter"
                        style={{ textShadow: "0 4px 0 #581c87, 0 10px 20px rgba(0,0,0,0.5)" }}
                    >
                        Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Categories</span>
                    </h2>
                    <p className="text-xl text-gray-300 font-light max-w-xl border-l-4 border-purple-500 pl-4">
                        Dive into the metaverse of shopping. Curated collections for the digital age.
                    </p>
                </div>

                {/* 3D View All Button */}
                <Link href="/products" className="group relative px-8 py-4 font-bold text-white rounded-xl bg-gradient-to-br from-zinc-800 to-black shadow-lg shadow-purple-900/20 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/40 active:scale-95 flex items-center gap-3 overflow-hidden border border-white/10 uppercase tracking-widest text-sm inline-flex w-full md:w-auto justify-center md:justify-start">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative z-10">View All</span>
                    <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform text-purple-400" />
                </Link>
            </div>

            {/* CSS-based Infinite Marquee with Hover Pause */}
            <div className="marquee-container overflow-hidden whitespace-nowrap mask-fade-sides py-8">
                <div className="marquee-content inline-flex gap-8 animate-marquee">
                    {marqueeList.map((cat, i) => (
                        <Link href={`/products?category=${cat.name}`} key={i} className="group/card relative flex-shrink-0 perspective-500">
                            <div className={`
                        w-56 h-72 rounded-[2rem] bg-zinc-900/80 backdrop-blur-md 
                        border border-white/5 overflow-hidden flex flex-col items-center justify-center
                        transform transition-all duration-500 group-hover/card:scale-110 group-hover/card:rotate-y-12
                        ${cat.color} group-hover/card:shadow-[0_0_40px_rgba(0,0,0,0.6)] whitespace-normal z-10 hover:z-20
                    `}>
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

                                <div className="relative w-48 h-48 mb-6 transition-transform duration-500 group-hover/card:-translate-y-4 group-hover/card:scale-110">
                                    <img
                                        src={cat.image}
                                        alt={cat.name}
                                        className="absolute inset-0 w-full h-full object-contain drop-shadow-2xl"
                                    />
                                </div>
                                <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-black via-black/80 to-transparent text-center">
                                    <h3 className="text-xl font-bold text-white group-hover/card:text-transparent group-hover/card:bg-clip-text group-hover/card:bg-gradient-to-r group-hover/card:from-purple-300 group-hover/card:to-pink-300 transition-all uppercase tracking-wider">{cat.name}</h3>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <style jsx global>{`
        .mask-fade-sides {
            mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
        
        .marquee-container:hover .marquee-content {
            animation-play-state: paused;
        }

        .animate-marquee {
            animation: scroll 60s linear infinite;
        }

        @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-100%); } 
        }
      `}</style>
        </section>
    );
}
