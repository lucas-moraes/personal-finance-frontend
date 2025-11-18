import { TableRowButtonOptions } from "@/components/team/home/table-row-button-options";
import { InputSelect } from "@/components/team/input-select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FormatNumberToCurrency } from "@/lib/utils";
import { useQueryCategories } from "@/tanstack-queries/categories";
import { useQueryMonths } from "@/tanstack-queries/months";
import { useDeleteMovement, useQueryFilterMovementById, useQueryMovements } from "@/tanstack-queries/movements";
import { useQueryYears } from "@/tanstack-queries/years";
import { EllipsisVertical, X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { CardEditInvoice } from "./card-edit-invoices";

export const CardInvoicesList = () => {
  const [editItem, setEditItem] = useState<number | null>(null);
  const [showLineOptions, setShowLineOptions] = useState<number | null>(null);
  const [filterData, setFilterData] = useState<{
    category?: string;
    month?: string;
    year?: string;
    isChanged?: boolean;
  }>({});
  const id = useId();
  const categories = useQueryCategories();
  const months = useQueryMonths();
  const years = useQueryYears();
  const deleteMovement = useDeleteMovement();
  const { data } = useQueryMovements({
    month: filterData.month,
    year: filterData.year,
    category: filterData.category,
  });
  const dataToEdit = useQueryFilterMovementById({ id: editItem! });

  function InitialMovement() {
    const today = new Date();
    const safeMonth = (today.getMonth() + 1).toString();
    const safeYear = today.getFullYear().toString();
    setFilterData({ category: "", month: safeMonth, year: safeYear, isChanged: false });
  }

  function DeleteMovement({ id }: { id: string }) {
    deleteMovement.mutate({ id });
  }

  function CheckFilters({ origin, value }: { origin: "category" | "month" | "year"; value: string }) {
    switch (origin) {
      case "category":
        setFilterData((prev) => ({ ...prev, category: value === "empty" ? "" : value, isChanged: true }));
        break;
      case "month":
        setFilterData((prev) => ({ ...prev, month: value === "empty" ? "" : value, isChanged: true }));
        break;
      case "year":
        setFilterData((prev) => ({ ...prev, year: value === "empty" ? "" : value, isChanged: true }));
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    InitialMovement();
  }, []);

  return (
    <>
      <div className="flex flex-col content-center items-start mt-4 mb-4">
        <div className="flex flex-row gap-4">
          <InputSelect
            className="cursor-pointer"
            placeholder="Category"
            options={categories.data ?? [{ value: "teste", label: "teste" }]}
            value={filterData.category}
            onSelect={(value: string) => {
              CheckFilters({ origin: "category", value });
            }}
          />
          <InputSelect
            className="w-[120px] cursor-pointer"
            placeholder="Month"
            options={months.data ?? [{ value: "teste", label: "teste" }]}
            value={filterData.month}
            onSelect={(value: string) => {
              CheckFilters({ origin: "month", value });
            }}
          />
          <InputSelect
            className="w-[120px] cursor-pointer"
            placeholder="Year"
            options={years.data ?? [{ value: "teste", label: "teste" }]}
            value={filterData.year}
            onSelect={(value: string) => {
              CheckFilters({ origin: "year", value });
            }}
          />
          {filterData.isChanged && (
            <X
              className="self-center rounded-full text-red-500 cursor-pointer"
              onClick={() => {
                InitialMovement();
              }}
            />
          )}
        </div>
      </div>

      <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
        <Table>
          <TableHeader className="w-full text-white">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[50px] text-white"></TableHead>
              <TableHead className="w-[50px] text-white">Date</TableHead>
              <TableHead className="text-white">Category</TableHead>
              <TableHead className="text-white">Kind</TableHead>
              <TableHead className="text-white">Description</TableHead>
              <TableHead className="text-right text-white">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.movements.map((invoice) => {
              if ("total" in invoice) return null;

              return (
                <>
                  <TableRow
                    key={id}
                    className={
                      "hover:bg-violet-600/20 border-b border-white/10" +
                      (Number(invoice.valor) < 0 ? " text-pink-400" : " text-indigo-400")
                    }
                  >
                    <TableCell className="w-[50px] font-medium gap-2">
                      {showLineOptions !== Number(invoice.id) && (
                        <Button
                          variant="ghost"
                          className="p-0 m-0 text-white cursor-pointer hover:bg-white/10"
                          onClick={() => setShowLineOptions(Number(invoice.id))}
                        >
                          <EllipsisVertical size={16} />
                        </Button>
                      )}
                      {showLineOptions === Number(invoice.id) && (
                        <TableRowButtonOptions
                          onClose={() => {
                            setShowLineOptions(null);
                            setEditItem(null);
                          }}
                          onEditItem={() => {
                            setEditItem(Number(invoice.id));
                          }}
                          onDeleteItem={() => {
                            DeleteMovement({ id: invoice.id });
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell className="w-[50px] font-medium">{`${invoice.dia}/${invoice.mes}/${invoice.ano}`}</TableCell>
                    <TableCell>{invoice.categoriaDescricao}</TableCell>
                    <TableCell className="capitalize">{invoice.tipo}</TableCell>
                    <TableCell className="whitespace-normal">{invoice.descricao}</TableCell>
                    <TableCell className="text-right">
                      {FormatNumberToCurrency(Number(invoice.valor < 0 ? invoice.valor * -1 : invoice.valor))}
                    </TableCell>
                  </TableRow>
                  {editItem === Number(invoice.id) && Array.isArray(dataToEdit?.data) && (
                    <TableRow className="bg-violet-600/10 hover:bg-violet-600/10 border-b border-white/20 ">
                      <TableCell colSpan={6} className="p-4">
                        <CardEditInvoice
                          item={{ id: editItem.toString(), data: dataToEdit?.data! }}
                          listCategories={categories.data!}
                          onClose={() => {
                            setEditItem(null);
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  )}
                </>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <div className="max-h-[500px]">
        <Table>
          <TableFooter>
            <TableRow className={Number(data?.total) < 0 ? " text-pink-400" : " text-indigo-400"}>
              <TableCell colSpan={5}>Total</TableCell>
              <TableCell className={"text-right" + (Number(data?.total) < 0 ? " text-pink-400" : " text-indigo-400")}>
                {FormatNumberToCurrency(Number(data?.total))}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </>
  );
};
