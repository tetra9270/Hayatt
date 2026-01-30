"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import Footer from "@/components/Footer";

export default function HelpPage() {
    return (
        <main className="min-h-screen pt-32 pb-20 px-6 bg-black text-white relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-900/20 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto relative z-10 max-w-4xl">
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-black uppercase mb-6 tracking-tighter"
                    >
                        Nexus Support Grid
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="relative max-w-xl mx-auto"
                    >
                        <input
                            type="text"
                            placeholder="Search the database..."
                            className="w-full bg-white/10 border border-white/10 rounded-full px-6 py-4 pl-12 focus:outline-none focus:border-blue-500 focus:bg-white/5 transition-all"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </motion.div>
                </div>

                <div className="grid gap-6">
                    {[
                        {
                            q: "How do I sync my Metamask wallet?",
                            a: "Navigate to the dashboard and click 'Connect Wallet'. Ensure you are on the Ethereum Mainnet or Polygon network."
                        },
                        {
                            q: "Are digital wearables cross-platform?",
                            a: "Yes. Our standard assets are compatible with Decentraland, Sandbox, and VR Chat via our proprietary conversion engine."
                        },
                        {
                            q: "What payment methods are accepted?",
                            a: "We accept credit cards, Bitcoin, Ethereum, and Nexus tokens. Crypto payments are processed instantly."
                        },
                        {
                            q: "Can I refund an NFT?",
                            a: "Due to the immutable nature of the blockchain, NFT purchases are final. Contact support if you believe a transaction was fraudulent."
                        }
                    ].map((faq, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-colors group cursor-pointer"
                        >
                            <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{faq.q}</h3>
                            <p className="text-gray-400">{faq.a}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-gray-400">Still need assistance?</p>
                    <a href="mailto:support@nexus.store" className="text-blue-400 hover:text-blue-300 font-bold mt-2 inline-block">Execute Support Protocol &rarr;</a>
                </div>
            </div>
            <div className="mt-20">
                <Footer />
            </div>
        </main>
    );
}
