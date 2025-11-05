import { useApi } from "@/service/api";
import { useQuery } from "@tanstack/react-query";

type TInvoice = {
  movements: Array<{
    ano: number;
    categoriaDescricao: string;
    descricao: string;
    dia: number;
    id: string;
    mes: number;
    tipo: string;
    valor: number;
  }>;
  total: number;
};

export const useQueryMovements = ({ month, category, year }: { month: string; category: string; year: string }) => {
  const { useFilterMovement } = useApi();
  const filterMovement = useFilterMovement;

  const query = { month, year, category };

  return useQuery<TInvoice>({
    queryKey: ["movements", month, year, category],
    queryFn: async () => {
      return await filterMovement(query);
    },
    enabled: !!year,
  });
};
