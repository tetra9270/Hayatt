"use client";

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';

const ThreeScene = dynamic(() => import('@/components/ThreeScene'), { ssr: false });

export default function AboutPage() {
    return (
        <main className="min-h-screen relative bg-transparent pt-32 pb-20 px-6 overflow-hidden">
            {/* ThreeScene Handled Globally */}

            <div className="container mx-auto relative z-10">
                {/* Hero Text */}
                <div className="max-w-4xl mx-auto text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-8 uppercase leading-none">
                            We Are <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient">The Future</span>
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-xl md:text-2xl text-gray-400 font-light leading-relaxed"
                    >
                        Hayatt Store was born from a singular vision: to bridge the gap between physical reality and the digital metaverse. We curate the highest quality cyber-wear and tech enhancements for the next generation of humanity.
                    </motion.p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                    {[
                        { label: "Active Users", value: "2M+", color: "text-blue-500" },
                        { label: "Digital Assets", value: "50k+", color: "text-purple-500" },
                        { label: "Global Hubs", value: "14", color: "text-pink-500" }
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 }}
                            className="bg-zinc-900/40 border border-white/5 rounded-2xl p-10 text-center backdrop-blur-md hover:border-white/20 transition-colors"
                        >
                            <h3 className={`text-6xl font-black mb-2 ${stat.color}`}>{stat.value}</h3>
                            <p className="text-gray-400 uppercase tracking-widest font-bold text-sm">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Team / Story Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-6">
                        <h2 className="text-4xl font-bold text-white uppercase tracking-tight">Built by Visionaries</h2>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            Our team consists of former aerospace engineers, AAA game developers, and high-fashion designers. We don't just sell products; we engineer experiences that upgrade your lifestyle conform to the standards of 2077.
                        </p>
                        <ul className="space-y-4 text-gray-300">
                            {[
                                "Zero-Latency Neural Interfaces",
                                "Sustainable Synthetic Materials",
                                "Cross-Platform Metaverse Compatibility"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <Button className="mt-6 rounded-full px-8 py-6 text-lg bg-white text-black hover:bg-gray-200">
                            Join Our Team
                        </Button>
                    </div>

                </div>


                {/* New Section: The Code (Core Values) */}
                <div className="mt-32 mb-32">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-white uppercase tracking-tight mb-4">The Hayatt Code</h2>
                        <div className="h-1 w-24 bg-blue-500 mx-auto rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: "Radical Transparency", desc: "No hidden algorithms. Every transaction is verified on the public ledger.", icon: "💎" },
                            { title: "Velocity First", desc: "We anticipate trends before they manifest in the mainstream reality.", icon: "⚡" },
                            { title: "User Sovereignty", desc: "You own your data. You own your identity. We just provide the tools.", icon: "🛡️" }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className="group relative p-8 rounded-3xl bg-zinc-900/40 border border-white/5 overflow-hidden hover:bg-white/5 transition-all duration-500"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative z-10">
                                    <div className="text-5xl mb-6">{item.icon}</div>
                                    <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                                    <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* New Section: Global Operations (Network Status) */}
                <div className="mb-32 p-8 md:p-12 rounded-[2rem] bg-black/40 border border-white/10 backdrop-blur-xl">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                        <div>
                            <h2 className="text-3xl font-bold text-white uppercase tracking-wide">Network Status</h2>
                            <p className="text-gray-400">Live operational hubs across the globe.</p>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-green-500 text-xs font-bold uppercase tracking-wider">All Systems Nominal</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { city: "Neo-Tokyo", status: "Online", latency: "12ms", load: 65 },
                            { city: "New York Prime", status: "Online", latency: "8ms", load: 82 },
                            { city: "Berlin Node", status: "Optimizing", latency: "24ms", load: 45 },
                            { city: "Singapore Hub", status: "Online", latency: "18ms", load: 78 }
                        ].map((hub, i) => (
                            <div key={i} className="flex flex-col p-4 rounded-xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition-colors">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-white">{hub.city}</span>
                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${hub.status === 'Online' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                        {hub.status}
                                    </span>
                                </div>
                                <div className="text-xs text-gray-500 font-mono">Lat: {hub.latency} // Load: {hub.load}%</div>
                            </div>
                        ))}
                    </div>
                </div>


                {/* New Section: Lead Developers */}
                <div className="mb-32">
                    <h2 className="text-4xl font-bold text-white uppercase tracking-tight mb-12 text-center">Lead Developers</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                        {[
                            {
                                name: "Asif Hussain",
                                role: "Lead Architect & AI Specialist",
                                img: "/team/asif.png",
                                bio: "The mastermind behind the Hayatt architecture. Asif specializes in building scalable, AI-driven backend systems that power the metaverse. His vision drives the intelligent core of our platform.",
                                socials: { github: "#", linkedin: "#", twitter: "#" }
                            },
                            {
                                name: "Mohd Musab",
                                role: "Core Engineer & 3D Visualizer",
                                img: "/team/musab.png",
                                bio: "The artist of code. Musab brings the digital world to life with immersive 3D interfaces and fluid user experiences. He bridges the gap between complex logic and stunning visual prowess.",
                                socials: { github: "#", linkedin: "#", twitter: "#" }
                            }
                        ].map((member, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                whileHover={{ y: -10, rotateX: 5, rotateY: 5 }}
                                className="group relative rounded-3xl overflow-hidden bg-zinc-900 border border-white/5 shadow-2xl [perspective:1000px]"
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
                                <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-20 transition-opacity duration-500 mix-blend-overlay" />

                                <img src={member.img} alt={member.name} className="w-full h-[500px] object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />

                                <div className="absolute bottom-0 left-0 right-0 p-8 z-20 bg-gradient-to-t from-black to-transparent">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="h-0.5 w-8 bg-blue-500" />
                                        <div className="text-blue-400 text-xs font-bold uppercase tracking-widest">{member.role}</div>
                                    </div>
                                    <h3 className="text-4xl font-black text-white mb-4">{member.name}</h3>
                                    <p className="text-gray-300 mb-6 leading-relaxed max-w-sm">{member.bio}</p>

                                    <div className="flex gap-4">
                                        {Object.entries(member.socials).map(([platform, link]) => (
                                            <a key={platform} href={link} className="text-gray-400 hover:text-white transition-colors uppercase text-xs font-bold tracking-wider border-b border-white/20 hover:border-white pb-1">
                                                {platform}
                                            </a>
                                        ))}
                                    </div>
                                </div>

                                {/* Tech overlay decorative lines */}
                                <div className="absolute top-6 right-6 w-16 h-16 border-t-2 border-r-2 border-white/20 rounded-tr-2xl z-20 opacity-50 group-hover:opacity-100 group-hover:border-blue-500 transition-all" />
                                <div className="absolute bottom-6 left-6 w-16 h-16 border-b-2 border-l-2 border-white/20 rounded-bl-2xl z-20 opacity-50 group-hover:opacity-100 group-hover:border-purple-500 transition-all" />
                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>
            <Footer />
        </main >
    );
}

