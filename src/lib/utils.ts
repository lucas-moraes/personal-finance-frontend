import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function FormatNumberToCurrency(number: number) {
  const formatedValue = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(number);

  return formatedValue;
}

/**
 * Formats a number string to Brazilian currency format (0.000.000,00)
 * @param value - The numeric string value
 * @returns Formatted string with dots for thousands and comma for decimal
 */
export function formatBRLInput(value: string): string {
  // Remove all non-digit characters
  const digitsOnly = value.replace(/\D/g, "");
  
  // Convert to number with 2 decimal places
  const numberValue = Number(digitsOnly) / 100;
  
  // Format as Brazilian currency without the R$ symbol
  return numberValue.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Parses a Brazilian formatted currency string back to a number
 * @param formattedValue - Brazilian formatted string (e.g., "1.231.212,31")
 * @returns The numeric value
 */
export function parseBRLInput(formattedValue: string): number {
  // Remove thousand separators (dots) and replace decimal comma with period
  const cleaned = formattedValue.replace(/\./g, "").replace(",", ".");
  return Number(cleaned);
}
