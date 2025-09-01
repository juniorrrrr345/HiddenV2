// Edge-compatible authentication helpers
// For middleware, we only check token presence
// Full verification happens in API routes

export function hasAuthToken(cookieValue: string | undefined): boolean {
  return !!cookieValue && cookieValue.length > 0;
}