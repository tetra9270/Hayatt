import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    category?: string;
    description?: string;
}

export interface CartItem extends Product {
    quantity: number;
}

interface CartState {
    cart: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    total: number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            cart: [],
            total: 0,
            addToCart: (product) => {
                const currentCart = get().cart;
                const existingItem = currentCart.find((item) => item.id === product.id);

                if (existingItem) {
                    const updatedCart = currentCart.map((item) =>
                        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                    );
                    set({ cart: updatedCart, total: get().total + product.price });
                } else {
                    set({ cart: [...currentCart, { ...product, quantity: 1 }], total: get().total + product.price });
                }
            },
            removeFromCart: (productId) => {
                const currentCart = get().cart;
                const itemToRemove = currentCart.find((item) => item.id === productId);
                if (!itemToRemove) return;

                const updatedCart = currentCart.filter((item) => item.id !== productId);
                set({ cart: updatedCart, total: get().total - (itemToRemove.price * itemToRemove.quantity) });
            },
            updateQuantity: (productId, quantity) => {
                const currentCart = get().cart;
                const item = currentCart.find((item) => item.id === productId);
                if (!item) return;

                const quantityDiff = quantity - item.quantity;
                const updatedCart = currentCart.map((item) =>
                    item.id === productId ? { ...item, quantity } : item
                );
                set({ cart: updatedCart, total: get().total + (item.price * quantityDiff) });
            },
            clearCart: () => set({ cart: [], total: 0 }),
        }),
        {
            name: 'nexus-cart-storage',
        }
    )
);
