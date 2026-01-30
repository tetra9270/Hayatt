import { Timer } from "lucide-react";

export default function FlashSaleBanner() {
    return (
        <div className="absolute top-24 left-0 right-0 z-40 bg-gradient-to-r from-red-600 to-pink-600 text-white text-center py-3 font-black text-xl uppercase tracking-widest flex items-center justify-center gap-4 shadow-[0_10px_40px_rgba(220,38,38,0.5)] animate-pulse border-y border-white/20">
            <Timer className="w-6 h-6 animate-spin-slow" />
            <span>FLASH SALE ENDS IN: 04:23:12</span>
            <Timer className="w-6 h-6 animate-spin-slow" />
        </div>
    );
}
