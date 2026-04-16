"use client";

import { useQuery } from "@tanstack/react-query";

export interface THoliday {
  date: string;
  name: string;
}

interface RawHoliday {
  date: string;
  title: string;
  type: string;
  variableDates: Record<string, string>;
}

const FIXED_HOLIDAYS: Record<number, THoliday[]> = {
  2026: [
    { date: "2026-01-01", name: "Confraternização Universal" },
    { date: "2026-04-03", name: "Sexta-Feira Santa" },
    { date: "2026-04-21", name: "Tiradentes" },
    { date: "2026-05-01", name: "Dia do Trabalhador" },
    { date: "2026-09-07", name: "Independência" },
    { date: "2026-10-12", name: "Nossa Senhora Aparecida" },
    { date: "2026-11-02", name: "Finados" },
    { date: "2026-11-15", name: "Proclamação da República" },
    { date: "2026-12-25", name: "Natal" },
  ],
};

const fetchHolidays = async (year: number): Promise<THoliday[]> => {
  const response = await fetch(
    "https://dadosbr.github.io/feriados/nacionais.json"
  );
  if (!response.ok) {
    throw new Error("Failed to fetch holidays");
  }
  const data: RawHoliday[] = await response.json();

  const holidays: THoliday[] = [];
  const yearStr = String(year);

  for (const holiday of data) {
    if (holiday.date) {
      const [day, month] = holiday.date.split("/");
      holidays.push({
        date: `${yearStr}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`,
        name: holiday.title,
      });
    } else if (holiday.variableDates[yearStr]) {
      const dateStr = holiday.variableDates[yearStr];
      const [day, month] = dateStr.split("/");
      holidays.push({
        date: `${yearStr}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`,
        name: holiday.title,
      });
    }
  }

  const fixedHolidays = FIXED_HOLIDAYS[year] || [];
  const allHolidays = [...holidays, ...fixedHolidays];

  return allHolidays.sort((a, b) => a.date.localeCompare(b.date));
};

export const useHolidays = (year: number) => {
  return useQuery({
    queryKey: ["holidays", year],
    queryFn: () => fetchHolidays(year),
    staleTime: 1000 * 60 * 60 * 24,
  });
};