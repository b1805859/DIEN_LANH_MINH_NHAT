const DAY_IN_MS = 24 * 60 * 60 * 1000;

export function toUtcDate(dateKey: string) {
  return new Date(`${dateKey}T00:00:00.000Z`);
}

export function addDays(dateKey: string, amount: number) {
  return new Date(toUtcDate(dateKey).getTime() + amount * DAY_IN_MS).toISOString().slice(0, 10);
}

export function inclusiveDayCount(from: string, to: string) {
  return Math.floor((toUtcDate(to).getTime() - toUtcDate(from).getTime()) / DAY_IN_MS) + 1;
}

export function dateKeyInTimeZone(date = new Date(), timeZone = 'Asia/Ho_Chi_Minh') {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}
