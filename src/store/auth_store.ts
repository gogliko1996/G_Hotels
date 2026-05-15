import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signInWithEmailAndPassword, signOut, User } from "firebase/auth";

import { auth } from "../../firebase";

type AuthStore = {
   user: User | null;
   loading: boolean;

   checkAuth: () => Promise<void>;
   login: (email: string, password: string) => Promise<void>;
   logout: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set) => ({
   user: null,
   loading: true,

   checkAuth: async () => {
      try {
         const savedEmail = await AsyncStorage.getItem("hotelEmail");
         const savedPassword = await AsyncStorage.getItem("hotelPassword");

         if (!savedEmail || !savedPassword) {
            set({ user: null, loading: false });
            return;
         }

         const result = await signInWithEmailAndPassword(
            auth,
            savedEmail,
            savedPassword,
         );

         set({
            user: result.user,
            loading: false,
         });
      } catch (error) {
         console.log(error);

         await AsyncStorage.removeItem("hotelEmail");
         await AsyncStorage.removeItem("hotelPassword");

         set({
            user: null,
            loading: false,
         });
      }
   },

   login: async (email, password) => {
      const result = await signInWithEmailAndPassword(auth, email, password);

      await AsyncStorage.setItem("hotelEmail", email);
      await AsyncStorage.setItem("hotelPassword", password);

      set({
         user: result.user,
         loading: false,
      });
   },

   logout: async () => {
      await signOut(auth);

      await AsyncStorage.removeItem("hotelEmail");
      await AsyncStorage.removeItem("hotelPassword");

      set({
         user: null,
         loading: false,
      });
   },
}));
