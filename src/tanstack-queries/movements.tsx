import { useApi } from "@/service/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type TInvoice = {
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
  savings: number;
  total: number;
};

export type TMovementById = {
  ano: number;
  categoria: number;
  descricao: string;
  dia: number;
  id: string;
  mes: number;
  tipo: string;
  valor: number;
};

export const useQueryMovements = ({ month, category, year }: { month?: string; category?: string; year?: string }) => {
  const { useFilterMovement } = useApi();
  let safeMonth: string = month ? month : "",
    safeYear: string = year ? year : "",
    safeCategory: string = category ? category : "";

  if (!month && !year && !category) {
    const today = new Date();
    safeMonth = (today.getMonth() + 1).toString();
    safeYear = today.getFullYear().toString();
  }

  return useQuery<TInvoice>({
    queryKey: ["movements", safeMonth, safeYear, safeCategory],
    queryFn: async () => {
      return await useFilterMovement({ month: safeMonth!, year: safeYear!, category: safeCategory! });
    },
    staleTime: Infinity,
  });
};

export const useDeleteMovement = () => {
  const queryClient = useQueryClient();
  const { useDeleteMovement } = useApi();

  return useMutation({
    mutationKey: ["delete-movement"],
    mutationFn: async ({ id }: { id: string }) => {
      return await useDeleteMovement({ id });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "movements",
      });
    },
    onError: (error) => {
      console.error("Error deleting movement:", error);
    },
  });
};

export const useUpdateMovement = () => {
  const queryClient = useQueryClient();
  const { useUpdateMovement } = useApi();

  return useMutation({
    mutationKey: ["update-movement"],
    mutationFn: async ({ id, data }: { id: string; data: Omit<TMovementById, "id"> }) => {
      return await useUpdateMovement({ id, data });
    },
    onMutate: async (variables) => {
      const { id, data } = variables;

      await queryClient.cancelQueries({
        predicate: (query) => query.queryKey[0] === "movements",
      });

      const previousMovements = queryClient.getQueryData<any[]>(["movements"]);

      if (previousMovements) {
        queryClient.setQueryData(["movements"], previousMovements);
      }

      queryClient.setQueryData(["movement-by-id", Number(id)], (old: any) => ({
        ...old,
        ...data,
      }));

      return { previousMovements };
    },
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "movements",
      });

      await queryClient.invalidateQueries({
        queryKey: ["movement-by-id", Number(variables.id)],
      });
    },
    onError: (error, _vars, context) => {
      console.error("Error updating movement:", error);
      if (context?.previousMovements) {
        queryClient.setQueryData(["movements"], context.previousMovements);
      }
    },
  });
};

export const useQueryFilterMovementById = ({ id }: { id: number }) => {
  const { useFilterById } = useApi();

  return useQuery<TMovementById>({
    queryKey: ["movement-by-id", id],
    queryFn: async () => {
      if (!id) return null;
      return await useFilterById({ id });
    },
    enabled: !!id,
  });
};

export const useCreateMovement = () => {
  const queryClient = useQueryClient();
  const { useCreateMovement } = useApi();

  return useMutation({
    mutationKey: ["create-movement"],
    mutationFn: async ({ data }: { data: Omit<TMovementById, "id"> }) => {
      return await useCreateMovement(data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "movements",
      });
    },
    onError: (error) => {
      console.error("Error creating movement:", error);
    },
  });
};
