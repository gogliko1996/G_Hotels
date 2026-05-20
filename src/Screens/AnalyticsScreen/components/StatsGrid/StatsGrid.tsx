import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./statsGrid.styles";

type Totals = {
  averageOccupancy: number;
  freeRooms: number;
  busyRooms: number;
  reservedRooms: number;
  leavingInOneDay: number;
  leavingInTwoDays: number;
  comingInOneDay: number;
  occupiedIncome: number;
  reservedIncome: number;
  totalIncome: number;
  averageStayDays: number;
  totalAnalyticsIncome: number;
};

type Props = {
  totals: Totals;
  guestsToday: number;
  guestsYesterday: number;
};

export const StatsGrid = ({ totals, guestsToday, guestsYesterday }: Props) => {
  return (
    <View style={styles.grid}>
      <StatCard
        title="საშ. დაკავებულობა"
        value={`${totals.averageOccupancy}%`}
        icon="stats-chart"
        color="#2563eb"
        bg="#eff6ff"
      />
      <StatCard
        title="თავისუფალი ოთახი"
        value={`${totals.freeRooms}`}
        icon="bed-outline"
        color="#16a34a"
        bg="#ecfdf5"
      />
      <StatCard
        title="დაკავებული ოთახი"
        value={`${totals.busyRooms}`}
        icon="bed"
        color="#ef4444"
        bg="#fff1f2"
      />
      <StatCard
        title="დაჯავშნილი ოთახი"
        value={`${totals.reservedRooms}`}
        icon="calendar"
        color="#2563eb"
        bg="#eff6ff"
      />
      <StatCard
        title="დღეს შევიდა"
        value={`${guestsToday}`}
        icon="person-add"
        color="#16a34a"
        bg="#ecfdf5"
      />
      <StatCard
        title="გუშინ შევიდა"
        value={`${guestsYesterday}`}
        icon="people"
        color="#2563eb"
        bg="#eff6ff"
      />
      <StatCard
        title="1 დღეში მოდის"
        value={`${totals.comingInOneDay}`}
        icon="log-in-outline"
        color="#0ea5e9"
        bg="#f0f9ff"
      />
      <StatCard
        title="1 დღეში თავისუფლდება"
        value={`${totals.leavingInOneDay}`}
        icon="time-outline"
        color="#f59e0b"
        bg="#fffbeb"
      />
      <StatCard
        title="2 დღეში თავისუფლდება"
        value={`${totals.leavingInTwoDays}`}
        icon="calendar-outline"
        color="#7c3aed"
        bg="#f5f3ff"
      />
      <StatCard
        title="საშ. დარჩენა"
        value={`${totals.averageStayDays} დღე`}
        icon="hourglass-outline"
        color="#9333ea"
        bg="#faf5ff"
      />

      <FullWidthCard
        icon="cash"
        value={`${totals.occupiedIncome}₾`}
        title="მიმდინარე მობინადრეების თანხა"
        color="#ef4444"
      />
      <FullWidthCard
        icon="calendar"
        value={`${totals.reservedIncome}₾`}
        title="მომავალი ჯავშნების თანხა"
        color="#2563eb"
      />
      <FullWidthCard
        icon="wallet"
        value={`${totals.totalIncome}₾`}
        title="მიმდინარე + ჯავშნები"
        color="#0f172a"
      />
    </View>
  );
};

type StatCardProps = {
  title: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bg: string;
};

const StatCard = ({ title, value, icon, color, bg }: StatCardProps) => (
  <View style={[styles.statCard, { backgroundColor: bg }]}>
    <Ionicons name={icon} size={24} color={color} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statTitle}>{title}</Text>
  </View>
);

type FullWidthCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  title: string;
  color: string;
};

const FullWidthCard = ({ icon, value, title, color }: FullWidthCardProps) => (
  <View style={styles.fullWidthCard}>
    <Ionicons name={icon} size={26} color={color} />
    <View>
      <Text style={styles.fullWidthValue}>{value}</Text>
      <Text style={styles.fullWidthTitle}>{title}</Text>
    </View>
  </View>
);
