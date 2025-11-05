import { useApi } from "@/service/api";
import { useQuery } from "@tanstack/react-query";

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
