import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, Zap, Cpu, Battery, Globe, Star, User, Truck, Lock, RefreshCw, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '../../types';
import { allProducts } from '../../data/products';
import { useCurrency } from '@/context/CurrencyContext';

interface ProductModalProps {
    product: Product | null;
    products: Product[];
    onClose: () => void;
    onAddToCart: (product: Product, quantity: number, size: string, color: string) => void;
}

export default function ProductModal({ product, products, onClose, onAddToCart }: ProductModalProps) {
    const { convertPrice } = useCurrency();
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState("M");
    const [selectedColor, setSelectedColor] = useState("");
    const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'reviews'>('details');
    // Internal state to switch product if related item clicked
    const [currentProduct, setCurrentProduct] = useState<Product | null>(product);

    useEffect(() => {
        setCurrentProduct(product);
    }, [product]);

    useEffect(() => {
        if (currentProduct) {
            setQuantity(1);
            setSelectedSize("M");
            setSelectedColor(currentProduct.colors && currentProduct.colors.length > 0 ? currentProduct.colors[0] : "");
            setActiveTab('details');
        }
    }, [currentProduct]);

    if (!product || !currentProduct) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center navigation-wrapper p-4 overflow-y-auto">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer" />
                <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-6xl bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(59,130,246,0.2)] my-auto flex flex-col max-h-[90vh]">
                    <div className="flex-grow overflow-y-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-full">
                            <div className="bg-gradient-to-b from-zinc-900 to-black p-6 md:p-10 flex items-center justify-center relative overflow-hidden min-h-[300px] md:min-h-[400px]">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-50" />
                                <motion.div key={currentProduct.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full h-full z-10">
                                    <img src={currentProduct.image} alt={currentProduct.name} className="absolute inset-0 w-full h-full object-contain drop-shadow-[0_0_50px_rgba(255,255,255,0.15)]" />
                                </motion.div>
                            </div>
                            <div className="p-6 md:p-12 flex flex-col bg-zinc-950 border-l border-white/5">
                                <button onClick={onClose} className="absolute top-4 right-4 md:top-6 md:right-6 z-50 p-2 bg-white/5 rounded-full text-white hover:bg-red-500 transition-colors"><X className="w-5 h-5 md:w-6 md:h-6" /></button>
                                <div className="mb-4 flex items-center gap-3 flex-wrap">
                                    <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-500/20">{currentProduct.category}</span>
                                    {currentProduct.stock < 5 && <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-bold uppercase tracking-wider border border-red-500/20 animate-pulse flex items-center gap-1"><Zap className="w-3 h-3" /> Low Stock</span>}
                                </div>
                                <h2 className="text-3xl md:text-5xl font-black text-white mb-4 md:mb-6 leading-tight tracking-tight">{currentProduct.name}</h2>
                                <div className="flex items-center gap-6 mb-6 md:mb-8 pb-6 md:pb-8 border-b border-white/5">
                                    <span className="text-3xl md:text-4xl font-light text-white">{convertPrice(currentProduct.price)}</span>
                                    <div className="flex flex-col text-xs text-gray-500"><span>Includes VAT</span><span className="text-green-500 flex items-center gap-1"><Truck className="w-3 h-3" /> Free Delivery</span></div>
                                </div>
                                <div className="flex gap-6 mb-6 border-b border-white/5 pb-1">
                                    {['details', 'specs', 'reviews'].map((tab) => (
                                        <button key={tab} onClick={() => setActiveTab(tab as any)} className={`pb-3 text-sm font-bold uppercase tracking-wider transition-colors relative ${activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}>{tab}{activeTab === tab && <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}</button>
                                    ))}
                                </div>
                                <div className="mb-8 min-h-[100px]">
                                    {activeTab === 'details' && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                            <p className="text-gray-400 leading-relaxed text-lg mb-6">{currentProduct.description}</p>
                                            {/* FEATURE GRID */}
                                            <div className="grid grid-cols-2 gap-4 mb-6">
                                                <div className="bg-white/5 p-4 rounded-lg border border-white/5 flex items-center gap-3"><Zap className="w-8 h-8 text-blue-500" /> <div><h4 className="text-white font-bold text-sm">EMP Proof</h4><p className="text-gray-500 text-xs">Shock Resistant</p></div></div>
                                                <div className="bg-white/5 p-4 rounded-lg border border-white/5 flex items-center gap-3"><Cpu className="w-8 h-8 text-purple-500" /> <div><h4 className="text-white font-bold text-sm">Smart Core</h4><p className="text-gray-500 text-xs">AI Integrated</p></div></div>
                                                <div className="bg-white/5 p-4 rounded-lg border border-white/5 flex items-center gap-3"><Battery className="w-8 h-8 text-green-500" /> <div><h4 className="text-white font-bold text-sm">Auto-Charge</h4><p className="text-gray-500 text-xs">Kinetic Power</p></div></div>
                                                <div className="bg-white/5 p-4 rounded-lg border border-white/5 flex items-center gap-3"><Globe className="w-8 h-8 text-pink-500" /> <div><h4 className="text-white font-bold text-sm">Global Link</h4><p className="text-gray-500 text-xs">Sat-Connect</p></div></div>
                                            </div>
                                            {/* ORIGIN STORY */}
                                            <div className="bg-zinc-900 border-l-2 border-blue-500 p-4 rounded-r-lg">
                                                <h4 className="text-blue-400 font-bold uppercase tracking-wider text-xs mb-2">ORIGIN STORY // {currentProduct.category}</h4>
                                                <p className="text-gray-400 text-sm italic">"{currentProduct.lore || 'Forged in the underground labs of Sector 7, this item represents the pinnacle of guerrilla engineering.'}"</p>
                                            </div>
                                        </motion.div>
                                    )}
                                    {activeTab === 'specs' && <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">{currentProduct.specs?.map((spec, i) => <li key={i} className="flex items-center gap-2 text-gray-300"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" />{spec}</li>)}</motion.ul>}
                                    {activeTab === 'reviews' && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                            <div className="flex items-center gap-4 bg-white/5 p-6 rounded-2xl">
                                                <div className="text-center">
                                                    <div className="text-4xl font-black text-white">{currentProduct.rating}</div>
                                                    <div className="flex text-yellow-500 text-xs"><Star className="fill-yellow-500 w-3 h-3" /><Star className="fill-yellow-500 w-3 h-3" /><Star className="fill-yellow-500 w-3 h-3" /><Star className="fill-yellow-500 w-3 h-3" /><Star className="fill-yellow-500 w-3 h-3" /></div>
                                                    <div className="text-gray-500 text-xs mt-1">{currentProduct.reviews} Verified</div>
                                                </div>
                                                <div className="flex-grow space-y-1">
                                                    {[80, 15, 3, 1, 1].map((n, i) => (
                                                        <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                                                            <span>{5 - i}★</span>
                                                            <div className="flex-grow h-1.5 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-yellow-500" style={{ width: `${n}%` }} /></div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="border-b border-white/5 pb-4">
                                                    <div className="flex justify-between mb-2">
                                                        <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs"><User className="w-4 h-4" /></div><span className="text-white font-bold text-sm">NeonRider_99</span></div>
                                                        <span className="text-gray-500 text-xs">2 days ago</span>
                                                    </div>
                                                    <p className="text-gray-400 text-sm">Absolutely incredible quality. The interface is intuitive and the build is solid. Worth every credit.</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Color & Size Selection */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between"><span className="text-gray-400 font-bold text-sm">SELECT COLOR</span></div>
                                        <div className="flex gap-3">
                                            {currentProduct.colors?.map((color, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setSelectedColor(color)}
                                                    className={`w-10 h-10 rounded-full border-2 transition-all p-1 ${selectedColor === color ? 'border-white scale-110' : 'border-transparent hover:scale-110'}`}
                                                >
                                                    <div className="w-full h-full rounded-full shadow-lg" style={{ backgroundColor: color }} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between"><span className="text-gray-400 font-bold text-sm">SELECT SIZE</span><span className="text-blue-400 text-xs font-mono cursor-pointer hover:underline">SIZE GUIDE</span></div>
                                        <div className="flex gap-2">
                                            {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                                                <button key={size} onClick={() => setSelectedSize(size)} className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm transition-all border ${selectedSize === size ? 'bg-white text-black border-white shadow-lg' : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30 hover:text-white'}`}>{size}</button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6 mt-auto">
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center bg-zinc-900 border border-white/10 rounded-xl px-2">
                                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">-</button>
                                            <span className="w-12 text-center font-bold text-white">{quantity}</span>
                                            <button onClick={() => setQuantity(quantity + 1)} className="p-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">+</button>
                                        </div>
                                        <Button onClick={() => onAddToCart(currentProduct, quantity, selectedSize, selectedColor)} className="flex-grow py-8 text-lg rounded-xl bg-white text-black hover:bg-blue-600 hover:text-white font-bold transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-blue-600/50">ADD TO CART - {convertPrice(currentProduct.price)}</Button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-[10px] text-gray-500 font-mono uppercase tracking-widest pt-6 border-t border-white/5"><div className="flex items-center gap-2"><Lock className="w-3 h-3" /> Secure Transaction</div><div className="flex items-center gap-2"><RefreshCw className="w-3 h-3" /> 30-Day Returns</div></div>
                                </div>
                            </div>
                        </div>
                        {/* RELATED PRODUCTS */}
                        <div className="p-8 border-t border-white/10 bg-zinc-900/50">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><ArrowRight className="text-blue-500" /> RELATED GEAR</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {products.filter(p => p.category === currentProduct.category && p.id !== currentProduct.id).slice(0, 3).map(related => (
                                    <div key={related.id} onClick={() => setCurrentProduct(related)} className="bg-black border border-white/5 p-4 rounded-xl flex items-center gap-4 cursor-pointer hover:border-blue-500/50 transition-colors">
                                        <div className="w-16 h-16 relative shrink-0">
                                            <img src={related.image} alt={related.name} className="absolute inset-0 w-full h-full object-contain" />
                                        </div>
                                        <div><h4 className="text-white font-bold text-sm line-clamp-1">{related.name}</h4><span className="text-blue-400 text-xs">{convertPrice(related.price)}</span></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
