"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { ChevronRight, ChevronLeft, ArrowRight } from "lucide-react";

const slides = [
    {
        id: 1,
        title: "Sonic Immersion",
        subtitle: "Experience sound like never before with 8D spatial audio.",
        image: "/images/hero-headphone.png",
        color: "from-blue-500 to-purple-600",
    },
    {
        id: 2,
        title: "Future on Wrist",
        subtitle: "Holographic interfaces meeting premium craftsmanship.",
        image: "/images/hero-smartwatch.png",
        color: "from-yellow-400 to-orange-500",
    },
    {
        id: 3,
        title: "Reality Redefined",
        subtitle: "Step into new worlds with ultra-low latency VR.",
        image: "/images/hero-vr.png",
        color: "from-teal-400 to-cyan-500",
    },
    {
        id: 4,
        title: "Cyber Fashion",
        subtitle: "Smart fabrics that adapt to your environment.",
        image: "/images/hero-wear-jacket.png",
        color: "from-pink-500 to-rose-500",
    },
    {
        id: 5,
        title: "Gravity Defying",
        subtitle: "Next-gen footwear with kinetic energy response.",
        image: "/images/hero-wear-sneaker.png",
        color: "from-cyan-400 to-blue-500",
    },
];

export default function HeroCarousel() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

    return (
        <div className="relative h-[80vh] w-full overflow-hidden flex items-center justify-center perspective-1000">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.7 }}
                    className="absolute inset-0 flex flex-col md:flex-row items-center justify-between px-6 md:px-20 container mx-auto"
                >
                    {/* Text Content */}
                    <div className="md:w-1/2 z-10 space-y-8 text-center md:text-left pt-20 md:pt-0">
                        <motion.h2
                            initial={{ y: 20, opacity: 0, rotateX: -90 }}
                            animate={{ y: 0, opacity: 1, rotateX: 0 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className={`text-4xl md:text-8xl font-black tracking-tighter drop-shadow-2xl bg-clip-text text-transparent bg-gradient-to-r ${slides[current].color} uppercase`}
                            style={{ textShadow: "0 10px 30px rgba(0,0,0,0.5)" }}
                        >
                            {slides[current].title}
                        </motion.h2>
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-2xl md:text-3xl text-gray-200 font-light max-w-lg mx-auto md:mx-0 drop-shadow-md"
                        >
                            {slides[current].subtitle}
                        </motion.p>
                        <motion.div
                            initial={{ y: 20, opacity: 0, scale: 0.8 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <button className={`
                    group relative px-8 py-4 font-bold text-white rounded-full 
                    bg-gradient-to-r ${slides[current].color} 
                    shadow-[0_0_30px_rgba(255,255,255,0.3)] 
                    transition-all duration-300 hover:scale-110 hover:shadow-[0_0_50px_rgba(255,255,255,0.5)] 
                    active:scale-95 flex items-center gap-3 text-xl
                `}>
                                <span className="relative z-10">Shop Now</span>
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    </div>

                    {/* Image Content */}
                    <div className="md:w-1/2 relative h-full flex items-center justify-center perspective-1000">
                        <motion.div
                            animate={{ y: [0, -30, 0], rotateY: [0, 5, 0] }}
                            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                            className="relative w-[300px] h-[300px] md:w-[650px] md:h-[650px]"
                        >
                            <img
                                src={slides[current].image}
                                alt={slides[current].title}
                                className="absolute inset-0 w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                            />
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <button onClick={prevSlide} className="absolute left-4 z-20 p-4 bg-white/5 hover:bg-white/20 rounded-full backdrop-blur-md transition border border-white/10 hover:border-white/30 hidden sm:block">
                <ChevronLeft className="w-8 h-8 text-white" />
            </button>
            <button onClick={nextSlide} className="absolute right-4 z-20 p-4 bg-white/5 hover:bg-white/20 rounded-full backdrop-blur-md transition border border-white/10 hover:border-white/30 hidden sm:block">
                <ChevronRight className="w-8 h-8 text-white" />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 z-20">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`h-2 rounded-full transition-all duration-500 ${index === current ? "bg-white w-12 shadow-[0_0_10px_white]" : "bg-white/20 w-4 hover:bg-white/40"}`}
                    />
                ))}
            </div>
        </div>
    );
}
