import { Button } from "@/components/ui/button";
import { Field,  FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";

export const CardCategories = () => {
  return (
    <div className="w-full mt-4 mb-4">
      <FieldSet>
        <div className="grid grid-cols-[6fr_1fr] gap-4">
          <Field>
            <Input id="search-categoy" autoComplete="off" />
          </Field>
          <Field className="flex flex-col justify-end">
            <Button className="p-0 m-0 text-white cursor-pointer self-end" variant="outline" onClick={() => {}}>
              <Search />
            </Button>
          </Field>
        </div>
      </FieldSet>
      <div className="max-h-[500px] overflow-y-auto custom-scrollbar mt-4">
        <Table>
          <TableHeader className="w-full text-white">
            <TableRow className="hover:bg-transparent">
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
             <TableRow className="hover:bg-violet-600/20 border-b border-white/10 text-indigo-400">
               <TableCell className="font-medium">Sample Category 1</TableCell>
             </TableRow>
             <TableRow className="hover:bg-violet-600/20 border-b border-white/10 text-indigo-400">
               <TableCell className="font-medium">Sample Category 2</TableCell>
             </TableRow>
             <TableRow className="hover:bg-violet-600/20 border-b border-white/10 text-indigo-400">
               <TableCell className="font-medium">Sample Category 3</TableCell>
             </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
