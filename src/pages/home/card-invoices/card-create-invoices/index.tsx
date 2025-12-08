import { InputSelect } from "@/components/team/input-select";
import { Button } from "@/components/ui/button";
import { Datepicker } from "@/components/ui/datepicker";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { formatBRLInput, parseBRLInput } from "@/lib/utils";
import { useCreateMovement } from "@/tanstack-queries/movements";
import { Save } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/toast";
import { Spinner } from "@/components/ui/spinner";

type TData = {
  date: Date | undefined;
  category: string;
  kind: string;
  amount: string;
  description: string;
};

const initialData: TData = {
  date: new Date(),
  category: "empty",
  kind: "",
  amount: "",
  description: "",
};

export const CardCreateInvoices: React.FC<{ listCategories: Array<{ value: string; label: string }> }> = ({
  listCategories,
}) => {
  const [data, setData] = useState<TData>(initialData);
  const [isOpen, setIsOpen] = useState(false);
  const createMovement = useCreateMovement();
  const { addToast, removeToast } = useToast();

  async function handleCreateMovement({ data }: { data: TData }) {
    // Validação básica
    if (!data.date) {
      addToast({
        type: "error",
        title: "Erro ao salvar",
        description: "Por favor, selecione uma data.",
      });
      return;
    }

    if (data.category === "empty" || !data.category) {
      addToast({
        type: "error",
        title: "Erro ao salvar",
        description: "Por favor, selecione uma categoria.",
      });
      return;
    }

    if (!data.kind) {
      addToast({
        type: "error",
        title: "Erro ao salvar",
        description: "Por favor, selecione o tipo (Entrada/Saída).",
      });
      return;
    }

    if (!data.amount || parseFloat(parseBRLInput(data.amount).toString()) <= 0) {
      addToast({
        type: "error",
        title: "Erro ao salvar",
        description: "Por favor, informe um valor válido.",
      });
      return;
    }

    const dia = data.date?.getDate();
    const mes = data.date?.getMonth()! + 1;
    const ano = data.date?.getFullYear();
    const amountCleaned = parseBRLInput(data.amount);

    const formData = {
      dia: dia!,
      mes: mes!,
      ano: ano!,
      tipo: data.kind,
      categoria: Number(data.category),
      descricao: data.description,
      valor: data.kind === "saida" ? amountCleaned * -1 : amountCleaned,
    };

    // Mostra toast de loading
    const loadingToastId = addToast({
      type: "loading",
      title: "Salvando...",
      description: "Aguarde enquanto salvamos os dados.",
    });

    try {
      await createMovement.mutateAsync({ data: formData });
      
      // Remove toast de loading
      removeToast(loadingToastId);
      
      // Mostra toast de sucesso
      addToast({
        type: "success",
        title: "Sucesso!",
        description: "Invoice criado com sucesso.",
      });

      // Limpa o formulário e fecha o sheet
      setData(initialData);
      setIsOpen(false);
    } catch (error) {
      // Remove toast de loading
      removeToast(loadingToastId);
      
      // Mostra toast de erro
      addToast({
        type: "error",
        title: "Erro ao salvar",
        description: "Não foi possível salvar o invoice. Tente novamente.",
      });
    }
  }
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">Create invoice</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create invoice</SheetTitle>
          <SheetDescription>
            <FieldGroup className="w-full pt-4 pb-4">
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <Datepicker
                    selected={data.date as Date | undefined}
                    onSelect={(date: Date | undefined) => {
                      setData((prev) => ({ ...prev, date }));
                    }}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="category">Category</FieldLabel>
                  <InputSelect
                    className="w-[180px]"
                    placeholder="Category"
                    value={data.category?.toString()}
                    options={listCategories}
                    onSelect={(value: string) => {
                      setData((prev) => ({ ...prev, category: value }));
                    }}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="kind">Kind</FieldLabel>
                  <InputSelect
                    className="w-[180px]"
                    placeholder="Kind"
                    value={data?.kind as string}
                    options={[
                      { value: "entrada", label: "Entrada" },
                      { value: "saida", label: "Saída" },
                    ]}
                    onSelect={(value: string | undefined) => {
                      setData((prev) => ({ ...prev, kind: value || "" }));
                    }}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="value">Amount</FieldLabel>
                  <InputGroup>
                    <InputGroupAddon>
                      <InputGroupText>R$</InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput
                      className="pb-1"
                      placeholder="0,00"
                      value={data.amount}
                      onChange={(e) => {
                        const formatted = formatBRLInput(e.target.value);
                        setData((prev) => ({ ...prev, amount: formatted }));
                      }}
                    />
                  </InputGroup>
                </Field>
              </div>
              <div className="grid grid-cols-[11fr_1fr] gap-4">
                <Field>
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <Input
                    id="description"
                    autoComplete="off"
                    value={data.description as string}
                    onChange={(e) => setData((prev) => ({ ...prev, description: e.target.value || "" }))}
                  />
                </Field>
                <Field className="flex flex-col justify-end">
                  <Button
                    className="p-0 m-0 text-white cursor-pointer self-end"
                    variant="outline"
                    onClick={() => handleCreateMovement({ data })}
                    disabled={createMovement.isPending}
                  >
                    {createMovement.isPending ? <Spinner /> : <Save />}
                  </Button>
                </Field>
              </div>
            </FieldGroup>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
