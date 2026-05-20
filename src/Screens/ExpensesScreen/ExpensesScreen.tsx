import React, { useEffect, useMemo, useState } from "react";
import {
   ActivityIndicator,
   Alert,
   Keyboard,
   Pressable,
   ScrollView,
   Text,
   TextInput,
   TouchableOpacity,
   View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

import {
   addExpense,
   deleteExpense,
   Expense,
   listenExpenses,
   updateExpense,
} from "../../services/expensesService";
import { styles } from "./expenses.styles";

export const ExpensesScreen: React.FC = () => {
   const [expenses, setExpenses] = useState<Expense[]>([]);
   const [loading, setLoading] = useState(true);
   const [saving, setSaving] = useState(false);
   const [expenseTitle, setExpenseTitle] = useState("");
   const [expenseAmount, setExpenseAmount] = useState("");
   const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

   useEffect(() => {
      const unsubscribe = listenExpenses((items) => {
         setExpenses(items);
         setLoading(false);
      });

      return () => {
         unsubscribe();
      };
   }, []);

   const totalExpenses = useMemo(
      () =>
         expenses.reduce(
            (sum, expense) => sum + Number(expense.amount || 0),
            0,
         ),
      [expenses],
   );

   const resetForm = () => {
      setExpenseTitle("");
      setExpenseAmount("");
      setEditingExpense(null);
   };

   const handleSave = async () => {
      const title = expenseTitle.trim();
      const amount = Number(expenseAmount);

      if (!title || amount <= 0) {
         Alert.alert("შეცდომა", "შეიყვანე ხარჯის დასახელება და თანხა");
         return;
      }

      try {
         setSaving(true);

         if (editingExpense) {
            await updateExpense(editingExpense.id, title, amount);
         } else {
            await addExpense(title, amount);
         }

         resetForm();
         Keyboard.dismiss();
      } catch (error) {
         console.log(error);
         Alert.alert("შეცდომა", "ხარჯის შენახვა ვერ მოხერხდა");
      } finally {
         setSaving(false);
      }
   };

   const handleEdit = (expense: Expense) => {
      setEditingExpense(expense);
      setExpenseTitle(expense.title);
      setExpenseAmount(String(expense.amount));
   };

   const handleDelete = (expense: Expense) => {
      Alert.alert("ხარჯის წაშლა", "ნამდვილად გინდა ხარჯის წაშლა?", [
         {
            text: "არა",
            style: "cancel",
         },
         {
            text: "წაშლა",
            style: "destructive",
            onPress: async () => {
               try {
                  await deleteExpense(expense.id);

                  if (editingExpense?.id === expense.id) {
                     resetForm();
                  }
               } catch (error) {
                  console.log(error);
                  Alert.alert("შეცდომა", "ხარჯის წაშლა ვერ მოხერხდა");
               }
            },
         },
      ]);
   };

   return (
      <SafeAreaView style={styles.safe}>
         <Pressable onPress={Keyboard.dismiss} style={styles.container}>
            <View style={styles.header}>
               <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => router.back()}
               >
                  <Ionicons name="chevron-back" size={26} color="#0f172a" />
               </TouchableOpacity>

               <View style={styles.headerTextBox}>
                  <Text style={styles.title}>ხარჯები</Text>
                  <Text style={styles.subtitle}>სულ: {totalExpenses} ₾</Text>
               </View>
            </View>

            <ScrollView
               showsVerticalScrollIndicator={false}
               contentContainerStyle={styles.scrollContent}
            >
               <View style={styles.form}>
                  <View style={styles.inputBox}>
                     <Ionicons name="receipt-outline" size={20} color="#64748b" />
                     <TextInput
                        style={styles.input}
                        placeholder="რისი ხარჯია"
                        placeholderTextColor="grey"
                        value={expenseTitle}
                        onChangeText={setExpenseTitle}
                     />
                  </View>

                  <View style={styles.inputBox}>
                     <MaterialCommunityIcons
                        name="cash-minus"
                        size={20}
                        color="#64748b"
                     />
                     <TextInput
                        style={styles.input}
                        placeholder="ხარჯის თანხა"
                        placeholderTextColor="grey"
                        keyboardType="numeric"
                        value={expenseAmount}
                        onChangeText={setExpenseAmount}
                     />
                  </View>

                  <TouchableOpacity
                     style={styles.saveButton}
                     onPress={handleSave}
                     disabled={saving}
                  >
                     <Ionicons name="save-outline" size={20} color="#fff" />
                     <Text style={styles.saveButtonText}>
                        {saving
                           ? "ინახება..."
                           : editingExpense
                             ? "ხარჯის განახლება"
                             : "ხარჯის შენახვა"}
                     </Text>
                  </TouchableOpacity>

                  {editingExpense && (
                     <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={resetForm}
                     >
                        <Text style={styles.cancelButtonText}>გაუქმება</Text>
                     </TouchableOpacity>
                  )}
               </View>

               {loading ? (
                  <View style={styles.loadingBox}>
                     <ActivityIndicator size="large" color="#2563eb" />
                  </View>
               ) : expenses.length === 0 ? (
                  <Text style={styles.emptyText}>ხარჯი არ არის დამატებული</Text>
               ) : (
                  <View style={styles.table}>
                     <View style={styles.tableHeader}>
                        <Text style={styles.tableHeaderTitle}>ხარჯი</Text>
                        <Text style={styles.tableHeaderAmount}>თანხა</Text>
                        <Text style={styles.tableHeaderActions}>ქმედება</Text>
                     </View>

                     {expenses.map((expense) => (
                        <View key={expense.id} style={styles.tableRow}>
                           <Text style={styles.expenseTitle}>
                              {expense.title}
                           </Text>

                           <Text style={styles.expenseAmount}>
                              {expense.amount} ₾
                           </Text>

                           <View style={styles.actionsRow}>
                              <TouchableOpacity
                                 style={styles.iconButton}
                                 onPress={() => handleEdit(expense)}
                              >
                                 <Ionicons
                                    name="create-outline"
                                    size={18}
                                    color="#fff"
                                 />
                              </TouchableOpacity>

                              <TouchableOpacity
                                 style={[
                                    styles.iconButton,
                                    styles.deleteIconButton,
                                 ]}
                                 onPress={() => handleDelete(expense)}
                              >
                                 <Ionicons
                                    name="trash-outline"
                                    size={18}
                                    color="#fff"
                                 />
                              </TouchableOpacity>
                           </View>
                        </View>
                     ))}
                  </View>
               )}
            </ScrollView>
         </Pressable>
      </SafeAreaView>
   );
};
