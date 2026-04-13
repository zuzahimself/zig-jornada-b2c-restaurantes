import { Navigate } from 'react-router-dom'

// Cart is now rendered as a bottom sheet (CartSheet) on MenuHome.
// This route redirects to home for direct URL access.
export function Cart() {
  return <Navigate to="/" replace />
}
