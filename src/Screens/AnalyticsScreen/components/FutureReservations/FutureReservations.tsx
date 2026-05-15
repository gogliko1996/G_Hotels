import { Text, View } from "react-native";
import { getDaysUntil } from "../../AnalyticsScreen";
import { styles } from "./futureReservations.styles";

type ReservationItem = {
   id: string;
   sector: "A" | "B";
   roomNumber: number;
   firebaseId: string;
   startDate: string;
   endDate: string;
   days: number;
   totalPrice: number;
};

type Props = {
   reservations: ReservationItem[];
};

export const FutureReservations = ({ reservations }: Props) => {
   return (
      <View style={styles.reservationTable}>
         <Text style={styles.cardTitle}>მომავალი ჯავშნები</Text>

         {reservations.length === 0 ? (
            <Text style={styles.emptyText}>აქტიური ჯავშნები არ არის</Text>
         ) : (
            reservations.map((reservation) => (
               <View
                  key={`${reservation.firebaseId}-${reservation.id}`}
                  style={styles.reservationRow}
               >
                  <View>
                     <Text style={styles.roomNumber}>
                        {reservation.sector}-კორპუსი / ოთახი #
                        {reservation.roomNumber}
                     </Text>

                     <Text style={styles.reservationDate}>
                        მოსვლა: {reservation.startDate?.split("T")[0] || "-"}
                     </Text>

                     <Text style={styles.reservationDate}>
                        მოსვლამდე დარჩა: {getDaysUntil(reservation.startDate)}{" "}
                        დღე
                     </Text>

                     <Text style={styles.reservationDate}>
                        გასვლა: {reservation.endDate?.split("T")[0] || "-"}
                     </Text>
                  </View>

                  <View style={styles.reservationRight}>
                     <Text style={styles.reservationDays}>
                        დარჩება: {reservation.days} დღე
                     </Text>

                     <Text style={styles.reservationPrice}>
                        {reservation.totalPrice || 0}₾
                     </Text>
                  </View>
               </View>
            ))
         )}
      </View>
   );
};
