"use client";

import { motion } from "framer-motion";
import Image from 'next/image';
import { ArrowRight, Mail } from 'lucide-react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function Newsletter() {
    return (
        <section className="py-12 md:py-24 relative z-10 w-full overflow-hidden border-t border-white/10">
            <div className="container mx-auto px-6 relative">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">

                    {/* Text & Form */}
                    <div className="md:w-1/2 z-10 space-y-6 md:space-y-8 text-center md:text-left">
                        <h2 className="text-3xl md:text-7xl font-bold text-white tracking-tighter loading-none">
                            JOIN THE <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">METAVERSE</span>
                        </h2>
                        <p className="text-xl text-gray-400 max-w-lg">
                            Get early access to exclusive drops, VR events, and digital collectibles.
                            Enter your Neural ID to synchronize.
                        </p>

                        <div className="flex gap-4 max-w-md">
                            <div className="relative flex-grow">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="pl-12 h-14 bg-white/5 border-white/10 rounded-xl text-white focus:border-purple-500 focus:ring-purple-500"
                                />
                            </div>
                            <Button className="h-14 px-8 rounded-xl bg-white text-black font-bold hover:bg-gray-200">
                                <ArrowRight className="w-6 h-6" />
                            </Button>
                        </div>
                    </div>

                    {/* Globe Visual */}
                    <div className="md:w-1/2 relative h-[500px] w-full flex items-center justify-center">
                        <div className="absolute inset-0 bg-blue-500/20 blur-[120px] rounded-full" />
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
                            className="relative w-[300px] h-[300px] md:w-[600px] md:h-[600px] opacity-80"
                        >
                            <Image
                                src="/images/newsletter-globe.png"
                                alt="Metaverse Globe"
                                fill
                                className="object-contain"
                            />
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
