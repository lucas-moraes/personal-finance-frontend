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
      
      // Adiciona o próximo ano se não estiver na lista
      const nextYear = new Date().getFullYear() + 1;
      const hasNextYear = list.some((item) => Number(item.label) === nextYear);
      if (!hasNextYear) {
        // Para o próximo ano, usa o próprio ano como value já que não existe no backend
        list.push({
          value: String(nextYear),
          label: String(nextYear),
        });
      }
      
      // Ordena por ano (mais recente primeiro)
      list.sort((a, b) => {
        return Number(b.label) - Number(a.label);
      });
      
      // Adiciona "No select" no início
      list.unshift({ value: "empty", label: "No select" });
      return list;
    },
  });
};
