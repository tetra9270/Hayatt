"use client";
import { API_BASE_URL } from '@/lib/utils';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Package, User, LogOut, MapPin, CheckCircle, Truck, Box, Ticket, Copy, XCircle, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';
import { useAuthStore } from '@/store/authStore';

interface OrderItem {
    name: string;
    quantity: number;
    price: number;
    image: string;
}

interface Order {
    _id: string;
    totalPrice: number;
    status: string;
    createdAt: string;
    paymentMethod: string;
    orderItems: OrderItem[];
    shippingAddress: {
        address: string;
        city: string;
        country: string;
        postalCode: string;
    };
}

interface Coupon {
    _id: string;
    code: string;
    festivalName: string;
    discountPercentage: number;
    validUntil: string;
    message: string;
}

function DashboardContent() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'coupons' | 'wishlist'>('orders');
    const [newAddress, setNewAddress] = useState({
        address: '',
        city: '',
        postalCode: '',
        country: ''
    });

    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, login, logout } = useAuthStore();
    const tabParam = searchParams.get('tab');

    // Effect to update tab from URL
    useEffect(() => {
        if (tabParam && ['orders', 'addresses', 'coupons', 'wishlist'].includes(tabParam)) {
            setActiveTab(tabParam as any);
        }
    }, [tabParam]);

    const [allProductsData, setAllProductsData] = useState<any[]>([]);

    useEffect(() => {
        // Fetch products to resolve details
        fetch(`${API_BASE_URL}/products`)
            .then(res => res.json())
            .then(data => {
                // Import static for fallback if needed, but assuming API returns all or we mix
                // Ideally we should import allProducts from @/data/products but dynamic import issue?
                // For now, let's fetch DB products. If static products aren't in DB, we rely on static import?
                // Let's import static here.
            })
            .catch(err => console.error(err));
    }, []);

    // ... fetchData existing logic

    // Updated Fetch to include all products for resolving wishlist
    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }

        const fetchData = async () => {
            try {
                // ... orders
                const ordersRes = await fetch(`${API_BASE_URL}/orders/my-orders`, {
                    headers: { 'Authorization': `Bearer ${user.token}` },
                    cache: 'no-store'
                });
                if (ordersRes.ok) setOrders(await ordersRes.json());

                // ... profile
                const userRes = await fetch(`${API_BASE_URL}/auth/me`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                if (userRes.ok) login({ ...await userRes.json(), token: user.token });

                // ... coupons
                const couponsRes = await fetch(`${API_BASE_URL}/coupons/active`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                if (couponsRes.ok) setCoupons(await couponsRes.json());

                // Fetch Products for Wishlist resolution
                // We need to merge static + dynamic to find product by ID
                const prodRes = await fetch(`${API_BASE_URL}/products`);
                const prodData = await prodRes.json();

                // We need 'allProducts' from local data to merge
                // Since I can't easily import it here without potentially large changes, 
                // I will try to fetch it properly or just rely on what I can get.
                // Assuming backend /api/products returns what we need or we import.
                // Dynamic import of static data?
                const { allProducts } = await import('@/data/products');

                let combined = [...allProducts];
                if (prodData.products) {
                    const dbProds = prodData.products.map((p: any) => ({
                        id: p._id,
                        name: p.name,
                        price: p.price,
                        image: p.image
                    }));
                    combined = [...combined, ...dbProds];
                }
                setAllProductsData(combined);

            } catch (err) {
                console.error("Failed to fetch data", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [user?.token, router]);

    const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);
    const [cancelReason, setCancelReason] = useState("");

    const handleCancelOrder = async () => {
        if (!cancelOrderId || !cancelReason) return;

        try {
            const res = await fetch(`${API_BASE_URL}/orders/${cancelOrderId}/cancel`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ reason: cancelReason })
            });

            if (res.ok) {
                alert("Order cancelled successfully");
                // Update local list
                setOrders(orders.map(o => o._id === cancelOrderId ? { ...o, status: 'Cancelled' } : o));
                setCancelOrderId(null);
                setCancelReason("");
            } else {
                const err = await res.json();
                alert(err.message || "Failed to cancel order");
            }
        } catch (error) {
            console.error("Cancel Error", error);
            alert("Error cancelling order");
        }
    };

    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        alert(`Coupon ${code} copied to clipboard!`);
    };

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const handleAddAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE_URL}/auth/add-address`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(newAddress)
            });
            if (res.ok) {
                const updatedUser = await res.json();
                login({ ...updatedUser, token: user.token });
                setNewAddress({ address: '', city: '', postalCode: '', country: '' });
                alert("New drop zone authorized.");
            }
        } catch (error) {
            console.error("Address Error", error);
        }
    };

    const handleDeleteAddress = async (id: string) => {
        if (!confirm("De-authorize this drop zone?")) return;
        try {
            const res = await fetch(`${API_BASE_URL}/auth/address/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (res.ok) {
                const updatedUser = await res.json();
                login({ ...updatedUser, token: user.token });
            }
        } catch (error) {
            console.error("Address Delete Error", error);
        }
    };

    const getStatusStep = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending': return 1;
            case 'processing': return 1;
            case 'shipped': return 2;
            case 'delivered': return 3;
            default: return 1;
        }
    };

    return (
        <div className="min-h-screen bg-transparent pt-20 md:pt-32 pb-20">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="w-full lg:w-72 space-y-4">
                        <div className="bg-zinc-900 border border-white/10 p-8 rounded-3xl text-center shadow-lg">
                            {/* User Profile Card Content ... same as before ... */}
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center text-white shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                                <User className="w-10 h-10" />
                            </div>
                            <h2 className="text-xl font-bold text-white mb-1">{user?.name}</h2>
                            <p className="text-gray-500 text-xs font-mono mb-6">{user?.email}</p>

                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold uppercase tracking-wider mb-4">
                                {user?.rank || 'Recruit'}
                            </div>

                            <div className="text-left px-4">
                                <div className="flex justify-between text-[10px] text-gray-500 mb-1 font-bold uppercase">
                                    <span>XP Progress</span>
                                    <span>{user?.xp || 0} / 10000</span>
                                </div>
                                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                        style={{ width: `${Math.min(((user?.xp || 0) / 10000) * 100, 100)}%` }}
                                    />
                                </div>
                                <p className="text-[10px] text-gray-600 mt-2 text-center">Earn XP needed for Legend Status</p>
                            </div>
                        </div>
                        <nav className="space-y-2">
                            <Button
                                variant="ghost"
                                onClick={() => setActiveTab('orders')}
                                className={`w-full justify-start h-12 rounded-xl transition-all ${activeTab === 'orders' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                            >
                                <Package className="mr-3 w-5 h-5" /> Mission Logs
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => setActiveTab('addresses')}
                                className={`w-full justify-start h-12 rounded-xl transition-all ${activeTab === 'addresses' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                            >
                                <MapPin className="mr-3 w-5 h-5" /> Drop Zones
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => setActiveTab('wishlist')}
                                className={`w-full justify-start h-12 rounded-xl transition-all ${activeTab === 'wishlist' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                            >
                                <Heart className="mr-3 w-5 h-5" /> Saved Protocols
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => setActiveTab('coupons')}
                                className={`w-full justify-start h-12 rounded-xl transition-all ${activeTab === 'coupons' ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                            >
                                <Ticket className="mr-3 w-5 h-5" /> Exclusive Offers
                            </Button>
                            <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-red-500 hover:text-red-400 hover:bg-red-500/10 h-12 rounded-xl"><LogOut className="mr-3 w-5 h-5" /> Log Out</Button>
                        </nav>
                    </motion.div>

                    {/* Main Content */}
                    <div className="flex-grow">
                        {activeTab === 'orders' && (
                            /* Mission Logs Content */
                            <>
                                <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-black text-white uppercase tracking-tighter mb-8 flex items-center gap-3">
                                    <Box className="text-blue-500 w-8 h-8" /> Mission Logs
                                </motion.h1>

                                <div className="space-y-8">
                                    {isLoading ? (
                                        <div className="text-gray-500">Loading mission data...</div>
                                    ) : orders.length === 0 ? (
                                        <div className="text-center text-gray-500 py-20 bg-zinc-900/50 rounded-3xl border border-white/5 dashed border-2">
                                            <p className="mb-4">No active missions found.</p>
                                            <Button onClick={() => router.push('/products')} variant="outline" className="border-white/20 text-white hover:bg-white/10">Browse Gear</Button>
                                        </div>
                                    ) : (
                                        orders.map((order, i) => {
                                            const currentStep = getStatusStep(order.status);
                                            return (
                                                <motion.div
                                                    key={order._id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: i * 0.1 }}
                                                    className="bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-xl"
                                                >
                                                    {/* Header */}
                                                    <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between md:items-center gap-4 bg-white/5">
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-3">
                                                                <h3 className="text-white font-bold text-lg">Order #{order._id.slice(-6).toUpperCase()}</h3>
                                                                <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-gray-400 font-mono">{new Date(order.createdAt).toLocaleDateString()}</span>
                                                                <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20 uppercase">{order.paymentMethod || 'Card'}</span>
                                                            </div>
                                                            <div className="text-sm text-gray-400 flex items-center gap-2">
                                                                <MapPin className="w-3 h-3" /> {order.shippingAddress.city}, {order.shippingAddress.country}
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xs text-gray-500 uppercase font-bold">Total Amount</p>
                                                            <p className="text-2xl font-black text-white">${order.totalPrice}</p>

                                                            {/* Cancel Order Section */}
                                                            {(order.status === 'Pending' || order.status === 'Processing') && (
                                                                <div className="mt-2">
                                                                    {cancelOrderId === order._id ? (
                                                                        <div className="flex flex-col gap-2 items-end bg-black/50 p-2 rounded-xl">
                                                                            <select
                                                                                className="bg-zinc-800 text-white text-xs p-2 rounded-lg border border-white/10"
                                                                                value={cancelReason}
                                                                                onChange={(e) => setCancelReason(e.target.value)}
                                                                            >
                                                                                <option value="">Select Reason...</option>
                                                                                <option value="Changed my mind">Changed my mind</option>
                                                                                <option value="Found a better price">Found a better price</option>
                                                                                <option value="Ordered by mistake">Ordered by mistake</option>
                                                                                <option value="Delayed shipping">Delayed shipping</option>
                                                                                <option value="Other">Other</option>
                                                                            </select>
                                                                            <div className="flex gap-2">
                                                                                <button onClick={() => setCancelOrderId(null)} className="text-xs text-gray-400 hover:text-white">Close</button>
                                                                                <Button
                                                                                    size="sm"
                                                                                    variant="destructive"
                                                                                    className="h-8 text-xs"
                                                                                    onClick={handleCancelOrder}
                                                                                    disabled={!cancelReason}
                                                                                >
                                                                                    Confirm Cancel
                                                                                </Button>
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <button
                                                                            onClick={() => { setCancelOrderId(order._id); setCancelReason(""); }}
                                                                            className="text-xs text-red-500 hover:text-red-400 font-bold flex items-center justify-end gap-1 mt-1"
                                                                        >
                                                                            <XCircle className="w-3 h-3" /> Cancel Order
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Tracking Stepper */}
                                                    <div className="p-8 bg-black/20">
                                                        <div className="relative flex items-center justify-between max-w-2xl mx-auto">
                                                            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-zinc-800 -z-10" />
                                                            <div className={`absolute left-0 top-1/2 h-0.5 bg-blue-500 -z-10 transition-all duration-1000`} style={{ width: `${(currentStep - 1) * 50}%` }} />

                                                            {['Pending', 'Shipped', 'Delivered'].map((step, idx) => {
                                                                const isCompleted = idx + 1 <= currentStep;
                                                                const isCurrent = idx + 1 === currentStep;
                                                                return (
                                                                    <div key={step} className="flex flex-col items-center gap-2 bg-black px-2">
                                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${isCompleted ? 'bg-blue-500 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-zinc-900 border-zinc-700 text-zinc-500'}`}>
                                                                            {idx === 0 && <Box className="w-4 h-4" />}
                                                                            {idx === 1 && <Truck className="w-4 h-4" />}
                                                                            {idx === 2 && <CheckCircle className="w-4 h-4" />}
                                                                        </div>
                                                                        <span className={`text-xs font-bold uppercase tracking-wider ${isCurrent ? 'text-blue-400' : isCompleted ? 'text-white' : 'text-zinc-600'}`}>{step}</span>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>

                                                    {/* Items */}
                                                    <div className="p-6">
                                                        {(order.orderItems || []).map((item, j) => (
                                                            <div key={j} className="flex items-center gap-4 py-4 border-b border-white/5 last:border-0 hover:bg-white/5 p-4 rounded-xl transition-colors">
                                                                <div className="w-16 h-16 bg-zinc-800 rounded-lg flex-shrink-0 flex items-center justify-center border border-white/10 overflow-hidden">
                                                                    {item.image ? (
                                                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <Package className="w-6 h-6 text-gray-600" />
                                                                    )}
                                                                </div>
                                                                <div className="flex-grow">
                                                                    <h4 className="text-white font-bold">{item.name}</h4>
                                                                    <div className="flex gap-4 mt-1">
                                                                        <p className="text-gray-500 text-xs">Qty: <span className="text-white">{item.quantity}</span></p>
                                                                    </div>
                                                                </div>
                                                                <span className="text-white font-mono">${item.price}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            );
                                        })
                                    )}
                                </div>
                            </>
                        )}

                        {activeTab === 'addresses' && (
                            /* Addresses Tab Content ... same as before ... */
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                                <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-8 flex items-center gap-3">
                                    <MapPin className="text-blue-500 w-8 h-8" /> Drop Zones
                                </h1>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Add New Address Form */}
                                    <div className="bg-zinc-900 border border-white/10 p-8 rounded-3xl h-fit">
                                        <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">New Zone Authorization</h2>
                                        <form onSubmit={handleAddAddress} className="space-y-4">
                                            {/* ... Address Form ... */}
                                            <div><label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Street Address</label><input required className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500" value={newAddress.address} onChange={e => setNewAddress({ ...newAddress, address: e.target.value })} placeholder="Sector 7G, Night City" /></div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div><label className="text-xs text-gray-500 font-bold uppercase mb-1 block">City</label><input required className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500" value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} placeholder="Neo Tokyo" /></div>
                                                <div><label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Postal Code</label><input required className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500" value={newAddress.postalCode} onChange={e => setNewAddress({ ...newAddress, postalCode: e.target.value })} placeholder="90210" /></div>
                                            </div>
                                            <div><label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Country</label><input required className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500" value={newAddress.country} onChange={e => setNewAddress({ ...newAddress, country: e.target.value })} placeholder="United Republic" /></div>
                                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl mt-4">AUTHORIZE ZONE</Button>
                                        </form>
                                    </div>

                                    {/* Existing Addresses */}
                                    <div className="space-y-4">
                                        {user?.addresses && user.addresses.length > 0 ? (
                                            user.addresses.map((addr: any) => (
                                                <div key={addr._id} className="bg-zinc-900 border border-white/10 p-6 rounded-2xl flex justify-between items-start group hover:border-blue-500/50 transition-colors">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <MapPin className="text-blue-500 w-4 h-4" />
                                                            <h3 className="text-white font-bold">{addr.city}</h3>
                                                        </div>
                                                        <p className="text-gray-400 text-sm">{addr.address}</p>
                                                        <p className="text-gray-500 text-xs mt-1">{addr.postalCode}, {addr.country}</p>
                                                    </div>
                                                    <button onClick={() => handleDeleteAddress(addr._id)} className="text-zinc-600 hover:text-red-500 transition-colors p-2">
                                                        <LogOut className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center text-gray-500 py-10 border border-white/5 border-dashed rounded-3xl">
                                                <MapPin className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                                <p>No drop zones authorized.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'wishlist' && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                                <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-8 flex items-center gap-3">
                                    <Heart className="text-purple-500 w-8 h-8" /> Saved Protocols
                                </h1>

                                {(!user?.wishlist || user.wishlist.length === 0) ? (
                                    <div className="text-center text-gray-500 py-20 bg-zinc-900/50 rounded-3xl border border-white/5 dashed border-2">
                                        <Heart className="w-12 h-12 mx-auto mb-4 opacity-20 text-purple-500" />
                                        <p className="mb-4">No saved protocols found.</p>
                                        <Button onClick={() => router.push('/products')} variant="outline" className="border-white/20 text-white hover:bg-white/10">Explore Gear</Button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {user.wishlist.map((id: string) => {
                                            const product = allProductsData.find((p: any) => p.id.toString() === id.toString());
                                            if (!product) return null;
                                            return (
                                                <div key={id} className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden group">
                                                    <div className="relative aspect-square bg-black/50 p-4">
                                                        <img src={product.image} className="w-full h-full object-contain" alt={product.name} />
                                                        <button
                                                            onClick={async () => {
                                                                if (!confirm("Remove from wishlist?")) return;
                                                                try {
                                                                    const res = await fetch(`${API_BASE_URL}/auth/wishlist/${id}`, {
                                                                        method: 'DELETE',
                                                                        headers: { 'Authorization': `Bearer ${user.token}` }
                                                                    });
                                                                    if (res.ok) {
                                                                        const updated = await res.json();
                                                                        login({ ...user, wishlist: updated, token: user.token });
                                                                    }
                                                                } catch (err) { console.error(err); }
                                                            }}
                                                            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-red-500/20 hover:text-red-500 text-white rounded-full transition-colors backdrop-blur-sm"
                                                        >
                                                            <XCircle className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                    <div className="p-4">
                                                        <h4 className="text-white font-bold truncate">{product.name}</h4>
                                                        <p className="text-purple-400 font-mono mt-1">{product.price}</p>
                                                        <Button
                                                            onClick={() => router.push('/products')}
                                                            className="w-full mt-4 bg-white/5 hover:bg-white/10 text-white border border-white/10"
                                                        >
                                                            View Details
                                                        </Button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'coupons' && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                                <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-8 flex items-center gap-3">
                                    <Ticket className="text-pink-500 w-8 h-8" /> Exclusive Offers
                                </h1>
                                {coupons.length === 0 ? (
                                    <div className="text-center text-gray-500 py-20 bg-zinc-900/50 rounded-3xl border border-white/5 dashed border-2">
                                        <Ticket className="w-12 h-12 mx-auto mb-4 opacity-20 text-pink-500" />
                                        <p className="mb-4">No active offers available at this time.</p>
                                        <p className="text-sm">Check back before major festivals!</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {coupons.map((coupon, i) => (
                                            <motion.div
                                                key={coupon._id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="relative group overflow-hidden bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-3xl p-6 hover:border-pink-500/50 transition-all duration-300"
                                            >
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-[50px] pointer-events-none" />

                                                <div className="relative z-10 flex justify-between items-start">
                                                    <div>
                                                        <span className="inline-block px-3 py-1 bg-pink-500/10 text-pink-400 border border-pink-500/20 rounded-full text-[10px] font-black uppercase tracking-widest mb-2">
                                                            {coupon.festivalName}
                                                        </span>
                                                        <h3 className="text-3xl font-black text-white mb-1">
                                                            {coupon.discountPercentage}% OFF
                                                        </h3>
                                                        <p className="text-gray-400 text-sm mb-4">{coupon.message}</p>
                                                        <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                                                            <span>Expires:</span>
                                                            <span className="text-white">{new Date(coupon.validUntil).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>

                                                    <Ticket className="w-24 h-24 text-zinc-800 -rotate-12 absolute -right-4 -bottom-4 group-hover:text-pink-900/20 transition-colors" />
                                                </div>

                                                <div className="mt-6 pt-6 border-t border-dashed border-white/10 flex items-center justify-between">
                                                    <div className="font-mono text-xl tracking-widest text-white font-bold bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                                                        {coupon.code}
                                                    </div>
                                                    <Button
                                                        onClick={() => handleCopyCode(coupon.code)}
                                                        className="bg-white text-black hover:bg-pink-500 hover:text-white transition-colors rounded-xl font-bold"
                                                    >
                                                        <Copy className="w-4 h-4 mr-2" /> Copy
                                                    </Button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading Mission Control...</div>}>
            <DashboardContent />
        </Suspense>
    );
}
