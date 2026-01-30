import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ShoppingCart, Star, Heart, Zap, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '../../types';
import { useCurrency } from '@/context/CurrencyContext';

interface ProductGridProps {
    products: Product[];
    viewMode: 'grid' | 'list';
    onProductSelect: (product: Product) => void;
    onToggleWishlist: (id: number | string) => void;
    wishlist: (number | string)[];
    onAddToCart: (product: Product, quantity: number, size: string, color: string) => void;
}

export default function ProductGrid({ products, viewMode, onProductSelect, onToggleWishlist, wishlist, onAddToCart }: ProductGridProps) {
    const { convertPrice } = useCurrency();
    return (
        <motion.div layout className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" : "flex flex-col gap-4"}>
            <AnimatePresence>
                {products.map((product) => (
                    <motion.div
                        layout
                        key={product.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        whileHover={viewMode === 'grid' ? { y: -10, rotateX: 5, rotateY: 5 } : { x: 5 }}
                        style={viewMode === 'grid' ? { perspective: 1000 } : {}}
                    >
                        <div onClick={() => onProductSelect(product)} className={`bg-zinc-900/40 border border-white/5 rounded-2xl p-4 backdrop-blur-md group hover:border-blue-500/30 transition-all duration-300 relative overflow-hidden h-full cursor-pointer ${viewMode === 'list' ? 'flex flex-row items-center gap-6' : 'flex flex-col hover:shadow-[0_0_40px_rgba(59,130,246,0.2)]'}`}>
                            {product.stock < 5 && <div className={`absolute z-20 flex items-center gap-1 text-red-500 text-[10px] font-bold uppercase tracking-widest bg-red-500/10 px-2 py-1 rounded border border-red-500/20 ${viewMode === 'grid' ? 'top-4 left-4' : 'bottom-4 right-4'}`}><Zap className="w-3 h-3 fill-red-500" /> Only {product.stock} Left</div>}
                            <button onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id); }} className={`absolute top-4 right-4 z-30 w-10 h-10 rounded-full flex items-center justify-center transition-all bg-black/40 backdrop-blur-md border border-white/10 hover:scale-110 ${wishlist.includes(product.id) ? 'text-pink-500 border-pink-500/50' : 'text-gray-400 hover:text-white hover:bg-black/60'}`}><Heart className={`w-5 h-5 ${wishlist.includes(product.id) ? 'fill-pink-500' : ''}`} /></button>
                            <div className={`${viewMode === 'grid' ? 'h-64 w-full mb-6' : 'h-32 w-32 shrink-0'} relative z-10 flex items-center justify-center p-4`}>
                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:scale-110 group-hover:drop-shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-all duration-500"
                                />
                            </div>
                            <div className={`relative z-10 ${viewMode === 'grid' ? 'mt-auto w-full' : 'flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center gap-4'}`}>
                                <div className={viewMode === 'list' ? 'col-span-2' : ''}>
                                    <div className="flex justify-between items-start mb-2">
                                        <div><p className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> {product.category}</p><h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">{product.name}</h3></div>
                                        {viewMode === 'grid' && <div className="flex items-center gap-1 text-yellow-500 bg-black/30 px-2 py-1 rounded-lg"><Star className="w-3 h-3 fill-yellow-500" /><span className="text-xs font-bold text-white">{product.rating}</span></div>}
                                    </div>
                                    {viewMode === 'list' && <p className="text-gray-400 text-sm line-clamp-2 mb-2">{product.description}</p>}
                                </div>
                                <div className={`flex items-center ${viewMode === 'grid' ? 'justify-between mt-4 border-t border-white/5 pt-4' : 'justify-end gap-4'}`}>
                                    <div className="flex flex-col"><span className="text-xs text-gray-500 line-through font-mono">{parseInt(product.price.replace('$', '')) * 1.2 > 1000 ? '' : convertPrice(`$${Math.floor(parseInt(product.price.replace('$', '')) * 1.2)}`)}</span><span className="text-2xl font-black text-white">{convertPrice(product.price)}</span></div>
                                    <div className="flex gap-2">
                                        <Button size="icon" className="rounded-full bg-white text-black hover:bg-blue-500 hover:text-white transition-colors shadow-lg" onClick={(e) => { e.stopPropagation(); onAddToCart(product, 1, 'M', 'Default'); }}><ShoppingCart className="w-5 h-5" /></Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </motion.div>
    );
}
