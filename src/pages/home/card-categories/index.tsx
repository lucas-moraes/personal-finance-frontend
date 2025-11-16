import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCreateCategory, useQueryCategories } from "@/tanstack-queries/categories";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";

export const CardCategories = () => {
  const categories = useQueryCategories();
  const createCategory = useCreateCategory();
  const [dataFiltered, setDataFiltered] = useState<Array<Record<string, string>>>([]);
  const [data, setData] = useState<Array<Record<string, string>>>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  function HandleSearch(text: string) {
    const searchTerm = text.toLowerCase();
    if (categories.data!.length > 0) {
      const filtered = categories.data?.filter((category) => category?.label?.toLowerCase().includes(searchTerm)) || [];
      setDataFiltered(filtered!);
    }
  }

  useEffect(() => {
    if (searchTerm === "") return;
    HandleSearch(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    if (searchTerm.length > 0) {
      HandleSearch(searchTerm);
    }

    if (categories.data && categories.data.length > 0) {
      setData(categories.data);
    }
  }, [categories.data]);

  return (
    <div className="w-full mt-4 mb-4">
      <div className="max-h-[500px] overflow-y-auto custom-scrollbar mt-4">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="grid grid-cols-[3fr_5fr_4fr] gap-4 items-center mb-4">
                Description
                <InputGroup className="w-full">
                  <InputGroupInput
                    className="text-left"
                    placeholder="Type to search..."
                    autoComplete="off"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <InputGroupAddon align="inline-end">
                    {searchTerm.length > 0 && (
                      <InputGroupButton variant="ghost" className="cursor-pointer" onClick={() => setSearchTerm("")}>
                        <X className="text-red-400" />
                      </InputGroupButton>
                    )}
                  </InputGroupAddon>
                  <InputGroupAddon align="inline-end">
                    {searchTerm.length > 0 && dataFiltered.length === 0 && (
                      <InputGroupButton
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => createCategory.mutate({ description: searchTerm })}
                      >
                        <Plus className="text-green-400" />
                      </InputGroupButton>
                    )}
                  </InputGroupAddon>
                </InputGroup>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(searchTerm ? dataFiltered : data)?.map((category) => {
              if (category.value !== "empty")
                return (
                  <TableRow
                    key={Number(category.value)}
                    className="hover:bg-violet-600/20 border-b border-white/10 text-indigo-400"
                  >
                    <TableCell className="font-medium">{category.label}</TableCell>
                  </TableRow>
                );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
