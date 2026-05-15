import { create } from "zustand";
import {
   onAuthStateChanged,
   signInWithEmailAndPassword,
   signOut,
   User,
} from "firebase/auth";
import { auth } from "../../firebase";

type AuthStore = {
   user: User | null;
   loading: boolean;
   listenAuth: () => () => void;
   login: (email: string, password: string) => Promise<void>;
   logout: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set) => ({
   user: null,
   loading: true,

   listenAuth: () => {
      return onAuthStateChanged(auth, (user) => {
         set({
            user,
            loading: false,
         });
      });
   },

   login: async (email, password) => {
      await signInWithEmailAndPassword(auth, email, password);
   },

   logout: async () => {
      await signOut(auth);
      set({ user: null });
   },
}));
