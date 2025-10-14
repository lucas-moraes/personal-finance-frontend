import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GlassCard } from "@developer-hub/liquid-glass";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Datepicker } from "@/components/ui/datepicker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { EllipsisVertical, ListFilter, Pencil, Trash2, X } from "lucide-react";
import { FormatNumberToCurrency } from "@/lib/utils";

const invoices = [
  {
    id: 1261,
    dia: 1,
    mes: 10,
    ano: 2025,
    tipo: "entrada",
    categoria: 38,
    descricao: "",
    valor: "6000",
  },
  {
    id: 1263,
    dia: 1,
    mes: 10,
    ano: 2025,
    tipo: "entrada",
    categoria: 38,
    descricao: "",
    valor: "3000",
  },
  {
    id: 1277,
    dia: 2,
    mes: 10,
    ano: 2025,
    tipo: "entrada",
    categoria: 38,
    descricao: "",
    valor: "2726.18",
  },
  {
    id: 1265,
    dia: 1,
    mes: 10,
    ano: 2025,
    tipo: "entrada",
    categoria: 38,
    descricao: "",
    valor: "235",
  },
  {
    id: 1266,
    dia: 1,
    mes: 10,
    ano: 2025,
    tipo: "saida",
    categoria: 109,
    descricao: "",
    valor: "-40.19",
  },
  {
    id: 1267,
    dia: 8,
    mes: 10,
    ano: 2025,
    tipo: "saida",
    categoria: 50,
    descricao: "",
    valor: "-80.9",
  },
  {
    id: 1268,
    dia: 8,
    mes: 10,
    ano: 2025,
    tipo: "saida",
    categoria: 105,
    descricao: "",
    valor: "-100",
  },
  {
    id: 1269,
    dia: 1,
    mes: 10,
    ano: 2025,
    tipo: "saida",
    categoria: 44,
    descricao: "PAGO",
    valor: "-150",
  },
  {
    id: 1270,
    dia: 1,
    mes: 10,
    ano: 2025,
    tipo: "saida",
    categoria: 110,
    descricao: "",
    valor: "-255",
  },
  {
    id: 1271,
    dia: 1,
    mes: 10,
    ano: 2025,
    tipo: "saida",
    categoria: 37,
    descricao: "",
    valor: "-276",
  },
  {
    id: 1278,
    dia: 2,
    mes: 10,
    ano: 2025,
    tipo: "saida",
    categoria: 62,
    descricao: "PAGO - Parcela 1/3",
    valor: "-286.66",
  },
  {
    id: 1272,
    dia: 1,
    mes: 10,
    ano: 2025,
    tipo: "saida",
    categoria: 102,
    descricao: "PAGO",
    valor: "-444.66",
  },
  {
    id: 1273,
    dia: 1,
    mes: 10,
    ano: 2025,
    tipo: "saida",
    categoria: 104,
    descricao: "",
    valor: "-911.11",
  },
  {
    id: 1274,
    dia: 1,
    mes: 10,
    ano: 2025,
    tipo: "saida",
    categoria: 60,
    descricao: "",
    valor: "-1013.87",
  },
  {
    id: 1275,
    dia: 1,
    mes: 10,
    ano: 2025,
    tipo: "saida",
    categoria: 103,
    descricao: "",
    valor: "-1052.64",
  },
  {
    id: 1276,
    dia: 1,
    mes: 10,
    ano: 2025,
    tipo: "saida",
    categoria: 41,
    descricao: "PAGO",
    valor: "-6211.15",
  },
  {
    total: 1138.999999999999,
  },
];

export const HomePage = () => {
  const [editItem, setEditItem] = React.useState<number | null>(null);
  const [showLineOptions, setShowLineOptions] = React.useState<number | null>(null);

  return (
    <GlassCard shadowMode={true} cornerRadius={16} blurAmount={0.01}>
      <Card className="w-[700px] pt-10 pb-10 bg-transparent text-white shadow-none border border-purple-400/10">
        <CardHeader className="flex flex-col w-full">
          <div className="flex flex-row w-full justify-between items-center p-0">
            <span className="text-2xl font-bold text-center">Invoices</span>
            <div className="flex flex-col items-center">
              <div className="flex flex-row gap-4">
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Elisa - Cartão de crédito</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Novembro</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[80px]">
                    <SelectValue placeholder="year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">2025</SelectItem>
                    <SelectItem value="dark">2024</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="text-white">
                  <ListFilter />
                </Button>
              </div>
            </div>
          </div>
          <div className="flex flex-row w-full items-center p-0 mt-4 gap-4">
            <Button variant="outline" className="text-white">
              + Categories
            </Button>
            <Button variant="outline" className="text-white">
              + Add Group
            </Button>
            <Button variant="outline" className="text-white">
              + Invoice
            </Button>
          </div>
        </CardHeader>
        <CardContent>
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
                {React.Children.toArray(
                  invoices.map((invoice) => {
                    if ("total" in invoice) return null;

                    return (
                      <>
                        <TableRow
                          className={
                            "hover:bg-violet-600/20 border-b border-white/10" +
                            (Number(invoice.valor) < 0 ? " text-pink-400" : " text-indigo-400")
                          }
                        >
                          <TableCell className="flex flex-col w-[50px] font-medium gap-2">
                            {showLineOptions !== invoice.id && (
                              <Button
                                variant="ghost"
                                className="p-0 m-0 text-white cursor-pointer hover:bg-white/10"
                                onClick={() => setShowLineOptions(invoice.id)}
                              >
                                <EllipsisVertical size={16} />
                              </Button>
                            )}
                            {showLineOptions === invoice.id && (
                              <>
                                <Button
                                  variant="ghost"
                                  className="p-0 m-0 text-white cursor-pointer"
                                  onClick={() => {
                                    setShowLineOptions(null);
                                    setEditItem(null);
                                  }}
                                >
                                  <X size={16} />
                                </Button>
                                <Button
                                  variant="outline"
                                  className="p-0 m-0 text-amber-500 cursor-pointer hover:bg-amber-500/10"
                                  onClick={() => setEditItem(invoice.id)}
                                >
                                  <Pencil size={16} />
                                </Button>
                                <Button
                                  variant="outline"
                                  className="p-0 m-0 cursor-pointer text-red-500 hover:bg-red-500/10"
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </>
                            )}
                          </TableCell>
                          <TableCell className="w-[50px] font-medium">{`${invoice.dia}/${invoice.mes}/${invoice.ano}`}</TableCell>
                          <TableCell>{invoice.categoria}</TableCell>
                          <TableCell>{invoice.tipo}</TableCell>
                          <TableCell>{invoice.descricao}</TableCell>
                          <TableCell className="text-right">{ FormatNumberToCurrency(Number(invoice.valor))}</TableCell>
                        </TableRow>
                        {editItem === invoice.id && (
                          <TableRow className="bg-violet-600/10 hover:bg-violet-600/10 border-b border-white/20 ">
                            <TableCell colSpan={6} className="p-4">
                              <div>
                                <FieldSet>
                                  <FieldLegend className="flex flex-row items-center w-full pb-4 border-b border-white/20 justify-between">
                                    Edit
                                    <Button
                                      variant="ghost"
                                      className="p-0 m-0 cursor-pointer text-white hover:text-red-500"
                                      onClick={() => setEditItem(null)}
                                    >
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
                                        <Select>
                                          <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Category" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="light">Light</SelectItem>
                                            <SelectItem value="dark">Dark</SelectItem>
                                            <SelectItem value="system">System</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </Field>
                                      <Field>
                                        <FieldLabel htmlFor="kind">Kind</FieldLabel>
                                        <Select>
                                          <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Kind" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="light">Light</SelectItem>
                                            <SelectItem value="dark">Dark</SelectItem>
                                            <SelectItem value="system">System</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </Field>
                                    </div>
                                    <div className="grid grid-cols-[1fr_3fr] gap-4">
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
                                    </div>
                                  </FieldGroup>
                                </FieldSet>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    );
                  }),
                )}
              </TableBody>
            </Table>
          </div>
          <div className="max-h-[500px]">
            <Table>
              <TableFooter>
                <TableRow
                  className={Number(invoices[invoices.length - 1].total) < 0 ? " text-pink-400" : " text-indigo-400"}
                >
                  <TableCell colSpan={5}>Total</TableCell>
                  <TableCell
                    className={
                      "text-right" +
                      (Number(invoices[invoices.length - 1].total) < 0 ? " text-pink-400" : " text-indigo-400")
                    }
                  >
                    {FormatNumberToCurrency(Number(invoices[invoices.length - 1].total))}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </CardContent>
      </Card>
    </GlassCard>
  );
};
