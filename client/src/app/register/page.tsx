"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import Auth3DScene from '@/components/Auth3DScene';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, Loader2, Rocket } from 'lucide-react';

export default function RegisterPage() {
    const [name, setName] = useState('');
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
            const res = await api.post('/auth/register', { name, email, password });
            login(res.data);
            router.push('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Using same logic for signup (verifyOtp handles creation)
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

            <div className="container relative z-10 grid lg:grid-cols-2 h-full min-h-[700px] w-full max-w-[1200px] px-4">
                {/* Left Side: Brand Text */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="hidden lg:flex flex-col justify-center p-12 space-y-8"
                >
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
                            <Rocket className="w-3 h-3" /> New Recruit Access
                        </div>
                        <h1 className="text-6xl font-black tracking-tighter text-white leading-tight">
                            JOIN THE <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">REVOLUTION</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-md leading-relaxed">
                            Create your identity. Customize your loadout. Rise through the ranks of the Nexus.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5">
                            <h4 className="font-bold text-white mb-1">Rank System</h4>
                            <p className="text-xs text-gray-500">Earn XP and unlock exclusive roles.</p>
                        </div>
                        <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5">
                            <h4 className="font-bold text-white mb-1">Global Access</h4>
                            <p className="text-xs text-gray-500">Multi-currency support worldwide.</p>
                        </div>
                    </div>
                </motion.div>

                {/* Right Side: Register Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex items-center justify-center p-4 lg:p-12"
                >
                    <div className="w-full max-w-md bg-zinc-950/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-[0_0_50px_rgba(236,72,153,0.15)]">
                        <div className="mb-8 text-center">
                            <h2 className="text-3xl font-bold tracking-tight mb-2">Establish Identity</h2>
                            <p className="text-sm text-gray-400">Begin your journey in the Nexus.</p>
                        </div>

                        <form onSubmit={useOtp ? handleOtpVerify : handleSubmit} className="space-y-5">
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
                                    OTP sent to your email.
                                </motion.div>
                            )}

                            {!useOtp && (
                                <div className="space-y-2">
                                    <Label htmlFor="name">Codename</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                        <Input
                                            id="name"
                                            type="text"
                                            placeholder="NeonRider"
                                            className="pl-10 bg-white/5 border-white/10 focus:border-pink-500/50 focus:ring-pink-500/20 text-white placeholder:text-gray-600 transition-all h-10"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email">Comms Link</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="agent@nexus.com"
                                        className="pl-10 bg-white/5 border-white/10 focus:border-pink-500/50 focus:ring-pink-500/20 text-white placeholder:text-gray-600 transition-all h-10"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={otpSent}
                                    />
                                </div>
                            </div>

                            {!useOtp && (
                                <div className="space-y-2">
                                    <Label htmlFor="password">Secure Key</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                        <Input
                                            id="password"
                                            type="password"
                                            className="pl-10 bg-white/5 border-white/10 focus:border-pink-500/50 focus:ring-pink-500/20 text-white transition-all h-10"
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
                                            className="pl-10 bg-white/5 border-white/10 focus:border-pink-500/50 focus:ring-pink-500/20 text-white transition-all h-10 tracking-widest"
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
                                    className="w-full h-12 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl shadow-lg shadow-pink-600/20 transition-all"
                                >
                                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Request Verification Code'}
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-12 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-pink-600/20 transition-all"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {useOtp ? 'Verify Identity' : 'Initialize Account'} <ArrowRight className="ml-2 h-4 w-4" />
                                        </>
                                    ) : (
                                        <>
                                            {useOtp ? 'Verify Identity' : 'Initialize Account'} <ArrowRight className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            )}
                            <div className="text-center">
                                <button type="button" onClick={() => { setUseOtp(!useOtp); setOtpSent(false); setError(''); }} className="text-xs text-pink-400 hover:text-white transition-colors uppercase tracking-widest font-bold">
                                    {useOtp ? "Signup with Password" : "Signup with OTP"}
                                </button>
                            </div>

                        </form>

                        <div className="mt-8 text-center text-sm">
                            <span className="text-gray-500">Already operational? </span>
                            <Link href="/login" className="font-bold text-white hover:text-pink-400 transition-colors">
                                Access Terminal
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
