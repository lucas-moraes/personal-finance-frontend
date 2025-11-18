import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FormatNumberToCurrency } from "@/lib/utils";
import { useQueryCategories } from "@/tanstack-queries/categories";
import { useCreateMovement, useQueryMovements, type TInvoice } from "@/tanstack-queries/movements";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

type TMovement = Omit<TInvoice["movements"][0], "id" | "descricao" | "categoriaDescricao"> & { categoria: number };

export const CardGroups = () => {
  const [movement, setMovement] = useState<TMovement[]>([]);
  const { data } = useQueryMovements({
    month: "",
    year: "",
    category: "",
  });
  const categories = useQueryCategories();
  const createMovement = useCreateMovement();

  function DeleteItemFromList(index: number) {
    const _d = movement.filter((_, i) => i !== index);
    setMovement(_d);
  }

  function SyncMovements() {
    for (const _m of movement || []) {
      createMovement.mutate({
        ano: _m.ano,
        categoria: _m.categoria,
        descricao: "",
        dia: _m.dia,
        mes: _m.mes,
        tipo: _m.tipo,
        valor: _m.valor,
      });
    }
  }

  useEffect(() => {
    if (data?.movements && data.movements.length > 0) {
      const _d = data?.movements?.reduce((acc: Array<TMovement>, _m: TInvoice["movements"][0]) => {
        const category = categories.data?.find((_c) => _c.label === _m.categoriaDescricao)?.value;
        acc.push({
          dia: 1,
          mes: _m.mes + 1,
          ano: _m.ano,
          tipo: _m.tipo,
          categoria: category ? Number(category) : 0,
          valor: _m.valor,
        });
        return acc;
      }, []);

      setMovement(_d || []);
    }
  }, [data?.movements, categories.data]);

  return (
    <div className="w-full mt-4 mb-4">
      <div className="max-h-[500px] overflow-y-auto custom-scrollbar mt-4">
        <Button className="mb-4" onClick={SyncMovements} disabled={movement.length === 0 || createMovement.isPending}>
          {createMovement.isPending ? "Syncing..." : "Sync Movements"}
        </Button>
        <Table>
          <TableHeader className="w-full text-white">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[50px] text-white">Date</TableHead>
              <TableHead className="text-white">Category</TableHead>
              <TableHead className="text-white">Kind</TableHead>
              <TableHead className="text-right text-white">Amount</TableHead>
              <TableHead className="w-[50px]">Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movement?.map((invoice, index) => {
              if ("total" in invoice) return null;
              return (
                <TableRow
                  key={index}
                  className={
                    "hover:bg-violet-600/20 border-b border-white/10" +
                    (Number(invoice.valor) < 0 ? " text-pink-400" : " text-indigo-400")
                  }
                >
                  <TableCell className="w-[50px] font-medium">{`${invoice.dia}/${invoice.mes}/${invoice.ano}`}</TableCell>
                  <TableCell>
                    {categories.data?.find((_c) => _c.value === String(invoice.categoria))?.label || "Uncategorized"}
                  </TableCell>
                  <TableCell className="capitalize">
                    {invoice.tipo === "entrada" ? (
                      <Badge variant="secondary" className="bg-blue-500 text-white dark:bg-blue-600">
                        {invoice.tipo}
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-pink-500 text-white dark:bg-pink-600">
                        {invoice.tipo}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">{FormatNumberToCurrency(Number(invoice.valor))}</TableCell>
                  <TableCell className="w-[50px] flex justify-center">
                    <Button
                      variant="ghost"
                      className="opacity-50 cursor-pointer"
                      onClick={() => DeleteItemFromList(index)}
                    >
                      <X size={20} className="text-red-400" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
