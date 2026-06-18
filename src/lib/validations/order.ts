import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .min(10, "Enter a valid phone number")
    .regex(/^[0-9]{10,15}$/, "Enter a valid phone number"),
  address: z.string().min(10, "Enter your full delivery address"),
  pincode: z
    .string()
    .min(6, "Enter a valid 6-digit pincode")
    .regex(/^[0-9]{6}$/, "Enter a valid 6-digit pincode"),
  notes: z.string().optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
