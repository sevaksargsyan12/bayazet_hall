export function formatAmd(amount: number): string {
  return `${new Intl.NumberFormat("hy-AM").format(amount)} ֏`;
}
