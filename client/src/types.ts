export interface Product {
    id: number | string;
    name: string;
    price: string;
    rating: number;
    image: string;
    tag: string;
    category: string;
    description: string;
    stock: number;
    specs: string[];
    reviews: number;
    colors: string[];
    lore: string;
}

export interface CartItem {
    id: number | string;
    name: string;
    price: string;
    image: string;
    quantity: number;
    size: string;
    color: string;
}

export interface Toast {
    id: number;
    message: string;
    type: 'success' | 'info';
}
