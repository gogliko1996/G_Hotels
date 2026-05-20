import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { useRoomsStore } from "../../store/rooms_store";
import { AnalyticsRange, useAnalyticsStore } from "../../store/analytics_store";
import { FirebaseRoom } from "../../store/store_service_type";

import { AnalyticsHeader } from "./components/AnalyticsHeader/AnalyticsHeader";
import { RangeSelector } from "./components/RangeSelector/RangeSelector";
import { CompareCard } from "./components/CompareCard/CompareCard";
import { GuestChart } from "./components/GuestChart/GuestChart";
import { RoomsChart } from "./components/RoomsChart/RoomsChart";
import { StatsGrid } from "./components/StatsGrid/StatsGrid";
import { FutureReservations } from "./components/FutureReservations/FutureReservations";

import { styles } from "./analytics.styles";

const DAY_MS = 1000 * 60 * 60 * 24;

const getDateKey = (date = new Date()) => date.toISOString().split("T")[0];

const getYesterdayKey = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return getDateKey(date);
};

const startOfDay = (value: Date | string) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

export const getDaysUntil = (dateValue?: string) => {
  if (!dateValue) return 0;

  const now = startOfDay(new Date());
  const target = startOfDay(dateValue);

  return Math.max(0, Math.ceil((target.getTime() - now.getTime()) / DAY_MS));
};

const isOccupied = (room: FirebaseRoom) =>
  room.status === "occupied" || Boolean(room.currentStay);

const isReserved = (room: FirebaseRoom) =>
  room.status === "reserved" ||
  (Array.isArray(room.reservations) && room.reservations.length > 0);

const isFree = (room: FirebaseRoom) => !isOccupied(room) && !isReserved(room);

const getReservationItems = (rooms: FirebaseRoom[]) => {
  return rooms
    .flatMap((room) =>
      (room.reservations || []).map((reservation) => ({
        ...reservation,
        roomNumber: room.room,
        sector: room.sector,
        firebaseId: room.firebaseId,
      })),
    )
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    );
};

export const AnalyticsScreen: React.FC = () => {
  const [range, setRange] = useState<AnalyticsRange>("1m");

  const { rooms, listenFirebaseRooms, stopListenFirebaseRooms } =
    useRoomsStore();

  const { saveTodaySnapshot, getHistoryByRange } = useAnalyticsStore();

  useEffect(() => {
    listenFirebaseRooms();

    return () => {
      stopListenFirebaseRooms();
    };
  }, []);

  const allRooms = rooms || [];

  useEffect(() => {
    saveTodaySnapshot(allRooms as any);
  }, [allRooms.length]);

  const history = getHistoryByRange(range);

  const todayKey = getDateKey();
  const yesterdayKey = getYesterdayKey();

  const upcomingReservations = useMemo(
    () => getReservationItems(allRooms),
    [allRooms],
  );

  const guestsToday = allRooms.filter(
    (room) => room.currentStay?.checkInDate?.split("T")[0] === todayKey,
  ).length;

  const guestsYesterday = allRooms.filter(
    (room) => room.currentStay?.checkInDate?.split("T")[0] === yesterdayKey,
  ).length;

  const guestsDifference = guestsToday - guestsYesterday;

  const totals = useMemo(() => {
    const occupiedRooms = allRooms.filter(isOccupied);
    const reservedRooms = allRooms.filter(isReserved);
    const freeRooms = allRooms.filter(isFree);

    const leavingInOneDay = occupiedRooms.filter(
      (room) => Number((room.currentStay as any)?.remainingDays || 0) === 1,
    ).length;

    const leavingInTwoDays = occupiedRooms.filter(
      (room) => Number((room.currentStay as any)?.remainingDays || 0) === 2,
    ).length;

    const comingInOneDay = upcomingReservations.filter(
      (reservation) => getDaysUntil(reservation.startDate) === 1,
    ).length;

    const occupiedIncome = occupiedRooms.reduce(
      (sum, room) => sum + Number(room.currentStay?.totalPrice || 0),
      0,
    );

    const reservedIncome = upcomingReservations.reduce(
      (sum, reservation) => sum + Number(reservation.totalPrice || 0),
      0,
    );

    const totalIncome = occupiedIncome + reservedIncome;

    const currentOccupancyPercent =
      allRooms.length > 0
        ? Math.round((occupiedRooms.length / allRooms.length) * 100)
        : 0;

    const averageOccupancy =
      history.length > 0
        ? Math.round(
            history.reduce(
              (sum: number, item: any) =>
                sum + Number(item.occupancyPercent || 0),
              0,
            ) / history.length,
          )
        : currentOccupancyPercent;

    const averageStayDays =
      occupiedRooms.length > 0
        ? Math.round(
            occupiedRooms.reduce(
              (sum, room) => sum + Number(room.currentStay?.days || 0),
              0,
            ) / occupiedRooms.length,
          )
        : 0;

    const totalAnalyticsIncome = allRooms.reduce(
      (sum, room) => sum + Number(room.totalIncome || 0),
      0,
    );

    return {
      averageOccupancy,
      freeRooms: freeRooms.length,
      busyRooms: occupiedRooms.length,
      reservedRooms: reservedRooms.length,
      leavingInOneDay,
      leavingInTwoDays,
      comingInOneDay,
      occupiedIncome,
      reservedIncome,
      totalIncome,
      averageStayDays,
      totalAnalyticsIncome,
    };
  }, [allRooms, history, upcomingReservations]);

  const normalizedHistory = history.map((item: any) => ({
    ...item,
    busyRooms: Number(item.busyRooms ?? item.bookedRooms ?? 0),
    occupancyPercent: Number(item.occupancyPercent ?? 0),
  }));

  const todaySnapshot = {
    date: todayKey,
    busyRooms: Number(totals.busyRooms || 0),
    occupancyPercent: Number(totals.averageOccupancy || 0),
  };

  const chartData = normalizedHistory.some(
    (item) => item.date === todaySnapshot.date,
  )
    ? normalizedHistory.map((item) =>
        item.date === todaySnapshot.date ? todaySnapshot : item,
      )
    : [...normalizedHistory, todaySnapshot];

  const safeChartData = chartData.length > 0 ? chartData : [todaySnapshot];

  const today = safeChartData[safeChartData.length - 1];
  const yesterday = safeChartData[safeChartData.length - 2];

  const bookedDifference =
    today && yesterday ? today.busyRooms - yesterday.busyRooms : 0;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <AnalyticsHeader todayKey={todayKey} />

        <RangeSelector range={range} setRange={setRange} />

        <CompareCard
          todayBusyRooms={today.busyRooms}
          bookedDifference={bookedDifference}
        />

        <GuestChart
          guestsToday={guestsToday}
          guestsYesterday={guestsYesterday}
          guestsDifference={guestsDifference}
        />

        <RoomsChart chartData={safeChartData} />

        <StatsGrid
          totals={totals}
          guestsToday={guestsToday}
          guestsYesterday={guestsYesterday}
        />

        <FutureReservations reservations={upcomingReservations} />

        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.historyButton}
          onPress={() => router.push("/history-analytics")}
        >
          <Ionicons name="time-outline" size={22} color="#fff" />
          <Text style={styles.historyButtonText}>ისტორია და ფინანსები</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};
