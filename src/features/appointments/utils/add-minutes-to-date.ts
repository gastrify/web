/**
 * Add minutes to a date
 */
export function addMinutesToDate(date: Date, minutes: number): Date {
  const result = new Date(date);
  result.setMinutes(result.getMinutes() + minutes);
  return result;
}
