"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Currency = 'USD' | 'EUR' | 'INR' | 'GBP';

interface CurrencyContextType {
    currency: Currency;
    setCurrency: (c: Currency) => void;
    convertPrice: (priceStr: string) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const RATES = {
    USD: 1,
    EUR: 0.92,
    INR: 83.50,
    GBP: 0.79
};

const SYMBOLS = {
    USD: '$',
    EUR: '€',
    INR: '₹',
    GBP: '£'
};

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
    const [currency, setCurrency] = useState<Currency>('USD');

    const convertPrice = (priceStr: string): string => {
        // Assume input is like "$299" or "$1,200"
        const numericPart = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
        if (isNaN(numericPart)) return priceStr;

        const converted = numericPart * RATES[currency];

        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(converted);
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, convertPrice }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (!context) throw new Error("useCurrency must be used within CurrencyProvider");
    return context;
}
