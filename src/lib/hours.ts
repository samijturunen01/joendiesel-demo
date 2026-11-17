/** Weekday (1 = Monday … 7 = Sunday) in Finnish time, regardless of the visitor's own time zone. */
export function helsinkiWeekday(now: Date = new Date()): number {
  const short = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Helsinki', weekday: 'short' }).format(now);
  return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(short) + 1;
}
