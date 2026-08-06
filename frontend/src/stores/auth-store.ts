import { create } from "zustand";

export type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isEmailVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type AuthState = {
  accessToken: string | null;
  user: AuthUser | null;
  bootstrapped: boolean;
  setSession: (accessToken: string, user: AuthUser) => void;
  setUser: (user: AuthUser) => void;
  clearSession: () => void;
  setBootstrapped: (value: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  bootstrapped: false,
  setSession(accessToken, user) {
    set({ accessToken, user });
  },
  setUser(user) {
    set({ user });
  },
  clearSession() {
    set({ accessToken: null, user: null });
  },
  setBootstrapped(value) {
    set({ bootstrapped: value });
  },
}));
