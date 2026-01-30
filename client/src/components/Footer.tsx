"use client";

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Github, CreditCard, Bitcoin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="relative z-10 bg-black text-white pt-20 pb-10 border-t border-white/10 overflow-hidden">
            {/* Background Grid Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] z-0 pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <h3 className="text-3xl font-black tracking-tighter uppercase mb-4">
                            HAYATT<span className="text-purple-500">.STORE</span>
                        </h3>
                        <p className="text-gray-400 leading-relaxed">
                            The premier destination for digital fashion and metaverse assets.
                            Secure your identity in the new world.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Github].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-purple-400 transition-colors border border-white/5">
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 uppercase tracking-wider">Shop</h4>
                        <ul className="space-y-4 text-gray-400">
                            {[
                                { label: 'New Arrivals', href: '/products' },
                                { label: 'Best Sellers', href: '/products?sort=rating' },
                                { label: 'Digital Wearables', href: '/products?category=Wearables' },
                                { label: 'NFT Collectibles', href: '/products?category=NFTs' },
                                { label: 'Accessories', href: '/products?category=Accessories' }
                            ].map((item) => (
                                <li key={item.label}>
                                    <Link href={item.href} className="hover:text-white hover:translate-x-2 transition-all inline-block">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 uppercase tracking-wider">Support</h4>
                        <ul className="space-y-4 text-gray-400">
                            {[
                                { label: 'Help Center', href: '/help' },
                                { label: 'Transactions', href: '/dashboard?tab=orders' },
                                { label: 'Metamask Sync', href: '/help' },
                                { label: 'Terms of Service', href: '/terms' },
                                { label: 'Privacy Policy', href: '/privacy' }
                            ].map((item) => (
                                <li key={item.label}>
                                    <Link href={item.href} className="hover:text-white hover:translate-x-2 transition-all inline-block">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter / Contact */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 uppercase tracking-wider">Accepted Payments</h4>
                        <div className="flex gap-4 mb-8">
                            <div className="w-12 h-8 bg-white/5 rounded border border-white/10 flex items-center justify-center" title="Credit Card">
                                <CreditCard className="w-5 h-5 text-gray-300" />
                            </div>
                            <div className="w-12 h-8 bg-white/5 rounded border border-white/10 flex items-center justify-center" title="Bitcoin">
                                <Bitcoin className="w-5 h-5 text-orange-500" />
                            </div>
                            <div className="w-12 h-8 bg-white/5 rounded border border-white/10 flex items-center justify-center" title="Ethereum">
                                {/* Simple Diamond/Eth shape using div */}
                                <div className="w-3 h-5 bg-blue-400 clip-path-polygon-[50%_0%,100%_50%,50%_100%,0%_50%]" />
                            </div>
                        </div>
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-white/5">
                            <p className="text-sm text-gray-300 font-medium">
                                "The potential of the metaverse is limited only by our imagination."
                            </p>
                        </div>
                    </div>

                    {/* Developers */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 uppercase tracking-wider">Developers</h4>
                        <ul className="space-y-4 text-gray-400">
                            {[
                                { name: 'Asif Hussain', role: 'Lead Architect' },
                                { name: 'Mohd Musab', role: 'Core Engineer' }
                            ].map((dev) => (
                                <li key={dev.name}>
                                    <div className="group flex items-center gap-3 cursor-pointer hover:text-white transition-colors">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-[1px]">
                                            <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-xs font-bold">
                                                {dev.name[0]}
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-medium group-hover:translate-x-1 transition-transform">{dev.name}</span>
                                            <span className="text-xs text-blue-400">{dev.role}</span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                    <p>&copy; 2025 Hayatt Store Inc. All rights reserved.</p>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-white transition-colors">Accessibility</a>
                        <a href="#" className="hover:text-white transition-colors">Sitemap</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
