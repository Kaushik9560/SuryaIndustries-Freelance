"use client";
import React, { createContext, useCallback, useContext, useState } from "react";
import { INITIAL_PRODUCTS } from "@/data/products";
import { createBrowserStore, useBrowserStore } from "@/hooks/useBrowserStore";
function deserializeWishlist(rawValue) {
    const parsed = JSON.parse(rawValue);
    if (!Array.isArray(parsed))
        throw new Error("Stored wishlist has an unsupported shape");
    return [...new Set(parsed.filter((item) => typeof item === "string"))];
}
const wishlistStore = createBrowserStore({
    key: "surya_wishlist",
    defaultValue: [],
    deserialize: deserializeWishlist,
});
const ProductContext = createContext(undefined);
export function ProductProvider({ children, products = INITIAL_PRODUCTS, }) {
    const [wishlist, setWishlist] = useBrowserStore(wishlistStore);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isNotifyOpen, setIsNotifyOpen] = useState(false);
    const [notifyTargetProduct, setNotifyTargetProduct] = useState(null);
    const openProductDetail = useCallback((product) => {
        setSelectedProduct(product);
        setIsDetailOpen(true);
    }, []);
    const closeProductDetail = useCallback(() => {
        setIsDetailOpen(false);
    }, []);
    const openNotifyModal = useCallback((product) => {
        setNotifyTargetProduct(product);
        setIsNotifyOpen(true);
    }, []);
    const closeNotifyModal = useCallback(() => {
        setIsNotifyOpen(false);
    }, []);
    const toggleWishlist = useCallback((productId) => {
        setWishlist((previous) => previous.includes(productId)
            ? previous.filter((id) => id !== productId)
            : [...previous, productId]);
    }, [setWishlist]);
    const isInWishlist = useCallback((productId) => wishlist.includes(productId), [wishlist]);
    return (<ProductContext.Provider value={{
            products,
            wishlist,
            selectedProduct,
            isDetailOpen,
            isNotifyOpen,
            notifyTargetProduct,
            openProductDetail,
            closeProductDetail,
            openNotifyModal,
            closeNotifyModal,
            toggleWishlist,
            isInWishlist,
        }}>
      {children}
    </ProductContext.Provider>);
}
export function useProducts() {
    const context = useContext(ProductContext);
    if (!context)
        throw new Error("useProducts must be used within a ProductProvider");
    return context;
}
