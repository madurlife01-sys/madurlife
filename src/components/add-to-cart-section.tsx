"use client";

import { useState } from "react";
import { useCart } from "@/store/cart";
import { toast } from "@/components/toast";

interface AddToCartSectionProps {
  productId: string;
  name: string;
  price: number;
  unit: string;
  inStock: boolean;
  image?: string;
  quantity?: number;
}

export function AddToCartSection({
  productId,
  name,
  price,
  unit,
  inStock,
  image,
  quantity: initialQuantity,
}: AddToCartSectionProps) {
  const [quantity, setQuantity] = useState(initialQuantity ?? 1);
  const { addItem } = useCart();

  function handleAddToCart() {
    for (let i = 0; i < quantity; i++) {
      addItem({ product_id: productId, name, price, unit, image });
    }
    toast(`${quantity}x ${name} added to cart`);
    setQuantity(1);
  }

  if (!inStock) {
    return (
      <div className="mt-6 flex items-center gap-3">
        <div className="flex items-center rounded-xl border border-border bg-muted/20">
          <button disabled className="flex h-10 w-10 items-center justify-center text-muted cursor-not-allowed">−</button>
          <span className="flex h-10 w-12 items-center justify-center text-sm font-medium text-muted border-x border-border">{quantity}</span>
          <button disabled className="flex h-10 w-10 items-center justify-center text-muted cursor-not-allowed">+</button>
        </div>
        <span className="text-sm font-medium text-error">Out of Stock</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-4">
        <div className="flex items-center rounded-xl border border-border overflow-hidden">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="flex h-10 w-10 items-center justify-center text-foreground hover:bg-primary/5 hover:text-primary transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
            </svg>
          </button>
          <span className="flex h-10 w-12 items-center justify-center text-sm font-semibold text-foreground border-x border-border">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="flex h-10 w-10 items-center justify-center text-foreground hover:bg-primary/5 hover:text-primary transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={!inStock}
        className="mt-6 btn-primary w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
        </svg>
        Add to Cart
      </button>
    </>
  );
}
