import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FormatNumberToCurrency } from "@/lib/utils";
import { useQueryCategories } from "@/tanstack-queries/categories";
import { useCreateMovement, useQueryMovements, type TInvoice } from "@/tanstack-queries/movements";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { useToast } from "@/components/ui/toast";
import { Spinner } from "@/components/ui/spinner";

function formatDateBR(day: number, month: number, year: number): string {
  const formattedDay = String(day).padStart(2, "0");
  const formattedMonth = String(month).padStart(2, "0");
  return `${formattedDay}/${formattedMonth}/${year}`;
}

type TMovement = Omit<TInvoice["movements"][0], "id" | "descricao" | "categoriaDescricao"> & { categoria: number };

export const CardGroups = ({ onSyncSuccess }: { onSyncSuccess?: () => void }) => {
  const [movement, setMovement] = useState<TMovement[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const { data, isLoading } = useQueryMovements({
    month: "",
    year: "",
    category: "",
  });
  const categories = useQueryCategories();
  const createMovement = useCreateMovement();
  const { addToast, removeToast } = useToast();

  function DeleteItemFromList(index: number) {
    const _d = movement.filter((_, i) => i !== index);
    setMovement(_d);
  }

  async function SyncMovements() {
    if (movement.length === 0) {
      addToast({
        type: "error",
        title: "Erro ao sincronizar",
        description: "Não há movimentos para sincronizar.",
      });
      return;
    }

    setIsSyncing(true);

    // Mostra toast de loading
    const loadingToastId = addToast({
      type: "loading",
      title: "Sincronizando...",
      description: `Salvando ${movement.length} movimento(s). Aguarde...`,
    });

    try {
      let successCount = 0;
      let errorCount = 0;

      // Processa todos os movimentos sequencialmente
      for (const _m of movement) {
        try {
          await createMovement.mutateAsync({
            data: {
              dia: _m.dia,
              mes: _m.mes,
              ano: _m.ano,
              tipo: _m.tipo,
              categoria: _m.categoria,
              descricao: "",
              valor: _m.valor,
            },
          });
          successCount++;
        } catch (error) {
          errorCount++;
          console.error("Erro ao salvar movimento:", error);
        }
      }

      // Remove toast de loading
      removeToast(loadingToastId);

      // Mostra toast de sucesso ou erro
      if (errorCount === 0) {
        addToast({
          type: "success",
          title: "Sucesso!",
          description: `${successCount} movimento(s) sincronizado(s) com sucesso.`,
        });
        // Limpa a lista após sincronização bem-sucedida
        setMovement([]);
        // Retorna para a tela de invoices após sucesso
        if (onSyncSuccess) {
          setTimeout(() => {
            onSyncSuccess();
          }, 500); // Pequeno delay para o usuário ver o toast de sucesso
        }
      } else if (successCount > 0) {
        addToast({
          type: "error",
          title: "Sincronização parcial",
          description: `${successCount} movimento(s) salvos, ${errorCount} falharam.`,
        });
      } else {
        addToast({
          type: "error",
          title: "Erro ao sincronizar",
          description: "Não foi possível sincronizar os movimentos. Tente novamente.",
        });
      }
    } catch (error) {
      // Remove toast de loading
      removeToast(loadingToastId);

      // Mostra toast de erro
      addToast({
        type: "error",
        title: "Erro ao sincronizar",
        description: "Ocorreu um erro ao sincronizar os movimentos. Tente novamente.",
      });
    } finally {
      setIsSyncing(false);
    }
  }

  useEffect(() => {
    if (data?.movements && data.movements.length > 0) {
      const _d = data?.movements?.reduce((acc: Array<TMovement>, _m: TInvoice["movements"][0]) => {
        const category = categories.data?.find((_c) => _c.label === _m.categoriaDescricao)?.value;
        
        // Calcula o próximo mês, ajustando para o próximo ano se necessário
        let nextMonth = _m.mes + 1;
        let nextYear = _m.ano;
        
        if (nextMonth > 12) {
          nextMonth = 1;
          nextYear = _m.ano + 1;
        }
        
        acc.push({
          dia: 1,
          mes: nextMonth,
          ano: nextYear,
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
        <Button variant="outline" className="mb-4" onClick={SyncMovements} disabled={movement.length === 0 || isSyncing}>
          {isSyncing ? (
            <>
              <Spinner className="size-4" />
              Sincronizando...
            </>
          ) : (
            "Sync Movements"
          )}
        </Button>
        {isLoading ? (
          <TableSkeleton columns={5} rows={8} />
        ) : (
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
                    <TableCell className="w-[50px] font-medium">
                      {formatDateBR(invoice.dia, invoice.mes, invoice.ano)}
                    </TableCell>
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
        )}
      </div>
    </div>
  );
};
