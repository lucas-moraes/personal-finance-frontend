import { Button } from "@/components/ui/button";
import { Datepicker } from "@/components/ui/datepicker";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Save, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import type React from "react";
import { useUpdateMovement, type TMovementById } from "@/tanstack-queries/movements";
import { useEffect, useState } from "react";
import { InputSelect } from "@/components/team/input-select";
import { formatBRLInput, parseBRLInput } from "@/lib/utils";
import { InputCurrency } from "@/components/team/home/input-currency";

type TData = {
  date: Date | undefined;
  category: number;
  kind: string;
  amount: string;
  description: string;
};

export const CardEditInvoice: React.FC<{
  item: { id: string; data: TMovementById[]; isLoading: boolean };
  listCategories: Array<{ value: string; label: string }>;
  isLoadingCategories?: boolean;
  onClose: () => void;
}> = ({ item, listCategories, isLoadingCategories = false, onClose }) => {
  const [data, setData] = useState<TData>({
    date: undefined,
    category: 0,
    kind: "",
    amount: "",
    description: "",
  });
  const updateMovement = useUpdateMovement();

  async function handleUpdateMovement({ id, data }: { id: string; data: TData }) {
    const dia = data.date?.getDate();
    const mes = data.date?.getMonth()! + 1;
    const ano = data.date?.getFullYear();
    const amountCleaned = parseBRLInput(data.amount);

    const formData = {
      dia: dia!,
      mes: mes!,
      ano: ano!,
      tipo: data.kind,
      categoria: data.category,
      descricao: data.description,
      valor: data.kind === "saida" ? amountCleaned * -1 : amountCleaned,
    };

    await updateMovement.mutateAsync({
      id: id,
      data: formData,
    });
  }

  useEffect(() => {
    if (item.data.length === 0) return;
    const { dia, mes, ano } = item.data[0];
    const date = new Date(ano, mes - 1, dia);
    const absoluteValue = item.data[0].valor < 0 ? item.data[0].valor * -1 : item.data[0].valor;
    setData({
      date,
      category: item.data[0].categoria,
      kind: item.data[0].tipo,
      amount: absoluteValue.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      description: item.data[0].descricao,
    });
  }, [item]);

  useEffect(() => {
    const container = document.getElementById(`edit-invoice-${item.id}`);
    container?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, []);

  return (
    <FieldSet id={`edit-invoice-${item.id}`} className="w-full">
      <FieldLegend className="flex flex-row items-center w-full pb-4 border-b border-white/20 justify-between">
        Edit invoice
        <Button variant="ghost" className="p-0 m-0 cursor-pointer text-white hover:text-red-500" onClick={onClose}>
          <X size={16} />
        </Button>
      </FieldLegend>
      <FieldGroup className="w-full pt-4 pb-4">
        <div className="grid grid-cols-3 gap-4">
          <Field>
            <Datepicker
              selected={data.date!}
              onSelect={(date: Date | undefined) => {
                setData((prev) => ({ ...prev, date: date }));
              }}
              isLoading={item.isLoading}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="category">Category</FieldLabel>
            <InputSelect
              className="w-[180px]"
              placeholder="Category"
              value={data.category.toString()}
              options={listCategories}
              onSelect={(value: string) => {
                setData((prev) => ({ ...prev, category: Number(value) }));
              }}
              isLoading={isLoadingCategories || item.isLoading}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="kind">Kind</FieldLabel>
            <InputSelect
              className="w-[180px]"
              placeholder="Kind"
              value={data.kind}
              options={[
                { value: "entrada", label: "Entrada" },
                { value: "saida", label: "Saída" },
              ]}
              onSelect={(value: string | undefined) => {
                setData((prev) => ({ ...prev, kind: value || "" }));
              }}
              isLoading={item.isLoading}
            />
          </Field>
        </div>
        <div className="grid grid-cols-[2fr_5fr_1fr] gap-4">
          <Field>
            <FieldLabel htmlFor="value">Amount</FieldLabel>
            <InputCurrency
              currency="R$"
              placeholder="0,00"
              value={data.amount}
              isLoading={item.isLoading}
              onChange={(e) => setData((prev) => ({ ...prev, amount: formatBRLInput(e.value) }))}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <Input
              id="description"
              autoComplete="off"
              value={data.description}
              isLoading={item.isLoading}
              onChange={(e) => setData((prev) => ({ ...prev, description: e.target.value || "" }))}
            />
          </Field>
          <Field className="flex flex-col justify-end">
            <Button
              className="p-0 m-0 text-white cursor-pointer self-end"
              variant="outline"
              disabled={item.isLoading}
              onClick={() => handleUpdateMovement({ id: item.id, data })}
            >
              <Save />
            </Button>
          </Field>
        </div>
      </FieldGroup>
    </FieldSet>
  );
};
