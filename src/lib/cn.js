/** Join conditional class names. Falsy values are dropped. */
export function cn(...parts) {
  return parts.filter(Boolean).join(' ')
}
