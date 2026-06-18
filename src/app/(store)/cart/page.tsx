"use client";

import Link from "next/link";
import { useCart } from "@/store/cart";
import { useLanguage } from "@/hooks/use-language";
import { AnimateIn } from "@/components/animate-in";
import dynamic from "next/dynamic";

const InteractiveJar = dynamic(
  () => import("@/components/three/interactive-jar").then((m) => m.InteractiveJar),
  { ssr: false }
);

export default function CartPage() {
  const { t } = useLanguage();
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
          {t.cart.title}
        </h1>
        <div className="mt-16 text-center py-12">
          <div className="mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-primary/5 to-secondary/5 border border-border">
            <svg className="h-16 w-16 text-muted/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
          </div>
          <p className="text-xl font-medium text-foreground mb-2">Your cart is empty</p>
          <p className="text-muted text-sm mb-8">Start adding some fresh, organic products!</p>
          <Link href="/products" className="btn-primary">
            {t.cart.continueShopping}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
            {t.cart.title}
          </h1>
          <p className="mt-1 text-sm text-muted">{items.length} item{items.length > 1 ? "s" : ""} in your cart</p>
        </div>
        <button
          onClick={clearCart}
          className="btn-secondary text-error border-error/30 hover:bg-error/5 hover:border-error/50 text-sm h-9"
        >
          Clear All
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Cart Items */}
        <div className="space-y-4">
          {items.map((item, i) => (
            <AnimateIn key={item.product_id} delay={i * 60}>
              <div className="flex items-center gap-5 rounded-2xl border border-border bg-white dark:bg-zinc-900 p-5 card-hover">
                {/* Image */}
                <div className="h-24 w-24 shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5 border border-border">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-2xl">
                      🌾
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-card-foreground truncate">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted">
                    ₹{item.price} / {item.unit}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-primary">
                    ₹{item.price * item.quantity}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center rounded-xl border border-border overflow-hidden">
                  <button
                    onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                    className="flex h-10 w-10 items-center justify-center text-foreground hover:bg-primary/5 hover:text-primary transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                    </svg>
                  </button>
                  <span className="flex h-10 w-12 items-center justify-center text-sm font-semibold text-foreground border-x border-border">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                    className="flex h-10 w-10 items-center justify-center text-foreground hover:bg-primary/5 hover:text-primary transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </button>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.product_id)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-muted hover:text-error hover:bg-error/5 transition-colors"
                  title="Remove"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            </AnimateIn>
          ))}
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="glass-panel rounded-2xl p-5 flex flex-col items-center justify-center overflow-hidden border border-border">
            <InteractiveJar />
            <p className="text-xs text-muted mt-2 text-center pointer-events-none">Hover jar to shake the grains!</p>
          </div>

          <div className="rounded-2xl border border-border bg-white dark:bg-zinc-900 p-6 sticky top-24">
            <h2 className="font-serif text-lg font-semibold text-card-foreground mb-5">
              Order Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Subtotal ({items.reduce((a, b) => a + b.quantity, 0)} items)</span>
                <span className="font-medium text-foreground">₹{getTotal()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Delivery</span>
                <span className="font-medium text-success">Free</span>
              </div>
              <div className="border-t border-border pt-4 mt-4 flex justify-between">
                <span className="font-semibold text-foreground">Total</span>
                <span className="text-xl font-bold text-primary">₹{getTotal()}</span>
              </div>
            </div>
            <Link
              href="/checkout"
              className="mt-6 btn-primary w-full justify-center"
            >
              Proceed to Checkout
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <p className="mt-3 text-center text-[11px] text-muted">
              Cash on Delivery — Pay when you receive
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
