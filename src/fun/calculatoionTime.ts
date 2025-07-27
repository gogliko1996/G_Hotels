export const getRemainingDays = (targetDateString: string): number => {
   const now = new Date();
   const targetDate = new Date(targetDateString);

   const dateOnly = (d: Date) =>
      new Date(d.getFullYear(), d.getMonth(), d.getDate());

   const nowDateOnly = dateOnly(now);
   const targetDateOnly = dateOnly(targetDate);

   const diffInMs = targetDateOnly.getTime() - nowDateOnly.getTime();
   const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

   return diffInDays;
};

export const getDateDifferenceInDays = (
   startDateString: string,
   endDateString: string,
): number => {
   const startDate = new Date(startDateString);
   const endDate = new Date(endDateString);

   const dateOnly = (d: Date) =>
      new Date(d.getFullYear(), d.getMonth(), d.getDate());

   const start = dateOnly(startDate);
   const end = dateOnly(endDate);

   const diffInMs = end.getTime() - start.getTime();
   const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

   return diffInDays;
};

export const formatDate = (dateString: string): string => {
   const date = new Date(dateString);

   const year = date.getFullYear();
   const month = String(date.getMonth() + 1).padStart(2, "0");
   const day = String(date.getDate()).padStart(2, "0");

   return `${day}-${month}-${year}`;
};

export const isPastOrNow = (dateStr: string): boolean => {
   const inputDate = new Date(dateStr);
   const now = new Date();

   const dateOnly = (d: Date) =>
      new Date(d.getFullYear(), d.getMonth(), d.getDate());

   return dateOnly(inputDate).getTime() <= dateOnly(now).getTime();
};
