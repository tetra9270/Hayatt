"use client";

import { motion } from "framer-motion";
import Footer from "@/components/Footer";

export default function TermsPage() {
    return (
        <main className="min-h-screen pt-32 pb-20 px-6 bg-black text-white relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto relative z-10 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-5xl font-black uppercase mb-8 tracking-tighter">Terms of Service</h1>
                    <p className="text-xl text-gray-400 mb-12 leading-relaxed">
                        Welcome to Hayatt Store. By accessing or using our platform, you agree to be bound by these terms.
                        We deal in the future of digital ownership. Tread carefully.
                    </p>

                    <div className="space-y-12">
                        {[
                            {
                                title: "1. Acceptance of Terms",
                                content: "By utilizing the Hayatt Store platform, services, or smart contracts, you confirm your acceptance of these Terms of Service. If you do not agree, do not access our metaverse endpoints."
                            },
                            {
                                title: "2. Digital Assets & ownership",
                                content: "All NFTs and digital wearables purchased on Hayatt Store are secured on the blockchain. You own the cryptographic token representing the asset. However, intellectual property rights remain with the original creator unless explicitly transferred."
                            },
                            {
                                title: "3. User Conduct",
                                content: "You agree not to use the platform for illicit activities, market manipulation, or exploiting smart contract vulnerabilities. Any detected anomaly will result in immediate termination of access."
                            },
                            {
                                title: "4. Payments & Refunds",
                                content: "Transactions on the blockchain are irreversible. All sales of digital assets are final. Fiat transactions for physical goods are subject to our standard return policy within 14 days."
                            }
                        ].map((section, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
                            >
                                <h2 className="text-2xl font-bold mb-4 text-blue-400">{section.title}</h2>
                                <p className="text-gray-300 leading-relaxed">{section.content}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-16 pt-8 border-t border-white/10 text-gray-500 text-sm">
                        Last Updated: December 25, 2025
                    </div>
                </motion.div>
            </div>
            <div className="mt-20">
                <Footer />
            </div>
        </main>
    );
}
