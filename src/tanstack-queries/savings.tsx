import { useApi } from "@/service/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpinsertSavings = () => {
  const queryClient = useQueryClient();
  const { useUpinsertSavings } = useApi();

  return useMutation({
    mutationKey: ["insert-savings"],
    mutationFn: async ({ value }: { value: number }) => {
      return await useUpinsertSavings({ value });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "movements",
      });
    },
    onError: (error) => {
      console.error("Error upserting savings:", error);
    },
  });
};

export const useClearSavings = () => {
  const queryClient = useQueryClient();
  const { useClearSavings } = useApi();

  return useMutation({
    mutationKey: ["clear-savings"],
    mutationFn: async () => {
      return await useClearSavings();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "movements",
      });
    },
    onError: (error) => {
      console.error("Error clearing savings:", error);
    },
  });
};
