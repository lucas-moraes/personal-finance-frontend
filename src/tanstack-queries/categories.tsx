import { useApi } from "@/service/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type RawCategory = {
  id: string;
  descricao: string;
};

type FormattedCategory = {
  value: string;
  label: string;
};

export const useQueryCategories = () => {
  const { useCategory } = useApi();
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const resp: RawCategory[] = await useCategory();
      return resp;
    },
    staleTime: Infinity,
    select: (data): FormattedCategory[] => {
      const list = data.map((category) => ({
        value: category.id,
        label: category.descricao,
      }));
      list.unshift({ value: "empty", label: "No select" });
      return list;
    },
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const { useCreateCategory } = useApi();

  return useMutation({
    mutationKey: ["categories-create"],
    mutationFn: async ({ description }: { description: string }) => {
      return await useCreateCategory({ description });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "categories",
      });
    },
    onError: (error) => {
      console.error("Error create category:", error);
    },
  });
};
