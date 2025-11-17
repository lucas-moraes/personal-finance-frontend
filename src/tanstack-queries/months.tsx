import { useApi } from "@/service/api";
import { useQuery } from "@tanstack/react-query";

type RawMonth = {
  id: number;
  mes: string;
};

type FormattedMonth = {
  value: string;
  label: string;
};

export const useQueryMonths = () => {
  const { useMonth } = useApi();
  return useQuery({
    queryKey: ["months"],
    queryFn: async () => {
      const resp: Array<RawMonth> = await useMonth();
      return resp;
    },
    staleTime: Infinity,
    select: (data): Array<FormattedMonth> => {
      const list = data.map((month) => ({
        value: String(month.id),
        label: month.mes,
      }));
      list.unshift({ value: "empty", label: "No select" });
      return list;
    },
  });
};
