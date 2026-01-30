"use client";

import { motion } from "framer-motion";
import Image from 'next/image';
import { ShoppingBag, Zap } from 'lucide-react';
import { Button } from "./ui/button";
import { useState, useEffect } from 'react';

export default function DealOfTheDay() {
    const [timeLeft, setTimeLeft] = useState({ h: 4, m: 23, s: 12 });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.s > 0) return { ...prev, s: prev.s - 1 };
                if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
                if (prev.h > 0) return { ...prev, h: prev.h - 1, m: 59, s: 59 };
                return prev;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="py-12 md:py-24 relative z-10 w-full overflow-hidden">
            {/* Background Gradient Mesh */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-700/10 to-purple-900/10 blur-[100px] -z-10" />

            <div className="container mx-auto px-6">
                <div className="relative rounded-[2rem] md:rounded-[3rem] bg-zinc-900/60 backdrop-blur-3xl border border-yellow-500/20 overflow-hidden min-h-[600px] flex flex-col md:flex-row items-center">

                    {/* Product Image (Left) */}
                    <div className="w-full md:w-1/2 h-[300px] md:h-full relative flex items-center justify-center p-6 md:p-10">
                        <motion.div
                            animate={{ y: [0, -20, 0], rotate: [0, 2, 0] }}
                            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                            className="relative w-full h-full"
                        >
                            <img
                                src="/images/deal-exclusive.png"
                                alt="Exclusive Deal"
                                className="object-contain drop-shadow-[0_0_50px_rgba(234,179,8,0.3)] w-full h-full"
                            />
                        </motion.div>

                        {/* Exclusive Badge */}
                        <div className="absolute top-6 left-6 md:top-10 md:left-10 bg-yellow-500 text-black font-black uppercase px-3 py-1 md:px-4 md:py-2 rounded-full tracking-widest text-xs md:text-sm shadow-[0_0_20px_rgba(234,179,8,0.5)]">
                            Exclusive Drop
                        </div>
                    </div>

                    {/* Content (Right) */}
                    <div className="w-full md:w-1/2 p-6 md:p-20 flex flex-col justify-center space-y-6 md:space-y-8 text-center md:text-left">
                        <div className="space-y-2 md:space-y-4">
                            <motion.h2
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                className="text-3xl md:text-7xl font-black text-white uppercase italic tracking-tighter"
                            >
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">Golden</span> Cyber Jacket
                            </motion.h2>
                            <p className="text-xl text-gray-300 font-light">
                                Limited Edition. Nanotech fiber with self-healing properties.
                                Only 100 units available worldwide.
                            </p>
                        </div>

                        {/* Timer */}
                        <div className="flex justify-center md:justify-start gap-4 text-white">
                            {['h', 'm', 's'].map((unit, i) => (
                                <div key={i} className="flex flex-col items-center">
                                    <div className="w-20 h-20 bg-black/50 rounded-2xl border border-white/10 flex items-center justify-center text-4xl font-mono text-yellow-500 shadow-inner">
                                        {String(timeLeft[unit as keyof typeof timeLeft]).padStart(2, '0')}
                                    </div>
                                    <span className="text-xs text-gray-500 mt-2 uppercase">{unit === 'h' ? 'Hours' : unit === 'm' ? 'Minutes' : 'Seconds'}</span>
                                </div>
                            ))}
                        </div>

                        {/* Price and Action */}
                        <div className="flex flex-col md:flex-row items-center gap-8 pt-4">
                            <div className="text-left">
                                <p className="text-gray-400 line-through text-lg">$1,299</p>
                                <p className="text-5xl font-bold text-white">$899</p>
                            </div>
                            <Button className="h-16 px-10 rounded-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:scale-105 transition-transform text-black text-xl font-bold shadow-[0_0_40px_rgba(234,179,8,0.4)]">
                                <ShoppingBag className="w-6 h-6 mr-3" />
                                Buy Now
                            </Button>
                        </div>

                        <div className="flex items-center justify-center md:justify-start gap-2 text-red-400 animate-pulse">
                            <Zap className="w-5 h-5" />
                            <span className="font-bold">Selling Fast! 12 units left</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
