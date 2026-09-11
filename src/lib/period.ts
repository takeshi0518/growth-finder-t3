export function getCurrentPeriod(date: Date = new Date()): string {
  return date.toLocaleDateString("sv-SE", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
  });
}
