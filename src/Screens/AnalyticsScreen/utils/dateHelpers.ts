const DAY_MS = 1000 * 60 * 60 * 24;

export const startOfDay = (value: Date | string) => {
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
