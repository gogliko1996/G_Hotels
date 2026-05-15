import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
   apiKey: "AIzaSyC8HVgxYLLmjFMpINI_-N7V0Ykzv0IU0Eg",
   authDomain: "hotel-3bbb5.firebaseapp.com",
   projectId: "hotel-3bbb5",
   storageBucket: "hotel-3bbb5.firebasestorage.app",
   messagingSenderId: "976219969998",
   appId: "1:976219969998:web:b274a6b30f5c35e79af39f",
   measurementId: "G-40S05VX58Y",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);
