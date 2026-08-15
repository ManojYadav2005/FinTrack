/**
 * Formats a number as Indian Rupees (₹ INR).
 * Uses the en-IN locale so numbers are also formatted with Indian comma grouping.
 * e.g. formatCurrency(150000) → "₹1,50,000.00"
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
