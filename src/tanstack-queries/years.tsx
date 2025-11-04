import { useApi } from "@/service/api";
import { useQuery } from "@tanstack/react-query";

type RawYears = {
  id: number;
  ano: number;
};

type FormattedYear = {
  value: string;
  label: string;
};

export const useQueryYears = () => {
  const { useYear } = useApi();
  return useQuery({
    queryKey: ["years"],
    queryFn: async () => {
      const resp: Array<RawYears> = await useYear();
      return resp;
    },
    select: (data): Array<FormattedYear> => {
      return data.map((year) => ({
        value: String(year.id),
        label: String(year.ano),
      }));
    },
  });
};
