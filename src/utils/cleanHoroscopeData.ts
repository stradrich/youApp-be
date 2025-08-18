import { WesternHoroscope, ChineseZodiac } from "../types/astro";

/**
 * Normalize Western zodiac data.
 */
export function normalizeWesternZodiac(data: any[]): WesternHoroscope[] {
  const result: WesternHoroscope[] = [];

  data.forEach(obj => {
    const key = Object.keys(obj)[0];
    const value = obj[key];

    const [sign, dateRange] = key.split(":").map((s: string) => s.trim());
    if (sign && dateRange) result.push({ sign, dateRange });

    if (typeof value === "string" && value.includes(":")) {
      const [nextSign, nextDateRange] = value.split(":").map((s: string) => s.trim());
      if (nextSign && nextDateRange) result.push({ sign: nextSign, dateRange: nextDateRange });
    }
  });

  return Array.from(new Map(result.map(item => [item.sign, item])).values());
}

/**
 * Normalize Chinese zodiac data.
 */
export function normalizeChineseZodiac(data: any[]): ChineseZodiac[] {
  return data.map(item => {
    const [start, end, animal] = item.sign.split(",").map((s: string) => s.trim());
    const startDate = new Date(start).toISOString();
    const endDate = new Date(end).toISOString();

    return { startDate, endDate, animal };
  });
}
