export function formatPrice(price: number, currency: string): string {
  switch (currency.toUpperCase()) {
    case "USD":
      return `$${price}`;
    case "EUR":
      return `${price}€`;
    case "PLN":
      return `${price} PLN`;
    default:
      return `${price} ${currency}`;
  }
}
