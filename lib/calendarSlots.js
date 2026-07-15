export const monthNames = [
  "stycze\u0144",
  "luty",
  "marzec",
  "kwiecie\u0144",
  "maj",
  "czerwiec",
  "lipiec",
  "sierpie\u0144",
  "wrzesie\u0144",
  "pa\u017adziernik",
  "listopad",
  "grudzie\u0144"
];

export const hours = [
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00"
];

export function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

export function formatHourLabel(date) {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

export function isSameCalendarDate(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function getMinSelectableDate(reference) {
  const nowLabel = formatHourLabel(reference);
  const hasHourLeftToday = hours.some((item) => item > nowLabel);
  const min = new Date(reference.getFullYear(), reference.getMonth(), reference.getDate());
  if (!hasHourLeftToday) {
    min.setDate(min.getDate() + 1);
  }
  return min;
}
