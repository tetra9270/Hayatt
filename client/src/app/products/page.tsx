"use client";
import { API_BASE_URL } from '@/lib/utils';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Search, LayoutGrid, List as ListIcon, CheckCircle, Heart, ArrowUpDown, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';

// Components
import FlashSaleBanner from '@/components/products/FlashSaleBanner';
import SectorSelection from '@/components/products/SectorSelection';
import ElitePicks from '@/components/products/ElitePicks';
import ProductGrid from '@/components/products/ProductGrid';
import ProductModal from '@/components/products/ProductModal';
import CyberCart from '@/components/products/CyberCart';

// Data & Types
import { allProducts, categories, sortOptions } from '@/data/products';
import { CartItem, Product, Toast } from '@/types';
import { useAuthStore } from '@/store/authStore';

const ThreeScene = dynamic(() => import('@/components/ThreeScene'), { ssr: false });

function ProductContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Initialize state from URL if present
    const categoryParam = searchParams.get('category');
    const sortParam = searchParams.get('sort');

    const [activeCategory, setActiveCategory] = useState(categoryParam || "All");
    const [sortBy, setSortBy] = useState(sortParam || "featured");
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [wishlist, setWishlist] = useState<(number | string)[]>([]);
    const [toasts, setToasts] = useState<Toast[]>([]);

    // Sync URL when category/sort changes manually
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());

        if (activeCategory !== 'All') params.set('category', activeCategory);
        else params.delete('category');

        if (sortBy !== 'featured') params.set('sort', sortBy);
        else params.delete('sort');

        // Update URL efficiently without reload
        router.replace(`/products?${params.toString()}`, { scroll: false });
    }, [activeCategory, sortBy, router, searchParams]);

    // Cart State
    const [cartOpen, setCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [products, setProducts] = useState<Product[]>(allProducts); // Start with static

    useEffect(() => {
        const saved = localStorage.getItem('cart');
        if (saved) setCartItems(JSON.parse(saved));

        // Fetch Dynamic Products
        fetch(`${API_BASE_URL}/products`)
            .then(res => res.json())
            .then(data => {
                // data.products contains the array
                if (data.products && Array.isArray(data.products)) {
                    // Normalize DB products to match frontend type
                    const dbProducts = data.products.map((p: any) => ({
                        id: p._id,
                        name: p.name,
                        price: p.price,
                        rating: p.rating || 0,
                        image: p.image,
                        tag: p.tag,
                        category: p.category,
                        description: p.description,
                        stock: p.stock,
                        specs: p.specs || [],
                        reviews: p.reviews || 0,
                        colors: p.colors || [],
                        lore: p.lore
                    }));
                    // Combine Static + Dynamic (avoid duplicates if needed, but here we just append)
                    setProducts([...allProducts, ...dbProducts]);
                }
            })
            .catch(err => console.error("Product Fetch Error", err));
    }, []);

    const showToast = (message: string, type: 'success' | 'info' = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    };

    const { user, login } = useAuthStore();

    useEffect(() => {
        if (user && user.wishlist) {
            setWishlist(user.wishlist);
        }
    }, [user]);

    const toggleWishlist = async (id: number | string) => {
        if (!user) {
            showToast("System: Login required to sync wishlist", "info");
            // Still allow local toggle for demo? No, better to force login or just update locally for now but warn.
            // Let's just update local state if not logged in, but warn.
        }

        const isAdding = !wishlist.includes(id);

        // Optimistic Update
        setWishlist(prev => isAdding ? [...prev, id] : prev.filter(item => item !== id));
        showToast(isAdding ? "System: Item added to Wishlist" : "System: Item removed from Wishlist", "info");

        if (user) {
            try {
                let res;
                if (isAdding) {
                    res = await fetch(`${API_BASE_URL}/auth/wishlist`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${user.token}`
                        },
                        body: JSON.stringify({ productId: id })
                    });
                } else {
                    res = await fetch(`${API_BASE_URL}/auth/wishlist/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${user.token}`
                        }
                    });
                }

                if (res.ok) {
                    const updatedWishlist = await res.json();
                    // Update store so other components know
                    login({ ...user, wishlist: updatedWishlist, token: user.token });
                }
            } catch (error) {
                console.error("Wishlist Sync Error", error);
            }
        }
    };

    const addToCart = (product: Product, qty: number, size: string, color: string) => {
        const newItem: CartItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: qty,
            size: size,
            color: color || (product.colors && product.colors[0]) || "#000"
        };

        setCartItems(prev => {
            const updated = [...prev, newItem];
            localStorage.setItem('cart', JSON.stringify(updated));
            return updated;
        });
        setCartOpen(true); // Open drawer
        showToast(`System: ${qty}x ${product.name} acquired`, "success");
        if (selectedProduct) setSelectedProduct(null); // Close modal if open
    };

    const removeFromCart = (index: number) => {
        setCartItems(prev => {
            const updated = prev.filter((_, i) => i !== index);
            localStorage.setItem('cart', JSON.stringify(updated));
            return updated;
        });
    };

    const filteredProducts = useMemo(() => {
        let items = activeCategory === "All"
            ? [...products]
            : products.filter(p => p.category === activeCategory);

        if (searchQuery) {
            items = items.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return items.sort((a, b) => {
            const priceA = parseInt(a.price.replace(/[^0-9]/g, ''));
            const priceB = parseInt(b.price.replace(/[^0-9]/g, ''));

            if (sortBy === 'price_asc') return priceA - priceB;
            if (sortBy === 'price_desc') return priceB - priceA;
            if (sortBy === 'rating') return b.rating - a.rating;
            return 0; // featured (id order)
        });
    }, [activeCategory, sortBy, searchQuery]);

    return (
        <main className="min-h-screen relative bg-transparent pt-48 overflow-hidden">
            {/* ThreeScene Handled Globally */}

            <FlashSaleBanner />

            <div className="container mx-auto relative z-10 mt-12 px-6 pb-20">
                {/* 3D Header Section */}
                <div className="text-center mb-16 space-y-6 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative z-10"
                    >
                        <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none relative inline-block group cursor-default">
                            <span className="absolute -inset-1 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500 blur-sm opacity-50 group-hover:opacity-100 transition-opacity duration-300 select-none">
                                NEXUS <br /> COLLECTION
                            </span>
                            <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-b from-white via-gray-200 to-gray-500">
                                NEXUS <br /> COLLECTION
                            </span>
                        </h1>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center justify-center gap-2 items-center text-sm md:text-base text-blue-400 font-mono mt-4"
                    >
                        <Zap className="w-4 h-4" />
                        <span>EQUIP YOURSELF FOR THE DIGITAL FRONTIER</span>
                        <Zap className="w-4 h-4" />
                    </motion.div>
                </div>

                <SectorSelection />

                <ElitePicks
                    products={products}
                    onProductSelect={setSelectedProduct}
                />

                {/* Filters, Search & Sort Bar */}
                <div className="flex flex-col xl:flex-row justify-between items-center gap-6 mb-12 bg-zinc-900/50 border border-white/5 p-4 rounded-2xl backdrop-blur-md shadow-2xl">
                    <div className="flex flex-wrap justify-center gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-2 rounded-full text-sm font-bold tracking-wide transition-all duration-300 border ${activeCategory === cat
                                    ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.4)] scale-105"
                                    : "bg-white/5 text-gray-400 border-transparent hover:bg-white/10 hover:text-white"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto">
                        <div className="relative flex-grow md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search inventory..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-black border border-white/20 text-white text-sm rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 transition-all placeholder:text-gray-600"
                            />
                        </div>

                        <div className="flex bg-black border border-white/20 rounded-lg p-1 gap-1">
                            <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-zinc-800 text-white' : 'text-gray-500 hover:text-white'}`}><LayoutGrid className="w-4 h-4" /></button>
                            <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-zinc-800 text-white' : 'text-gray-500 hover:text-white'}`}><ListIcon className="w-4 h-4" /></button>
                        </div>

                        <div className="relative w-full md:w-48">
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full bg-black border border-white/20 text-white text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer hover:bg-zinc-900 transition-colors pl-4 pr-10">
                                {sortOptions.map(opt => <option key={opt.value} value={opt.value} className="bg-black text-white">{opt.label}</option>)}
                            </select>
                            <ArrowUpDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>

                        <Button onClick={() => setCartOpen(true)} className="relative bg-white text-black hover:bg-blue-500 hover:text-white transition-colors">
                            <ShoppingCart className="w-5 h-5 mr-2" /> Cart
                            {cartItems.length > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">{cartItems.length}</span>}
                        </Button>
                    </div>
                </div>

                <ProductGrid
                    products={filteredProducts}
                    viewMode={viewMode}
                    onProductSelect={setSelectedProduct}
                    onToggleWishlist={toggleWishlist}
                    wishlist={wishlist}
                    onAddToCart={addToCart}
                />
            </div>

            <CyberCart
                isOpen={cartOpen}
                onClose={() => setCartOpen(false)}
                cartItems={cartItems}
                onRemoveItem={removeFromCart}
            />

            {/* Notifications */}
            <div className="fixed bottom-8 right-8 z-[200] flex flex-col gap-3 pointer-events-none">
                <AnimatePresence>
                    {toasts.map(toast => (
                        <motion.div key={toast.id} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} className="bg-zinc-900/90 border-l-4 border-blue-500 text-white px-6 py-4 rounded-lg shadow-2xl backdrop-blur-md flex items-center gap-4 min-w-[300px] border-y border-r border-white/10">
                            <div className={`p-2 rounded-full ${toast.type === 'success' ? 'bg-blue-500/20 text-blue-400' : 'bg-pink-500/20 text-pink-500'}`}>{toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <Heart className="w-5 h-5" />}</div>
                            <div><h4 className="font-bold text-sm uppercase tracking-wider text-gray-400 mb-0.5">Notification</h4><p className="font-bold text-white">{toast.message}</p></div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <ProductModal
                product={selectedProduct}
                products={products}
                onClose={() => setSelectedProduct(null)}
                onAddToCart={addToCart}
            />

            <Footer />
        </main>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading Nexus Inventory...</div>}>
            <ProductContent />
        </Suspense>
    );
}
