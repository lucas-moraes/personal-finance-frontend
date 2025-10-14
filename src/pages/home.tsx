import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GlassCard } from "@developer-hub/liquid-glass";
import { Button } from "@/components/ui/button";
import { EllipsisVertical, ListFilter } from "lucide-react";
import { FormatNumberToCurrency } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InputSelect } from "@/components/team/input-select";
import { TableRowButtonOptions } from "@/components/team/home/table-row-button-options";
import { CardEditInvoice } from "@/components/team/home/card-edit-invoice";

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
        <CardContent>
          <div className="flex w-full flex-col gap-6">
            <Tabs defaultValue="invoices">
              <TabsList className="bg-transparent">
                <TabsTrigger value="invoices" className="cursor-pointer">
                  Invoices
                </TabsTrigger>
                <TabsTrigger value="categories" className="cursor-pointer">
                  Categories
                </TabsTrigger>
                <TabsTrigger value="groups" className="cursor-pointer">
                  Groups
                </TabsTrigger>
              </TabsList>
              <TabsContent value="invoices">
                <div className="flex flex-col items-start mt-4 mb-4">
                  <div className="flex flex-row gap-4">
                    <InputSelect
                      placeholder="Category"
                      options={[{ value: "teste", label: "teste" }]}
                      onSelect={(value: string) => {
                        console.log(`=>`, value);
                      }}
                    />
                    <InputSelect
                      className="w-[120px]"
                      placeholder="Month"
                      options={[{ value: "teste", label: "teste" }]}
                      onSelect={(value: string) => {
                        console.log(`=>`, value);
                      }}
                    />
                    <InputSelect
                      className="w-[80px]"
                      placeholder="Year"
                      options={[{ value: "teste", label: "teste" }]}
                      onSelect={(value: string) => {
                        console.log(`=>`, value);
                      }}
                    />
                    <Button variant="outline" className="text-white">
                      <ListFilter />
                    </Button>
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
                                    <TableRowButtonOptions
                                      onClose={() => {
                                        setShowLineOptions(null);
                                        setEditItem(null);
                                      }}
                                      onEditItem={() => {
                                        setEditItem(invoice.id);
                                      }}
                                      onDeleteItem={() => {}}
                                    />
                                  )}
                                </TableCell>
                                <TableCell className="w-[50px] font-medium">{`${invoice.dia}/${invoice.mes}/${invoice.ano}`}</TableCell>
                                <TableCell>{invoice.categoria}</TableCell>
                                <TableCell>{invoice.tipo}</TableCell>
                                <TableCell>{invoice.descricao}</TableCell>
                                <TableCell className="text-right">
                                  {FormatNumberToCurrency(Number(invoice.valor))}
                                </TableCell>
                              </TableRow>
                              {editItem === invoice.id && (
                                <TableRow className="bg-violet-600/10 hover:bg-violet-600/10 border-b border-white/20 ">
                                  <TableCell colSpan={6} className="p-4">
                                    <CardEditInvoice
                                      title="Edit Invoice"
                                      onClose={() => {
                                        setEditItem(null);
                                      }}
                                    />
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
                        className={
                          Number(invoices[invoices.length - 1].total) < 0 ? " text-pink-400" : " text-indigo-400"
                        }
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
              </TabsContent>
              <TabsContent value="categories">
                <Card className="bg-transparent">
                  <CardHeader>
                    <CardTitle>Categories</CardTitle>
                    <CardDescription>
                      Change your password here. After saving, you&apos;ll be logged out.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-6"></CardContent>
                  <CardFooter>
                    <Button>Save password</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="groups">
                <Card className="bg-transparent">
                  <CardHeader>
                    <CardTitle>Categories</CardTitle>
                    <CardDescription>
                      Change your password here. After saving, you&apos;ll be logged out.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-6"></CardContent>
                  <CardFooter>
                    <Button>Save password</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </GlassCard>
  );
};
