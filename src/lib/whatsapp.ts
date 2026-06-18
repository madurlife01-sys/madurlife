import type { CartItem } from "@/store/cart";

interface OrderDetails {
  orderNumber: string;
  items: CartItem[];
  total: number;
  deliveryName: string;
  deliveryPhone: string;
  deliveryAddress: string;
  deliveryPincode: string;
  notes?: string;
}

export function buildWhatsAppMessage(order: OrderDetails): string {
  const itemsList = order.items
    .map(
      (item, i) =>
        `${i + 1}. ${item.name} x ${item.quantity} — ₹${item.price * item.quantity}`
    )
    .join("\n");

  const message = [
    "\u{1F33E} *Madur Life — Order Confirmation*",
    `Order: ${order.orderNumber}`,
    "",
    "*Items:*",
    itemsList,
    `Total: ₹${order.total}`,
    "",
    "*Delivery:*",
    `Name: ${order.deliveryName}`,
    `Phone: ${order.deliveryPhone}`,
    `Address: ${order.deliveryAddress}, ${order.deliveryPincode}`,
    `Payment: Cash on Delivery`,
    order.notes ? `\n*Notes:* ${order.notes}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return message;
}

export function getWhatsAppUrl(message: string): string {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+919483205069";
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=${encoded}`;
}
