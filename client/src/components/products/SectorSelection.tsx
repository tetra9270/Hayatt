import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const categories = ['CYBERNETICS', 'STREETWEAR', 'ARMORY'];

export default function SectorSelection() {
    return (
        <div className="mb-32 relative z-10">
            <div className="flex items-center gap-4 mb-8">
                <div className="h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent flex-grow opacity-50" />
                <h2 className="text-sm font-black text-blue-500 uppercase tracking-[0.2em]">SECTOR SELECTION</h2>
                <div className="h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent flex-grow opacity-50" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {categories.map((cat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * i }}
                        whileHover={{ scale: 1.05, rotateX: 5, rotateY: 5 }}
                        style={{ perspective: 1000 }}
                        className="group relative h-80 rounded-[2rem] overflow-hidden cursor-pointer border border-white/10 hover:border-blue-500 transition-all duration-500 shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_50px_rgba(59,130,246,0.3)]"
                    >
                        {/* Background Image with Parallax Effect */}
                        <div className="absolute inset-0 bg-black">
                            <motion.img
                                src={`/images/${i === 0 ? 'hero-headphone.png' : i === 1 ? 'cat-fashion.png' : 'feature-rocket.png'}`}
                                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 group-hover:opacity-40 transition-all duration-700"
                            />
                        </div>

                        {/* Gradient Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

                        {/* Content */}
                        <div className="absolute inset-0 flex flex-col justify-end p-8 z-20">
                            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2 drop-shadow-lg glitch-text">{cat}</h3>
                                <p className="text-gray-400 text-xs font-mono mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 max-w-[80%]">
                                    {i === 0 ? "Upgrade your biology." : i === 1 ? "Dress to kill." : "Defend your territory."}
                                </p>
                                <div className="flex items-center gap-3 text-blue-400 text-sm font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                                    <span>INITIALIZE</span>
                                    <div className="w-8 h-[2px] bg-blue-500" />
                                    <ChevronRight className="w-4 h-4" />
                                </div>
                            </div>
                        </div>

                        {/* Decorative Tech Elements */}
                        <div className="absolute top-4 right-4 z-20 flex gap-1 opacity-50">
                            <div className="w-1 h-1 bg-white rounded-full" />
                            <div className="w-1 h-1 bg-white rounded-full" />
                            <div className="w-1 h-1 bg-white rounded-full" />
                        </div>
                        <div className="absolute bottom-4 right-4 z-20 font-mono text-[10px] text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            SEC_0{i + 1} // {cat.substring(0, 3)}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
