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
    staleTime: Infinity,
    select: (data): Array<FormattedYear> => {
      const list = data.map((year) => ({
        value: String(year.id),
        label: String(year.ano),
      }));
      list.unshift({ value: "empty", label: "No select" });
      return list;
    },
  });
};
