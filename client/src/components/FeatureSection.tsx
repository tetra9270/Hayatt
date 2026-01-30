"use client";

import { motion } from "framer-motion";
import { Zap, ShieldCheck, Box } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";

const features = [
    {
        image: "/images/feature-rocket.png",
        title: "Hyper-Speed Delivery",
        description: "Autonomous drone network ensures your gear arrives within hours.",
        color: "from-orange-400 to-red-600"
    },
    {
        image: "/images/feature-shield.png",
        title: "Quantum Secured",
        description: "Military-grade encryption protects your bio-data and transactions.",
        color: "from-green-400 to-emerald-600"
    },
    {
        image: "/images/feature-support.png",
        title: "Neural Support",
        description: "24/7 AI assistance with instant query resolution and hologram calls.",
        color: "from-purple-400 to-indigo-600"
    },
];

export default function FeatureSection() {
    return (
        <section className="py-16 md:py-32 relative z-10 px-6 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px] -z-10" />

            <div className="container mx-auto">
                <div className="text-center mb-12 md:mb-20 space-y-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-6xl font-black text-white uppercase tracking-tighter"
                    >
                        Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">Nexus?</span>
                    </motion.h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
                        Experience the next evolution of digital commerce.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 }}
                            whileHover={{ y: -10 }}
                        >
                            <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-md overflow-hidden group h-full hover:bg-zinc-900/60 transition-all duration-500 hover:border-white/10 shadow-2xl">
                                <CardHeader className="relative flex items-center justify-center pt-10 pb-2">
                                    <div className={`absolute inset-0 bg-gradient-to-b ${f.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                                    <motion.div
                                        className="relative w-40 h-40"
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ repeat: Infinity, duration: 4, delay: i, ease: "easeInOut" }}
                                    >
                                        <img
                                            src={f.image}
                                            alt={f.title}
                                            className="w-full h-full object-contain mix-blend-screen group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </motion.div>
                                </CardHeader>
                                <CardContent className="text-center pb-10 px-6 relative z-10">
                                    <CardTitle className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
                                        {f.title}
                                    </CardTitle>
                                    <CardDescription className="text-gray-400 text-lg leading-relaxed">
                                        {f.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
