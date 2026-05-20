import {
   addDoc,
   collection,
   deleteDoc,
   doc,
   onSnapshot,
   orderBy,
   query,
   serverTimestamp,
   updateDoc,
   setDoc,
} from "firebase/firestore";

import { db } from "../../firebase";

export type Expense = {
   id: string;
   title: string;
   amount: number;
   createdAt?: unknown;
   updatedAt?: unknown;
};

export const listenExpenses = (callback: (expenses: Expense[]) => void) => {
   const expensesQuery = query(
      collection(db, "expenses"),
      orderBy("createdAt", "desc"),
   );

   return onSnapshot(expensesQuery, (snapshot) => {
      const expenses = snapshot.docs
         .filter((docItem) => docItem.id !== "__schema")
         .map((docItem) => ({
            id: docItem.id,
            ...docItem.data(),
         })) as Expense[];

      callback(expenses);
   });
};

export const createExpensesTableInFirebase = async () => {
   try {
      await setDoc(doc(db, "expenses", "__schema"), {
         type: "expenses-table",
         title: "",
         amount: 0,
         createdAt: serverTimestamp(),
         updatedAt: serverTimestamp(),
      });

      console.log("ხარჯების ცხრილი შეიქმნა Firebase-ში");
   } catch (error) {
      console.log(error);
      throw error;
   }
};

export const addExpense = async (title: string, amount: number) => {
   await addDoc(collection(db, "expenses"), {
      title,
      amount,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
   });
};

export const updateExpense = async (
   expenseId: string,
   title: string,
   amount: number,
) => {
   await updateDoc(doc(db, "expenses", expenseId), {
      title,
      amount,
      updatedAt: serverTimestamp(),
   });
};

export const deleteExpense = async (expenseId: string) => {
   await deleteDoc(doc(db, "expenses", expenseId));
};
