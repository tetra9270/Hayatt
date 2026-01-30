"use client";

import { motion } from "framer-motion";
import { User, Star, Quote } from "lucide-react";
import { Card, CardContent } from "./ui/card";

const reviews = [
    {
        name: "Alex_Cipher",
        role: "VR Architect",
        content: "The haptic feedback on the Cyber Jacket is unreal. I can literally feel the digital rain.",
        image: "/images/hero-vr.png",
        color: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]"
    },
    {
        name: "Neon_Valkyrie",
        role: "Pro Gamer",
        content: "Zero latency in the neural link headset. Beating my high scores has never felt this effortless.",
        image: "/images/hero-headphone.png",
        color: "group-hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]"
    },
    {
        name: "Unit_734",
        role: "Android Model",
        content: "Aesthetics match my chassis perfectly. The build quality exceeds standard factory parameters.",
        image: "/images/feature-support.png",
        color: "group-hover:shadow-[0_0_30px_rgba(234,179,8,0.2)]"
    }
];

export default function Testimonials() {
    return (
        <section className="py-16 md:py-24 relative z-10 px-6">
            <div className="container mx-auto">
                <div className="text-center mb-10 md:mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tighter">
                        VOICES FROM THE <span className="text-gray-500 italic">VOID</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reviews.map((r, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 }}
                            whileHover={{ y: -5 }}
                        >
                            <Card className={`bg-black/40 border-white/10 backdrop-blur-md relative overflow-hidden group transition-all duration-500 ${r.color} hover:border-white/20`}>
                                {/* Holographic Scanline Effect */}
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 opacity-20 pointer-events-none bg-[length:100%_4px,3px_100%]" />

                                <CardContent className="p-8 relative z-10">
                                    <div className="flex items-center gap-6 mb-6">
                                        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden relative">
                                            <img
                                                src={r.image}
                                                alt={r.name}
                                                className="w-full h-full object-contain mix-blend-screen scale-125 hover:scale-150 transition-transform duration-500"
                                            />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold tracking-wide">{r.name}</h4>
                                            <p className="text-xs text-gray-500 uppercase tracking-widest">{r.role}</p>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star key={s} className="w-4 h-4 text-yellow-500 inline-block mr-1 fill-yellow-500" />
                                        ))}
                                    </div>

                                    <p className="text-gray-300 italic leading-relaxed">
                                        "{r.content}"
                                    </p>

                                    <Quote className="absolute top-8 right-8 text-white/5 w-16 h-16 rotate-180" />
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
