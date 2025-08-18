export interface WesternHoroscope {
  sign: string;
  dateRange: string; // e.g. "Mar 21 – Apr 19"
}

export interface ChineseZodiac {
  animal: string;
  startDate: string; // ISO string
  endDate: string;   // ISO string
}
