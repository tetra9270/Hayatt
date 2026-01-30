"use client";

import { motion } from "framer-motion";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
    return (
        <main className="min-h-screen pt-32 pb-20 px-6 bg-black text-white relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-green-600/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto relative z-10 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-5xl font-black uppercase mb-8 tracking-tighter">Privacy Protocol</h1>
                    <p className="text-xl text-gray-400 mb-12 leading-relaxed">
                        Your data sovereignty is our priority. In the Nexus, identity is fluid, but privacy is absolute.
                    </p>

                    <div className="space-y-12">
                        {[
                            {
                                title: "1. Data Collection",
                                content: "We collect minimal data necessary for transaction processing and account recovery. This includes public wallet addresses, email (if provided), and transaction history."
                            },
                            {
                                title: "2. Decentralized Identity",
                                content: "We do not link your wallet address to real-world identities unless mandated by law for fiat transactions. Your metaverse persona remains pseudonymous."
                            },
                            {
                                title: "3. Smart Contract Interactions",
                                content: "Interactions with our smart contracts are public on the blockchain. We cannot delete or hide data once it is written to the ledger."
                            },
                            {
                                title: "4. Third-Party Integration",
                                content: "Integrations with Metamask, Phantom, or other Web3 providers are subject to their respective privacy policies. We do not have access to your private keys."
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
                                <h2 className="text-2xl font-bold mb-4 text-green-400">{section.title}</h2>
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
