"use client";
import { API_BASE_URL } from '@/lib/utils';

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CartItem } from "@/types";
import Footer from "@/components/Footer";
import { CheckCircle, ShieldCheck, CreditCard, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function CheckoutPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'RAZORPAY' | 'COD'>('RAZORPAY');

    const [couponCode, setCouponCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [couponApplied, setCouponApplied] = useState(false);

    const router = useRouter();

    // Calculate dynamic total
    const cartTotal = cartItems.reduce((acc, item) => {
        const price = parseInt(item.price.replace(/[^0-9]/g, ''));
        return acc + (price * item.quantity);
    }, 0);

    const finalTotal = couponApplied ? cartTotal - (cartTotal * (discount / 100)) : cartTotal;

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        try {
            const res = await fetch(`${API_BASE_URL}/coupons/validate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ code: couponCode })
            });
            const data = await res.json();
            if (res.ok && data.valid) {
                setDiscount(data.discountPercentage);
                setCouponApplied(true);
                alert(data.message);
            } else {
                alert(data.message || "Invalid Coupon");
                setCouponApplied(false);
                setDiscount(0);
            }
        } catch (error) {
            console.error("Coupon Error", error);
            alert("Failed to apply coupon");
        }
    };
    const token = useAuthStore((state) => state.user?.token);

    const [shippingAddress, setShippingAddress] = useState({
        address: '',
        city: '',
        postalCode: '',
        country: ''
    });

    const [addresses, setAddresses] = useState<any[]>([]);

    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        const items = savedCart ? JSON.parse(savedCart) : [];
        setCartItems(items);

        // Fetch user addresses
        if (token) {
            fetch(`${API_BASE_URL}/auth/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.addresses) setAddresses(data.addresses);
                })
                .catch(err => console.error(err));
        }
    }, [token]);

    const handleFillAddress = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const addrId = e.target.value;
        if (!addrId) {
            setShippingAddress({ address: '', city: '', postalCode: '', country: '' });
            return;
        }
        const selected = addresses.find(a => a._id === addrId);
        if (selected) {
            setShippingAddress({
                address: selected.address,
                city: selected.city,
                postalCode: selected.postalCode,
                country: selected.country
            });
        }
    };



    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
    };

    const handleCodPayment = async () => {
        if (!token) {
            alert("Please login to complete your purchase!");
            router.push('/login');
            return;
        }

        // Validate Address
        if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
            alert("Please fill in all shipping address fields.");
            return;
        }

        setLoading(true);

        try {
            const saveOrderRes = await fetch(`${API_BASE_URL}/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    items: cartItems.map(item => ({
                        ...item,
                        price: parseInt(item.price.replace(/[^0-9]/g, ''))
                    })),
                    shippingAddress,
                    paymentId: 'COD',
                    couponCode: couponApplied ? couponCode : null
                }),
            });

            if (saveOrderRes.ok) {
                setPaymentSuccess(true);
                localStorage.removeItem('cart');
            } else {
                const errorData = await saveOrderRes.json();
                console.error("Server Order Save Error:", errorData);
                alert(`Order Failed: ${errorData.error || errorData.message || "Unknown Error"}`);
            }
        } catch (err: any) {
            console.error("Order Save Error", err);
            alert(`Order Failed: ${err.message || JSON.stringify(err)}`);
        } finally {
            setLoading(false);
        }
    };

    const handleRazorpayPayment = async () => {
        if (!token) {
            alert("Please login to complete your purchase!");
            router.push('/login');
            return;
        }

        // Validate Address
        if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
            alert("Please fill in all shipping address fields.");
            return;
        }

        setLoading(true);

        try {
            // 1. Create Order on Server (Payment Intent)
            const res = await fetch(`${API_BASE_URL}/payment/create-razorpay-order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ items: cartItems }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Order creation failed");
            }

            const order = await res.json();

            // 2. Open Razorpay Modal
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "NEXUS E-COMMERCE",
                description: "Secure Payment for Digital Goods",
                order_id: order.id,
                handler: async function (response: any) {
                    console.log("Payment ID: ", response.razorpay_payment_id);

                    // 3. Save Order to Database after success
                    try {
                        const saveOrderRes = await fetch(`${API_BASE_URL}/orders`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                items: cartItems.map(item => ({
                                    ...item,
                                    price: parseInt(item.price.replace(/[^0-9]/g, '')) // Ensure number for DB
                                })),
                                shippingAddress,
                                paymentId: response.razorpay_payment_id,
                                couponCode: couponApplied ? couponCode : null
                            }),
                        });

                        if (saveOrderRes.ok) {
                            setPaymentSuccess(true);
                            // Clear cart
                            localStorage.removeItem('cart');
                        } else {
                            const errorData = await saveOrderRes.json();
                            console.error("Server Order Save Error:", errorData);
                            alert(`Order Saving Failed (Server): ${errorData.error || errorData.message || "Unknown Error"}`);
                        }
                    } catch (err: any) {
                        console.error("Order Save Error", err);
                        alert(`Order Saving Failed: ${err.message || JSON.stringify(err)}`);
                    }
                },
                prefill: {
                    name: "Neon Runner",
                    email: "user@nexus.com",
                    contact: "9999999999"
                },
                theme: {
                    color: "#3b82f6"
                }
            };

            if (!(window as any).Razorpay) {
                alert("Razorpay SDK failed to load. Please check your internet connection.");
                setLoading(false);
                return;
            }

            const rzp1 = new (window as any).Razorpay(options);
            rzp1.open();
            rzp1.on('payment.failed', function (response: any) {
                alert(response.error.description);
                setLoading(false);
            });

        } catch (error: any) {
            console.error("Payment Error:", error);
            alert(`Payment Initialization Failed: ${error.message}`);
            setLoading(false);
        }
    };

    if (paymentSuccess) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-md w-full bg-zinc-900 border border-green-500/30 p-10 rounded-3xl shadow-[0_0_50px_rgba(34,197,94,0.2)]"
                >
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Payment Successful</h1>
                    <p className="text-gray-400 mb-8">Your gear has been initialized and mission permissions granted. Track your order in the dashboard.</p>
                    <Button onClick={() => router.push('/dashboard')} className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl">GO TO DASHBOARD</Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent pt-20 md:pt-32 pb-20">
            <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                {/* Left Column: Order Summary & Address */}
                <div className="space-y-8">
                    {/* Order Summary */}
                    <div className="bg-zinc-900/50 p-8 rounded-3xl border border-white/10">
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-6">Order Summary</h2>
                        <div className="space-y-4 mb-8">
                            {cartItems.map((item, i) => (
                                <div key={i} className="flex gap-4 items-center">
                                    <div className="w-16 h-16 bg-zinc-800 rounded-lg overflow-hidden flex items-center justify-center border border-white/5">
                                        <img src={item.image} className="w-12 h-12 object-contain" />
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="text-white font-bold text-sm">{item.name}</h3>
                                        <p className="text-gray-500 text-xs">Qty: {item.quantity} | {item.size}</p>
                                    </div>
                                    <span className="text-white font-mono">{item.price}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-white/10 pt-6 flex justify-between items-center">
                            <span className="text-gray-400 uppercase font-bold text-sm">Total</span>
                            <span className="text-4xl font-black text-blue-500">${cartTotal}</span>
                        </div>
                    </div>

                    {/* Shipping Address Form */}
                    <div className="bg-zinc-900/50 p-8 rounded-3xl border border-white/10">
                        <div className="flex items-center gap-2 mb-6">
                            <MapPin className="text-blue-500 w-6 h-6" />
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Shipping Data</h2>
                        </div>
                        <div className="space-y-4">
                            {addresses.length > 0 && (
                                <div className="mb-6">
                                    <Label className="text-blue-400 mb-2 block font-bold">Paste from Drop Zone</Label>
                                    <select onChange={handleFillAddress} className="w-full bg-blue-900/20 border border-blue-500/30 text-blue-200 rounded-xl p-3 focus:outline-none focus:border-blue-500">
                                        <option value="">-- Manual Entry --</option>
                                        {addresses.map((a) => (
                                            <option key={a._id} value={a._id}>{a.address}, {a.city}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            <div className="grid gap-2">
                                <Label className="text-white">Street Address</Label>
                                <Input name="address" placeholder="123 Cyber Lane" value={shippingAddress.address} onChange={handleAddressChange} className="bg-black/50 border-white/10 text-white" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label className="text-white">City</Label>
                                    <Input name="city" placeholder="Neo Tokyo" value={shippingAddress.city} onChange={handleAddressChange} className="bg-black/50 border-white/10 text-white" />
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-white">Postal Code</Label>
                                    <Input name="postalCode" placeholder="90210" value={shippingAddress.postalCode} onChange={handleAddressChange} className="bg-black/50 border-white/10 text-white" />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-white">Country</Label>
                                <Input name="country" placeholder="United Republic" value={shippingAddress.country} onChange={handleAddressChange} className="bg-black/50 border-white/10 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Payment */}
                <div className="bg-zinc-950 p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden lg:sticky lg:top-32">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />
                    <div className="relative z-10 text-center space-y-6">
                        <h3 className="text-xl font-bold text-white uppercase tracking-wider">Payment Method</h3>

                        <div className="space-y-3">
                            <div
                                onClick={() => setPaymentMethod('RAZORPAY')}
                                className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${paymentMethod === 'RAZORPAY' ? 'bg-blue-600/20 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <CreditCard className="w-5 h-5" />
                                    <span className="font-bold">Online Payment</span>
                                </div>
                                {paymentMethod === 'RAZORPAY' && <div className="w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]" />}
                            </div>

                            <div
                                onClick={() => setPaymentMethod('COD')}
                                className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${paymentMethod === 'COD' ? 'bg-green-600/20 border-green-500 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className="w-5 h-5" />
                                    <span className="font-bold">Cash on Delivery</span>
                                </div>
                                {paymentMethod === 'COD' && <div className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e]" />}
                            </div>
                        </div>

                        <div className="bg-white/5 p-4 rounded-xl text-left space-y-2 mb-6">
                            <div className="flex justify-between text-sm text-gray-400"><span>Subtotal</span><span>${cartTotal}</span></div>
                            <div className="flex justify-between text-sm text-gray-400"><span>Shipping</span><span className="text-green-500">Free</span></div>
                            {couponApplied && (
                                <div className="flex justify-between text-sm text-green-400 font-bold">
                                    <span>Discount ({couponCode})</span>
                                    <span>-${(cartTotal * (discount / 100)).toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-sm text-gray-400"><span>Tax</span><span>$0.00</span></div>
                            <div className="border-b border-white/10 my-2" />
                            <div className="flex justify-between text-lg font-bold text-white"><span>Order Total</span><span>${finalTotal.toFixed(2)}</span></div>
                        </div>

                        {/* Coupon Input */}
                        <div className="flex gap-2 mb-4">
                            <Input
                                placeholder="FEARLESS20"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                disabled={couponApplied}
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 font-mono uppercase"
                            />
                            <Button
                                onClick={handleApplyCoupon}
                                disabled={couponApplied || !couponCode}
                                className={`${couponApplied ? 'bg-green-600 text-white' : 'bg-pink-600 hover:bg-pink-500 text-white'} font-bold`}
                            >
                                {couponApplied ? <CheckCircle className="w-4 h-4" /> : 'APPLY'}
                            </Button>
                        </div>

                        <Button
                            onClick={paymentMethod === 'RAZORPAY' ? handleRazorpayPayment : handleCodPayment}
                            disabled={loading}
                            className={`w-full py-6 text-lg font-bold rounded-xl shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all flex items-center justify-center gap-2 ${loading ? 'bg-zinc-800 text-gray-500 cursor-not-allowed' : paymentMethod === 'COD' ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
                        >
                            {loading ? (
                                <>Processing...</>
                            ) : (
                                <>
                                    {paymentMethod === 'COD' ? <ShieldCheck className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                                    {paymentMethod === 'COD' ? 'PLACE COD ORDER' : `PAY NOW - $${finalTotal.toFixed(2)}`}
                                </>
                            )}
                        </Button>

                        <div className="flex items-center justify-center gap-2 text-gray-600 text-[10px] font-mono uppercase tracking-widest mt-4">
                            <ShieldCheck className="w-3 h-3" /> Encrypted Transaction
                        </div>
                    </div>
                </div>

            </div>
            <Footer />
        </div>
    );
}


