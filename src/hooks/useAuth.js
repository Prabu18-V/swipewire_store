// Custom hook: reusable auth logic.
// Thin wrapper over AuthContext so components import one clean hook.

import { useAuthContext } from '../context/AuthContext'

export function useAuth() {
  return useAuthContext()
}
