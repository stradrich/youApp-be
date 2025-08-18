import { WesternHoroscope, ChineseZodiac } from "../types/astro";

/**
 * Normalize Western zodiac data.
 * Input: array of objects with keys like "♈ Aries (Ram): March 21–April 19"
 *        values can be 0 or "nextSign: nextDateRange"
 */
export function normalizeWesternZodiac(data: any[]): WesternHoroscope[] {
  const result: WesternHoroscope[] = [];

  data.forEach(obj => {
    const key = Object.keys(obj)[0];
    const value = obj[key];

    const [sign, dateRange] = key.split(":").map((s: string) => s.trim());
    if (sign && dateRange) result.push({ sign, dateRange });

    if (typeof value === "string" && value.includes("–")) {
      const [nextSign, nextDateRange] = value.split(":").map((s: string) => s.trim());
      if (nextSign && nextDateRange) result.push({ sign: nextSign, dateRange: nextDateRange });
    }
  });

  // Deduplicate by sign
  return Array.from(new Map(result.map(item => [item.sign, item])).values());
}

/**
 * Normalize Chinese zodiac data.
 * Input: array of objects with `sign: "startDate,endDate,animal"`
 */
export function normalizeChineseZodiac(data: any[]): ChineseZodiac[] {
  return data.map(item => {
    const [start, end, animal] = item.sign.split(",").map((s: string) => s.trim());
    const startDate = new Date(start).toISOString();
    const endDate = new Date(end).toISOString();
    return { startDate, endDate, animal };
  });
}

/**
 * Compute Western horoscope for a given birthday
 */
export function getWesternHorroscope(
  birthday: Date,
  cleanedWesternHoroscope: WesternHoroscope[]
): string | null {
  const month = birthday.getMonth() + 1;
  const day = birthday.getDate();

  for (const { sign, dateRange } of cleanedWesternHoroscope) {
    const [startStr, endStr] = dateRange.split('–').map(s => s.trim());

    const [startMonthStr, startDayStr] = startStr.split(' ');
    const [endMonthStr, endDayStr] = endStr.split(' ');

    const startMonth = monthNameToNumber(startMonthStr);
    const endMonth = monthNameToNumber(endMonthStr);
    const startDay = parseInt(startDayStr, 10);
    const endDay = parseInt(endDayStr, 10);

    if (!startMonth || !endMonth) continue;

    const userDayOfYear = monthDayToDayOfYear(month, day);
    const startDayOfYear = monthDayToDayOfYear(startMonth, startDay);
    const endDayOfYear = monthDayToDayOfYear(endMonth, endDay);

    if (startDayOfYear <= endDayOfYear) {
      if (userDayOfYear >= startDayOfYear && userDayOfYear <= endDayOfYear) return sign;
    } else {
      if (userDayOfYear >= startDayOfYear || userDayOfYear <= endDayOfYear) return sign;
    }
  }

  return null;
}

/**
 * Compute Chinese zodiac for a given birthday
 */
export function getChineseZodiac(
  birthday: Date,
  cleanedChineseZodiac: ChineseZodiac[]
): string | null {
  for (const { startDate, endDate, animal } of cleanedChineseZodiac) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (birthday >= start && birthday <= end) return animal;
  }
  return null;
}

// Helpers
function monthNameToNumber(name: string): number | null {
  const months: Record<string, number> = {
    Jan: 1, January: 1,
    Feb: 2, February: 2,
    Mar: 3, March: 3,
    Apr: 4, April: 4,
    May: 5,
    Jun: 6, June: 6,
    Jul: 7, July: 7,
    Aug: 8, August: 8,
    Sep: 9, September: 9,
    Oct: 10, October: 10,
    Nov: 11, November: 11,
    Dec: 12, December: 12,
  };
  return months[name] ?? null;
}

function monthDayToDayOfYear(month: number, day: number): number {
  const daysUpToMonth = [0,31,59,90,120,151,181,212,243,273,304,334]; // non-leap year
  return daysUpToMonth[month - 1] + day;
}
