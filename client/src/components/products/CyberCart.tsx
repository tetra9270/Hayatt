import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CartItem } from '../../types';

interface CyberCartProps {
    isOpen: boolean;
    onClose: () => void;
    cartItems: CartItem[];
    onRemoveItem: (index: number) => void;
}

export default function CyberCart({ isOpen, onClose, cartItems, onRemoveItem }: CyberCartProps) {
    const cartTotal = cartItems.reduce((acc, item) => {
        const price = parseInt(item.price.replace(/[^0-9]/g, ''));
        return acc + (price * item.quantity);
    }, 0);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex justify-end">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        className="relative z-10 w-full max-w-md bg-zinc-950 border-l border-white/10 h-full shadow-2xl flex flex-col"
                    >
                        <div className="p-6 border-b border-white/10 flex items-center justify-between">
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Cyber Cart ({cartItems.length})</h2>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white"><X /></button>
                        </div>
                        <div className="flex-grow overflow-y-auto p-6 space-y-4">
                            {cartItems.length === 0 ? (
                                <div className="text-center text-gray-500 mt-20">Your inventory is empty.</div>
                            ) : (
                                cartItems.map((item, i) => (
                                    <div key={i} className="flex gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                                        <img src={item.image} className="w-20 h-20 object-contain bg-black/50 rounded-lg" />
                                        <div className="flex-grow">
                                            <h3 className="text-white font-bold">{item.name}</h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <span>{item.size}</span>
                                                <div className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: item.color }} />
                                                <span>x {item.quantity}</span>
                                            </div>
                                            <div className="flex justify-between items-center mt-2">
                                                <span className="text-blue-400 font-mono">{item.price}</span>
                                                <button onClick={() => onRemoveItem(i)} className="text-red-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="p-6 border-t border-white/10 bg-zinc-900">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-gray-400 uppercase tracking-widest text-xs">Total Credits</span>
                                <span className="text-3xl font-black text-white">${cartTotal}</span>
                            </div>
                            <Link href="/checkout" className="block w-full">
                                <Button className="w-full py-6 text-lg font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl">CHECKOUT NOW</Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
