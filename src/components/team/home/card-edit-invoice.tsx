import { Button } from "@/components/ui/button";
import { Datepicker } from "@/components/ui/datepicker";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Save, X } from "lucide-react";
import { InputSelect } from "../input-select";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";
import type React from "react";

export const CardEditInvoice: React.FC<{ title: string; onClose: () => void }> = ({ title, onClose }) => {
  return (
    <FieldSet>
      <FieldLegend className="flex flex-row items-center w-full pb-4 border-b border-white/20 justify-between">
        {title}
        <Button variant="ghost" className="p-0 m-0 cursor-pointer text-white hover:text-red-500" onClick={onClose}>
          <X size={16} />
        </Button>
      </FieldLegend>
      <FieldGroup className="w-full pt-4 pb-4">
        <div className="grid grid-cols-3 gap-4">
          <Field>
            <Datepicker />
          </Field>
          <Field>
            <FieldLabel htmlFor="category">Category</FieldLabel>
            <InputSelect
              className="w-[180px]"
              placeholder="Category"
              options={[{ value: "teste", label: "teste" }]}
              onSelect={(value: string) => {
                console.log(`=>`, value);
              }}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="kind">Kind</FieldLabel>
            <InputSelect
              className="w-[180px]"
              placeholder="Kind"
              options={[{ value: "teste", label: "teste" }]}
              onSelect={(value: string) => {
                console.log(`=>`, value);
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
              <InputGroupInput className="pb-1" placeholder="0.00" />
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor="username">Description</FieldLabel>
            <Input id="username" autoComplete="off" />
          </Field>
          <Field className="flex flex-col justify-end">
            <Button className="p-0 m-0 text-white cursor-pointer self-end" variant="outline">
             <Save />
            </Button>
          </Field>
        </div>
      </FieldGroup>
    </FieldSet>
  );
};
