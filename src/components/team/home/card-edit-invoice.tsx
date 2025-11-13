import { Button } from "@/components/ui/button";
import { Datepicker } from "@/components/ui/datepicker";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Save, X } from "lucide-react";
import { InputSelect } from "../input-select";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";
import type React from "react";
import { useUpdateMovement, type TMovementById } from "@/tanstack-queries/movements";
import { useEffect, useState } from "react";

type TData = {
  date: Date | undefined;
  category: number;
  kind: string;
  amount: number;
  description: string;
};

export const CardEditInvoice: React.FC<{
  item: { id: string; data: TMovementById[] };
  listCategories: Array<{ value: string; label: string }>;
  onClose: () => void;
}> = ({ item, listCategories, onClose }) => {
  const [data, setData] = useState<TData>({
    date: undefined,
    category: 0,
    kind: "",
    amount: 0,
    description: "",
  });
  const updateMovement = useUpdateMovement();

  async function handleUpdateMovement({ id, data }: { id: string; data: TData }) {
    const dia = data.date?.getDate();
    const mes = data.date?.getMonth()! + 1;
    const ano = data.date?.getFullYear();

    const formData = {
      dia: dia!,
      mes: mes!,
      ano: ano!,
      tipo: data.kind,
      categoria: data.category,
      descricao: data.description,
      valor: data.amount,
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
    setData({
      date,
      category: item.data[0].categoria,
      kind: item.data[0].tipo,
      amount: item.data[0].valor,
      description: item.data[0].descricao,
    });
  }, [item]);

  return (
    <FieldSet>
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
            />
          </Field>
        </div>
        <div className="grid grid-cols-[2fr_5fr_1fr] gap-4">
          <Field>
            <FieldLabel htmlFor="value">Amount</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>R$</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                className="pb-1"
                placeholder="0.00"
                value={data.amount}
                onChange={(e) => setData((prev) => ({ ...prev, amount: Number(e.target.value) || 0 }))}
              />
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <Input
              id="description"
              autoComplete="off"
              value={data.description}
              onChange={(e) => setData((prev) => ({ ...prev, description: e.target.value || "" }))}
            />
          </Field>
          <Field className="flex flex-col justify-end">
            <Button
              className="p-0 m-0 text-white cursor-pointer self-end"
              variant="outline"
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
