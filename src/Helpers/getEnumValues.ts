export function getEnumEntries(v: { [key: string]: any }) {
  return Object.entries(v).filter(e => typeof e[1] !== "number")
}