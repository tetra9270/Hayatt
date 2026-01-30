"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ShoppingCart, Menu, Search, Heart, User } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useEffect, useState } from 'react';
import { useCurrency } from '@/context/CurrencyContext';

const CurrencySelector = () => {
    const { currency, setCurrency } = useCurrency();
    return (
        <div className="hidden lg:flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/5">
            {['USD', 'EUR', 'INR'].map((c) => (
                <button
                    key={c}
                    onClick={() => setCurrency(c as any)}
                    className={`px-2 py-1 text-[10px] font-bold rounded-full transition-all ${currency === c ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-white'}`}
                >
                    {c}
                </button>
            ))}
        </div>
    );
};

export function Navbar() {
    const pathname = usePathname();
    const { user } = useAuthStore();
    const [mounted, setMounted] = useState(false);
    const cartLength = useCartStore((state) => state.cart.length);

    useEffect(() => {
        setMounted(true);
    }, []);

    const navItems = [
        { name: 'Home', href: '/' },
        { name: 'Products', href: '/products' },
        { name: 'About', href: '/about' },
    ];

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="sticky top-0 z-50 w-full pt-4 px-4 md:px-8 bg-transparent pointer-events-none"
        >
            <div className="pointer-events-auto max-w-7xl mx-auto backdrop-blur-xl bg-black/60 border border-white/10 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] flex items-center justify-between p-4 relative overflow-visible group">

                {/* 3D Glass Reflection Effect */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl" />

                {/* Left: Logo */}
                <div className="flex items-center gap-8 shrink-0">
                    <Link href="/" className="flex items-center gap-2 group/logo relative z-10">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden shadow-lg group-hover/logo:rotate-12 transition-transform duration-300">
                            <img src="/images/hayatt-logo.jpg" alt="Hayatt Logo" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-black tracking-tight text-white leading-none">HAYATT</span>
                            <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase leading-none">Store</span>
                        </div>
                    </Link>

                    {/* Nav Links (Desktop) */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 relative z-10 hover:bg-white/10",
                                    pathname === item.href ? "text-white bg-white/10" : "text-gray-400 hover:text-white"
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                        {mounted && user?.role === 'admin' && (
                            <Link
                                href="/admin"
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 relative z-10 hover:bg-white/10",
                                    pathname === '/admin' ? "text-red-500 bg-red-500/10 border border-red-500/20" : "text-red-400 hover:text-red-300"
                                )}
                            >
                                Admin Command
                            </Link>
                        )}
                    </nav>
                </div>

                {/* Center: Massive Search Bar */}
                <div className="hidden md:flex flex-1 max-w-2xl px-8 relative z-10">
                    <div className="relative w-full group/search">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-md opacity-0 group-focus-within/search:opacity-100 transition-opacity duration-500" />
                        <div className="relative flex items-center w-full h-12 bg-black/40 border border-white/10 rounded-full hover:border-white/20 focus-within:border-purple-500/50 transition-colors overflow-hidden">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within/search:text-purple-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search for 'Cyber Jacket'..."
                                className="w-full h-full bg-transparent pl-12 pr-4 xl:pr-32 text-white placeholder:text-gray-600 focus:outline-none"
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-white/5 rounded-full text-xs text-gray-500 border border-white/5 hidden xl:block pointer-events-none">
                                CTRL + K
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3 shrink-0 relative z-10">
                    <CurrencySelector />

                    {/* Wishlist */}
                    <Link href="/dashboard?tab=wishlist">
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-pink-500 hover:bg-pink-500/10 rounded-full transition-all duration-300 hidden sm:flex">
                            <Heart className="w-5 h-5" />
                        </Button>
                    </Link>

                    {/* Cart */}
                    <Link href="/checkout">
                        <Button variant="ghost" size="icon" className="relative text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-full transition-all duration-300">
                            <ShoppingCart className="w-5 h-5" />
                            {cartLength > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)] text-[10px] flex items-center justify-center text-white font-bold">
                                    {cartLength}
                                </span>
                            )}
                        </Button>
                    </Link>

                    <div className="h-6 w-px bg-white/10 mx-1 hidden sm:block" />

                    <div className="hidden sm:flex gap-3">
                        {mounted && user ? (
                            <Link href="/dashboard">
                                <Button className="bg-white/10 text-white hover:bg-white/20 rounded-full font-bold shadow-sm transition-all flex items-center gap-2 border border-white/5">
                                    <User className="w-4 h-4" />
                                    <span>Profile</span>
                                    {user.rank && (
                                        <span className="ml-1 px-1.5 py-0.5 rounded bg-blue-500 text-[10px] font-black uppercase tracking-wider">{user.rank}</span>
                                    )}
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/5 rounded-full">
                                        Log In
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button className="bg-white text-black hover:bg-gray-200 rounded-full font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all">
                                        Sign Up
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden text-gray-400 hover:text-white"
                        onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                    >
                        <Search className="w-5 h-5" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden text-white"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <Menu className="w-6 h-6" />
                    </Button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute top-24 left-4 right-4 bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col gap-2 shadow-2xl z-40 lg:hidden"
                >
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                                "px-4 py-3 rounded-xl text-sm font-medium transition-all",
                                pathname === item.href ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            {item.name}
                        </Link>
                    ))}
                    {mounted && user?.role === 'admin' && (
                        <Link
                            href="/admin"
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                                "px-4 py-3 rounded-xl text-sm font-medium transition-all text-red-400 hover:bg-white/5 hover:text-red-300",
                                pathname === '/admin' ? "bg-red-500/10 text-red-500" : ""
                            )}
                        >
                            Admin Command
                        </Link>
                    )}
                    <div className="h-px bg-white/10 my-2" />
                    {mounted && user ? (
                        <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                            <Button className="w-full bg-white/10 text-white hover:bg-white/20 rounded-xl justify-start">
                                <User className="w-4 h-4 mr-2" />
                                Profile ({user.rank || 'Member'})
                            </Button>
                        </Link>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                <Button variant="ghost" className="w-full text-gray-300 hover:text-white justify-start">
                                    Log In
                                </Button>
                            </Link>
                            <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                                <Button className="w-full bg-white text-black hover:bg-gray-200 justify-start">
                                    Sign Up
                                </Button>
                            </Link>
                        </div>
                    )}
                </motion.div>
            )}
            {/* Mobile Search Input */}
            {mobileSearchOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-24 left-4 right-4 z-40 md:hidden"
                >
                    <div className="relative flex items-center w-full h-12 bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                        <Search className="absolute left-4 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            autoFocus
                            className="w-full h-full bg-transparent pl-12 pr-4 text-white placeholder:text-gray-500 focus:outline-none"
                        />
                    </div>
                </motion.div>
            )}
        </motion.header>
    );
}
