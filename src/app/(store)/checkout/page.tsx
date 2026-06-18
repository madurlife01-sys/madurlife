"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCart } from "@/store/cart";
import { checkoutSchema, type CheckoutFormData } from "@/lib/validations/order";
import { buildWhatsAppMessage, getWhatsAppUrl } from "@/lib/whatsapp";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/hooks/use-language";

export default function CheckoutPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { userId } = useAuth();
  const { items, getTotal, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  if (items.length === 0 && !orderNumber) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
          {t.checkout.title}
        </h1>
        <div className="mt-16 text-center py-12">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/5 border border-border">
            <span className="text-4xl">🛒</span>
          </div>
          <p className="text-lg font-medium text-foreground mb-2">{t.cart.empty}</p>
          <p className="text-sm text-muted mb-6">Add some products before checking out</p>
          <Link href="/products" className="btn-primary inline-flex">
            {t.cart.continueShopping}
          </Link>
        </div>
      </div>
    );
  }

  const total = getTotal();

  const onSubmit = async (data: CheckoutFormData) => {
    setSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();
      const orderNumber = `#ML-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(Math.random() * 9999).toString().padStart(4, "0")}`;

      const { error: insertError } = await supabase.from("orders").insert({
        order_number: orderNumber,
        user_id: userId || null,
        items: items as any,
        total,
        delivery_name: data.fullName,
        delivery_phone: data.phone,
        delivery_address: data.address,
        delivery_pincode: data.pincode,
        notes: data.notes || null,
        status: "pending",
      });

      if (insertError) throw insertError;

      const message = buildWhatsAppMessage({
        orderNumber,
        items,
        total,
        deliveryName: data.fullName,
        deliveryPhone: data.phone,
        deliveryAddress: data.address,
        deliveryPincode: data.pincode,
        notes: data.notes,
      });

      const waUrl = getWhatsAppUrl(message);

      setOrderNumber(orderNumber);
      setWhatsappUrl(waUrl);
      clearCart();
      setStep(3);
    } catch (err) {
      setError("Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    { num: 1, label: t.checkout.step1, icon: "📦" },
    { num: 2, label: t.checkout.step2, icon: "📝" },
    { num: 3, label: t.checkout.step3, icon: "✅" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl mb-8">
        Checkout
      </h1>

      {/* Step Indicator */}
      <div className="mb-10">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all duration-500 ${
                    step >= s.num
                      ? "bg-gradient-to-br from-primary to-emerald-600 text-white shadow-lg shadow-primary/30"
                      : "bg-zinc-100 text-muted dark:bg-zinc-800"
                  }`}
                >
                  {step > s.num ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : (
                    s.icon
                  )}
                </div>
                <span className={`mt-2 text-xs font-medium hidden sm:block ${step >= s.num ? "text-foreground" : "text-muted"}`}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="flex-1 mx-3">
                  <div className="h-0.5 rounded-full bg-border overflow-hidden">
                    <div
                      className={`h-full bg-primary transition-all duration-700 ease-out ${
                        step > s.num ? "w-full" : "w-0"
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Review Order */}
      {step === 1 && (
        <div className="animate-fade-in-up">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-6">
              {t.checkout.step1}
            </h2>
            <div className="space-y-3">
              {items.map((item, i) => (
                <div
                  key={item.product_id}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-white dark:bg-zinc-900 p-4"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="h-14 w-14 shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5 border border-border flex items-center justify-center text-xl">
                    🌾
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-card-foreground truncate">
                      {item.name}
                    </p>
                    <p className="text-sm text-muted">
                      {item.quantity} × ₹{item.price}
                    </p>
                  </div>
                  <p className="font-semibold text-foreground">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-border bg-white dark:bg-zinc-900 p-5">
              <div className="flex justify-between text-sm text-muted mb-2">
                <span>Subtotal</span>
                <span>₹{total}</span>
              </div>
              <div className="flex justify-between text-sm text-muted mb-3">
                <span>Delivery</span>
                <span className="text-success font-medium">Free</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-semibold text-foreground">
                <span>Total</span>
                <span className="text-lg text-primary">₹{total}</span>
              </div>
            </div>
            <button
              onClick={() => setStep(2)}
              className="mt-6 btn-primary w-full justify-center"
            >
              {t.checkout.step2}
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Delivery Details */}
      {step === 2 && (
        <form onSubmit={handleSubmit(onSubmit)} className="animate-fade-in-up max-w-2xl mx-auto">
          <h2 className="font-serif text-xl font-semibold text-foreground mb-6">
            {t.checkout.step2}
          </h2>

          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                {t.checkout.fullName}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </span>
                <input
                  {...register("fullName")}
                  className="flex h-12 w-full rounded-xl border border-border bg-white dark:bg-zinc-900 pl-10 pr-4 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="Enter your full name"
                />
              </div>
              {errors.fullName && (
                <p className="mt-1.5 text-xs text-error">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                {t.checkout.phone}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                  </svg>
                </span>
                <input
                  {...register("phone")}
                  className="flex h-12 w-full rounded-xl border border-border bg-white dark:bg-zinc-900 pl-10 pr-4 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="10-digit phone number"
                />
              </div>
              {errors.phone && (
                <p className="mt-1.5 text-xs text-error">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                {t.checkout.address}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-muted">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </span>
                <textarea
                  {...register("address")}
                  rows={3}
                  className="flex w-full rounded-xl border border-border bg-white dark:bg-zinc-900 pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                  placeholder="House / Flat No., Street, Area, City"
                />
              </div>
              {errors.address && (
                <p className="mt-1.5 text-xs text-error">{errors.address.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  {t.checkout.pincode}
                </label>
                <input
                  {...register("pincode")}
                  className="flex h-12 w-full rounded-xl border border-border bg-white dark:bg-zinc-900 px-4 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="6-digit pincode"
                />
                {errors.pincode && (
                  <p className="mt-1.5 text-xs text-error">{errors.pincode.message}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  {t.checkout.notes}
                </label>
                <input
                  {...register("notes")}
                  className="flex h-12 w-full rounded-xl border border-border bg-white dark:bg-zinc-900 px-4 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="Optional"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-xl bg-error/5 border border-error/20 px-4 py-3 text-sm text-error flex items-center gap-2">
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              {error}
            </div>
          )}

          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="btn-secondary h-12"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              {t.common.back}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary h-12 flex-1 justify-center disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {t.common.loading}
                </>
              ) : (
                <>
                  {t.checkout.placeOrder}
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Step 3: Order Success */}
      {step === 3 && orderNumber && (
        <div className="mt-8 animate-scale-in max-w-lg mx-auto">
          <div className="rounded-3xl border border-border bg-white dark:bg-zinc-900 p-8 sm:p-12 text-center shadow-xl">
            <div className="mx-auto mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-success/10 to-success/5">
              <svg
                className="h-12 w-12 text-success"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path
                  d="M5 13l4 4L19 7"
                  style={{
                    strokeDasharray: 24,
                    strokeDashoffset: 0,
                    animation: "checkmark-draw 0.5s ease-out 0.3s both",
                  }}
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              {t.checkout.orderPlaced}
            </h2>
            <p className="mt-2 text-muted font-medium">{orderNumber}</p>
            <p className="mt-2 text-sm text-muted">
              {t.checkout.whatsappFallback}
            </p>

            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex h-14 items-center justify-center gap-3 rounded-full bg-[#25D366] px-10 text-sm font-bold text-white shadow-lg shadow-[#25D366]/30 hover:bg-[#20bd5a] hover:scale-105 transition-all duration-200"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Confirm on WhatsApp
              </a>
            )}

            <div className="mt-6">
              <Link
                href="/products"
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                {t.cart.continueShopping} →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
