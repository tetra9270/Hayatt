"use client";
import { API_BASE_URL } from '@/lib/utils';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldAlert, Package, CheckCircle, Truck, Clock, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';
import { useAuthStore } from '@/store/authStore';

interface Order {
    _id: string;
    user: {
        name: string;
        email: string;
    };
    totalPrice: number;
    status: string;
    createdAt: string;
    paymentMethod: string;
    orderItems: any[];
}

export default function AdminPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    // Product Form State
    // Product Form State
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '', price: '', image: '', category: 'Tech', description: '', stock: 0,
        tag: 'New', colors: '', specs: ''
    });

    const categories = ["Fashion", "Tech", "Gaming", "Protection"];

    const router = useRouter();
    const { user } = useAuthStore();

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/upload`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${user?.token}` },
                body: formData
            });
            const data = await res.json();
            if (data.url) {
                setNewProduct(prev => ({ ...prev, image: data.url }));
            } else {
                alert("Upload failed: No URL returned");
            }
        } catch (error) {
            console.error('Upload Error:', error);
            alert("Image upload failed");
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            router.push('/dashboard');
            return;
        }

        const fetchAllOrders = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/orders/all-orders`, {
                    headers: { 'Authorization': `Bearer ${user.token}` },
                    cache: 'no-store'
                });
                if (res.ok) {
                    const data = await res.json();
                    setOrders(data);
                } else {
                    console.error("Failed to fetch all orders");
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllOrders();
    }, [user, router]);

    const handleCreateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const productPayload = {
                ...newProduct,
                colors: newProduct.colors.split(',').map(c => c.trim()),
                specs: newProduct.specs.split(',').map(s => s.trim())
            };

            const res = await fetch(`${API_BASE_URL}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify(productPayload)
            });

            if (res.ok) {
                alert("Product Deployed to Market.");
                setNewProduct({ name: '', price: '', image: '', category: 'Tech', description: '', stock: 0, tag: 'New', colors: '', specs: '' });
                setShowAddProduct(false);
            } else {
                alert("Deploy Failed.");
            }
        } catch (error) {
            console.error("Create Product Error", error);
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            const res = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                setOrders(orders.map(o => o._id === id ? { ...o, status: newStatus } : o));
            }
        } catch (error) {
            console.error("Update Status Error", error);
        }
    };

    const filteredOrders = filter === 'All' ? orders : orders.filter(o => o.status === filter);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
            case 'Processing': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
            case 'Shipped': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
            case 'Delivered': return 'text-green-500 bg-green-500/10 border-green-500/20';
            default: return 'text-gray-500';
        }
    };

    if (!user || user.role !== 'admin') return null;

    return (
        <div className="min-h-screen bg-transparent pt-32 pb-20">
            <div className="container mx-auto px-6">
                <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
                            <ShieldAlert className="text-red-500 w-10 h-10" /> NEXUS COMMAND
                        </motion.h1>
                        <p className="text-gray-500 mt-2 font-mono text-sm">Authorized Personnel Only. Monitoring Global Transactions.</p>
                    </div>

                    <div className="flex bg-zinc-900 border border-white/10 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
                        {['All', 'Pending', 'Shipped', 'Delivered'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${filter === status ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Add Product Section */}
                <div className="mb-12 bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden">
                    <button onClick={() => setShowAddProduct(!showAddProduct)} className="w-full flex justify-between items-center p-6 hover:bg-white/5 transition-colors">
                        <span className="font-bold text-white uppercase tracking-wider flex items-center gap-2"><Package className="text-blue-500" /> Add New Product</span>
                        <span className="text-2xl text-gray-500">{showAddProduct ? '-' : '+'}</span>
                    </button>
                    {showAddProduct && (
                        <div className="p-8 border-t border-white/10 bg-black/20">
                            <form onSubmit={handleCreateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div><label className="text-xs font-bold text-gray-500 uppercase">Asset Name</label><input required className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} placeholder="Plasma Rifle" /></div>
                                <div><label className="text-xs font-bold text-gray-500 uppercase">Price (String)</label><input required className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} placeholder="$499" /></div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Product Image</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white"
                                            value={newProduct.image}
                                            onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
                                            placeholder="Upload file or paste URL"
                                        />
                                        <div className="relative">
                                            <input
                                                type="file"
                                                onChange={handleImageUpload}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                accept="image/*"
                                            />
                                            <Button type="button" className="bg-zinc-800 hover:bg-zinc-700 h-full w-12 flex items-center justify-center rounded-xl p-0">
                                                {uploading ? <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <span className="text-xl">⬆️</span>}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                                    <select
                                        required
                                        className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white appearance-none"
                                        value={newProduct.category}
                                        onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat} className="bg-black text-white">{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="md:col-span-2"><label className="text-xs font-bold text-gray-500 uppercase">Description</label><textarea required className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} placeholder="Asset capabilities..." /></div>
                                <div><label className="text-xs font-bold text-gray-500 uppercase">Stock Quant</label><input type="number" required className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })} /></div>
                                <div><label className="text-xs font-bold text-gray-500 uppercase">Tag</label><input className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white" value={newProduct.tag} onChange={e => setNewProduct({ ...newProduct, tag: e.target.value })} placeholder="Best Seller" /></div>
                                <div><label className="text-xs font-bold text-gray-500 uppercase">Colors (comma sep)</label><input className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white" value={newProduct.colors} onChange={e => setNewProduct({ ...newProduct, colors: e.target.value })} placeholder="#FF0000, #00FF00" /></div>
                                <div><label className="text-xs font-bold text-gray-500 uppercase">Specs (comma sep)</label><input className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white" value={newProduct.specs} onChange={e => setNewProduct({ ...newProduct, specs: e.target.value })} placeholder="v2.0, 500TB" /></div>
                                <Button type="submit" className="md:col-span-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl mt-2">AUTHORIZE ASSET</Button>
                            </form>
                        </div>
                    )}
                </div>

                {isLoading ? (
                    <div className="text-white text-center py-20 animate-pulse">Establishing Secure Uplink...</div>
                ) : (
                    <div className="grid gap-6">
                        {filteredOrders.map((order, i) => (
                            <motion.div
                                key={order._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-colors group"
                            >
                                <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <span className="font-mono text-white/50 text-xs">#{order._id.slice(-6).toUpperCase()}</span>
                                            <span className={`px-2 py-0.5 rounded textxs font-bold border ${getStatusColor(order.status)} uppercase`}>{order.status}</span>
                                            <span className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-white">{order.user?.name || 'Unknown User'}</h3>
                                        <p className="text-gray-500 text-sm">{order.user?.email}</p>
                                    </div>

                                    <div className="flex items-center gap-8">
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 uppercase font-bold">Value</p>
                                            <p className="text-xl font-black text-white">${order.totalPrice}</p>
                                        </div>

                                        <div className="flex items-center gap-2 bg-black border border-white/10 p-1 rounded-lg">
                                            <button onClick={() => handleStatusUpdate(order._id, 'Pending')} title="Mark Pending" className="p-2 hover:bg-white/10 rounded text-yellow-500"><Clock className="w-4 h-4" /></button>
                                            <button onClick={() => handleStatusUpdate(order._id, 'Shipped')} title="Mark Shipped" className="p-2 hover:bg-white/10 rounded text-purple-500"><Truck className="w-4 h-4" /></button>
                                            <button onClick={() => handleStatusUpdate(order._id, 'Delivered')} title="Mark Delivered" className="p-2 hover:bg-white/10 rounded text-green-500"><CheckCircle className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-6 pb-6 pt-0 border-t border-white/5 bg-black/20 hidden group-hover:block transition-all">
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {/* Quick look at items names */}
                                        {order.orderItems.map((item: any, idx) => (
                                            <div key={idx} className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-xs text-white border border-white/10">{item.qty}</div>
                                                <p className="text-xs text-gray-400 truncate">{item.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
