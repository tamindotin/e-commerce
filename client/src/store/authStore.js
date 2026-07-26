import {create} from "zustand"

const useAuthStore = create((set) => ({
  user: null,
  email: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: true }),
  setEmail: (email) => set({email}),
  logout: () => set({ user: null, isAuthenticated: false }),
}))

export default useAuthStore
