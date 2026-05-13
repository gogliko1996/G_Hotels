import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
   return (
      <Tabs
         screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: "#2563eb",
            tabBarInactiveTintColor: "#94a3b8",
            tabBarStyle: {
               height: 70,
               paddingTop: 8,
               paddingBottom: 10,
               borderTopWidth: 0,
               backgroundColor: "#fff",
            },
            tabBarLabelStyle: {
               fontSize: 12,
               fontWeight: "800",
            },
         }}
      >
         <Tabs.Screen
            name="index"
            options={{
               title: "მთავარი",
               tabBarIcon: ({ color, size }) => (
                  <Ionicons name="home" size={size} color={color} />
               ),
            }}
         />

         <Tabs.Screen
            name="analytics"
            options={{
               title: "ანალიტიკა",
               tabBarIcon: ({ color, size }) => (
                  <Ionicons name="analytics" size={size} color={color} />
               ),
            }}
         />
      </Tabs>
   );
}
