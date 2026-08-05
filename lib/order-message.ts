/**
 * Plain helper, deliberately kept out of components/order-on-instagram.tsx.
 * That file is "use client", and a Server Component (the Shop page) is not
 * allowed to call a plain function imported from a client-boundary module —
 * only render its components. Living here, both server and client callers
 * can use it freely.
 */
export function buildOrderMessage(subject: string) {
  return `Hi! I'd like to order "${subject}" — could you tell me about availability and pricing?`;
}
