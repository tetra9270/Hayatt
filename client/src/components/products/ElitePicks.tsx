import { motion } from 'framer-motion';
import { Flame, ArrowRight, Star } from 'lucide-react';
import { Product } from '../../types';
import { useCurrency } from '@/context/CurrencyContext';

interface ElitePicksProps {
    products: Product[];
    onProductSelect: (product: Product) => void;
}

export default function ElitePicks({ products, onProductSelect }: ElitePicksProps) {
    const { convertPrice } = useCurrency();
    const eliteProducts = products.filter(p => p.rating >= 4.9).slice(0, 4);

    return (
        <div className="mb-24 relative z-10">
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-500/10 rounded-xl border border-orange-500/20">
                        <Flame className="text-orange-500 fill-orange-500 w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">ELITE PICKS</h2>
                        <p className="text-gray-500 text-sm font-mono mt-1">TOP RATED GEAR OF THE CYCLE</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button className="w-10 h-10 border border-white/10 rounded-full hover:bg-white/10 text-white flex items-center justify-center transition-all hover:scale-110 hover:border-white/30"><ArrowRight className="w-4 h-4 rotate-180" /></button>
                    <button className="w-10 h-10 border border-white/10 rounded-full hover:bg-white/10 text-white flex items-center justify-center transition-all hover:scale-110 hover:border-white/30"><ArrowRight className="w-4 h-4" /></button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {eliteProducts.map((product, i) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * i }}
                        whileHover={{ y: -15, scale: 1.02 }}
                        onClick={() => onProductSelect(product)}
                        className="relative bg-zinc-900/40 border border-white/5 p-4 rounded-3xl cursor-pointer group hover:border-orange-500/50 transition-all duration-300 hover:shadow-[0_10px_40px_rgba(249,115,22,0.15)]"
                    >
                        {/* Glowing Backdrop on Hover */}
                        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="relative h-48 flex items-center justify-center mb-6 bg-black/40 rounded-2xl overflow-hidden border border-white/5 group-hover:border-orange-500/20 transition-colors">
                            <motion.img
                                src={product.image}
                                className="h-32 object-contain filter drop-shadow-[0_0_10px_rgba(255,255,255,0.1)] group-hover:drop-shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all duration-300"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                            />
                            <div className="absolute top-3 right-3 bg-orange-500 text-white text-[10px] font-black uppercase px-2 py-1 rounded shadow-lg shadow-orange-500/20">HOT</div>
                        </div>

                        <div className="px-2 pb-2">
                            <h3 className="text-white font-bold text-lg truncate mb-1 group-hover:text-orange-400 transition-colors">{product.name}</h3>
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-xs text-gray-500 font-mono mb-1">{product.category}</p>
                                    <span className="text-gray-300 text-sm font-bold bg-white/5 px-2 py-1 rounded-md border border-white/5 group-hover:border-orange-500/30 transition-colors">{convertPrice(product.price)}</span>
                                </div>
                                <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold bg-yellow-500/10 px-2 py-1 rounded-full border border-yellow-500/20">
                                    <Star className="w-3 h-3 fill-yellow-500" /> {product.rating}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
