"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import { INITIAL_PRODUCTS } from "@/data/products";
import { createBrowserStore, useBrowserStore } from "@/hooks/useBrowserStore";
import type { ProductItem } from "@/types/catalog";

export type { ProductItem, ProductSpec } from "@/types/catalog";

interface ProductContextType {
  products: ProductItem[];
  wishlist: string[];
  selectedProduct: ProductItem | null;
  isDetailOpen: boolean;
  isNotifyOpen: boolean;
  notifyTargetProduct: ProductItem | null;
  openProductDetail: (product: ProductItem) => void;
  closeProductDetail: () => void;
  openNotifyModal: (product: ProductItem) => void;
  closeNotifyModal: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

function deserializeWishlist(rawValue: string): string[] {
  const parsed: unknown = JSON.parse(rawValue);
  if (!Array.isArray(parsed)) throw new Error("Stored wishlist has an unsupported shape");
  return [...new Set(parsed.filter((item): item is string => typeof item === "string"))];
}

const wishlistStore = createBrowserStore<string[]>({
  key: "surya_wishlist",
  defaultValue: [],
  deserialize: deserializeWishlist,
});

const ProductContext = createContext<ProductContextType | undefined>(undefined);

interface ProductProviderProps {
  children: React.ReactNode;
  products?: ProductItem[];
}

export function ProductProvider({
  children,
  products = INITIAL_PRODUCTS,
}: ProductProviderProps) {
  const [wishlist, setWishlist] = useBrowserStore(wishlistStore);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [notifyTargetProduct, setNotifyTargetProduct] = useState<ProductItem | null>(null);

  const openProductDetail = useCallback((product: ProductItem) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  }, []);

  const closeProductDetail = useCallback(() => {
    setIsDetailOpen(false);
  }, []);

  const openNotifyModal = useCallback((product: ProductItem) => {
    setNotifyTargetProduct(product);
    setIsNotifyOpen(true);
  }, []);

  const closeNotifyModal = useCallback(() => {
    setIsNotifyOpen(false);
  }, []);

  const toggleWishlist = useCallback(
    (productId: string) => {
      setWishlist((previous) =>
        previous.includes(productId)
          ? previous.filter((id) => id !== productId)
          : [...previous, productId]
      );
    },
    [setWishlist]
  );

  const isInWishlist = useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist]
  );

  return (
    <ProductContext.Provider
      value={{
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
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) throw new Error("useProducts must be used within a ProductProvider");
  return context;
}
