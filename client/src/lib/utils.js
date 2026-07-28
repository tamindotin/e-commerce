import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function currency(n) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n || 0);
}

export function stockInfo(stock) {
  if (stock <= 0)
    return {
      label: "Out of stock",
      cls: "bg-red-50 text-red-700 border-red-200",
    };
  if (stock <= 10)
    return {
      label: "Low stock",
      cls: "bg-amber-50 text-amber-700 border-amber-200",
    };
  return {
    label: "In stock",
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
}

export function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}
