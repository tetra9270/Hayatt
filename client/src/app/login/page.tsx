"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import Auth3DScene from '@/components/Auth3DScene';
import { motion } from 'framer-motion';
import { User, Lock, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // OTP State
    const [useOtp, setUseOtp] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otpCode, setOtpCode] = useState('');

    const router = useRouter();
    const login = useAuthStore((state) => state.login);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await api.post('/auth/login', { email, password });
            login(res.data);
            router.push('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSendOtp = async () => {
        if (!email) { setError("Please enter your email first."); return; }
        setLoading(true);
        setError('');
        try {
            await api.post('/auth/send-otp', { email });
            setOtpSent(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send OTP.');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/auth/verify-otp', { email, otp: otpCode });
            login(res.data);
            router.push('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid OTP.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden text-white">
            {/* Background 3D Scene - Handled Globally by Layout */}

            <div className="container relative z-10 grid lg:grid-cols-2 h-full min-h-[600px] w-full max-w-[1200px] px-4">
                {/* Left Side: Brand Text */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="hidden lg:flex flex-col justify-center p-12 space-y-8"
                >
                    <div className="space-y-4">
                        <h1 className="text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                            NEXUS
                            <span className="block text-white text-4xl mt-2 tracking-widest font-light">STORE</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-md leading-relaxed">
                            Access the neural marketplace. Experience the future of commerce in immersive 3D.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                            <h3 className="font-bold text-blue-400 text-2xl">4.9/5</h3>
                            <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Trust Score</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                            <h3 className="font-bold text-purple-400 text-2xl">1M+</h3>
                            <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Active Nodes</p>
                        </div>
                    </div>
                </motion.div>

                {/* Right Side: Login Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex items-center justify-center p-4 lg:p-12"
                >
                    <div className="w-full max-w-md bg-zinc-950/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-[0_0_50px_rgba(79,70,229,0.2)]">
                        <div className="mb-8 text-center">
                            <h2 className="text-3xl font-bold tracking-tight mb-2">Welcome Back</h2>
                            <p className="text-sm text-gray-400">Initialize your session to proceed.</p>
                        </div>

                        <form onSubmit={useOtp ? handleOtpVerify : handleSubmit} className="space-y-6">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
                                >
                                    {error}
                                </motion.div>
                            )}

                            {otpSent && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center"
                                >
                                    OTP dispatched to secure comms channel.
                                </motion.div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email">Email Access</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="agent@nexus.com"
                                        className="pl-10 bg-white/5 border-white/10 focus:border-blue-500/50 focus:ring-blue-500/20 text-white placeholder:text-gray-600 transition-all h-10"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={otpSent}
                                    />
                                </div>
                            </div>

                            {!useOtp && (
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label htmlFor="password">Security Protocol</Label>
                                        <Link href="#" className="text-xs text-blue-400 hover:text-blue-300">
                                            Forgot key?
                                        </Link>
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                        <Input
                                            id="password"
                                            type="password"
                                            className="pl-10 bg-white/5 border-white/10 focus:border-purple-500/50 focus:ring-purple-500/20 text-white transition-all h-10"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            {useOtp && otpSent && (
                                <div className="space-y-2">
                                    <Label htmlFor="otp">One-Time Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                        <Input
                                            id="otp"
                                            type="text"
                                            placeholder="XXXXXX"
                                            className="pl-10 bg-white/5 border-white/10 focus:border-purple-500/50 focus:ring-purple-500/20 text-white transition-all h-10 tracking-widest"
                                            value={otpCode}
                                            onChange={(e) => setOtpCode(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            {useOtp && !otpSent ? (
                                <Button
                                    type="button"
                                    onClick={handleSendOtp}
                                    disabled={loading}
                                    className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all"
                                >
                                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Request OTP Code'}
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Authenticating...
                                        </>
                                    ) : (
                                        <>
                                            Initialize Session <ArrowRight className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            )}

                            <div className="text-center">
                                <button type="button" onClick={() => { setUseOtp(!useOtp); setOtpSent(false); setError(''); }} className="text-xs text-blue-400 hover:text-white transition-colors uppercase tracking-widest font-bold">
                                    {useOtp ? "Switch to Password Auth" : "Switch to OTP Authentication"}
                                </button>
                            </div>
                        </form>

                        <div className="mt-8 text-center text-sm">
                            <span className="text-gray-500">New to Nexus? </span>
                            <Link href="/register" className="font-bold text-white hover:text-blue-400 transition-colors">
                                Create Identity
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
