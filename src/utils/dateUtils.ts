/**
 * Dynamic Date Calculation Utilities for Rotary Club of Makati
 * Ensures interview weeks and dates are always dynamically computed based on the server/client current date.
 */

/**
 * Calculates the Interview Week string (Monday to Sunday) based on a given date or current server date.
 * Example: If date is July 29, 2026, returns "July 27 – August 2, 2026"
 * Never hardcoded.
 */
export function calculateInterviewWeek(dateInput?: string | Date | null): string {
  let d: Date;
  if (!dateInput) {
    d = new Date();
  } else if (dateInput instanceof Date) {
    d = new Date(dateInput.getTime());
  } else {
    d = new Date(dateInput);
  }

  // Fallback to today if invalid
  if (isNaN(d.getTime())) {
    d = new Date();
  }

  // Get Monday of the given date's week
  const dayOfWeek = d.getDay(); // 0 is Sunday, 1 is Monday...
  // Difference to Monday: if Sun (0), subtract 6 days; otherwise subtract (dayOfWeek - 1)
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  
  const monday = new Date(d);
  monday.setDate(d.getDate() + diffToMonday);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const mondayMonth = monday.toLocaleDateString('en-US', { month: 'long' });
  const sundayMonth = sunday.toLocaleDateString('en-US', { month: 'long' });
  const mondayYear = monday.getFullYear();
  const sundayYear = sunday.getFullYear();

  if (mondayMonth === sundayMonth && mondayYear === sundayYear) {
    return `${mondayMonth} ${monday.getDate()} – ${sunday.getDate()}, ${sundayYear}`;
  } else if (mondayYear === sundayYear) {
    return `${mondayMonth} ${monday.getDate()} – ${sundayMonth} ${sunday.getDate()}, ${sundayYear}`;
  } else {
    return `${mondayMonth} ${monday.getDate()}, ${mondayYear} – ${sundayMonth} ${sunday.getDate()}, ${sundayYear}`;
  }
}

/**
 * Formats a YYYY-MM-DD date string into a readable format e.g. "Tuesday, August 4, 2026"
 */
export function formatReadableDate(dateString?: string): string {
  if (!dateString) return 'To Be Scheduled';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Formats a time string e.g. "14:00" to "2:00 PM"
 */
export function formatReadableTime(timeString?: string): string {
  if (!timeString) return 'TBA';
  if (timeString.includes('AM') || timeString.includes('PM')) return timeString;
  const [hours, minutes] = timeString.split(':');
  if (!hours) return timeString;
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${minutes || '00'} ${ampm}`;
}
