"use client";

import React, { useEffect, useId } from "react";
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
import { useApi } from "@/service/api";

type TInvoice = {
  movements: Array<{
    ano: number;
    categoriaDescricao: string;
    descricao: string;
    dia: number;
    id: string;
    mes: number;
    tipo: string;
    valor: number;
  }>;
  total: number;
};

export const HomePage = () => {
  const { useToken, useFilterMovement } = useApi();

  const [editItem, setEditItem] = React.useState<number | null>(null);
  const [showLineOptions, setShowLineOptions] = React.useState<number | null>(null);
  const [invoices, setInvoices] = React.useState<TInvoice>({ movements: [], total: 0 });
  const id = useId();

  async function FilterMovement() {
    const day = new Date();
    const month = (day.getMonth()+1).toString();
    const year = day.getFullYear().toString();
    const resp = await useFilterMovement({ month, year });
    setInvoices(resp!);
  }

  useEffect(() => {
    useToken();
    FilterMovement();
  }, []);

  return (
    <GlassCard shadowMode={true} cornerRadius={16} blurAmount={0.01}>
      <Card className="w-[700px] p-5 bg-slate-950/50 text-white shadow-none border border-purple-400/10">
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
                      {invoices?.movements.map((invoice) => {
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
                              <TableCell className="flex flex-col w-[50px] font-medium gap-2">
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
                                    onDeleteItem={() => {}}
                                  />
                                )}
                              </TableCell>
                              <TableCell className="w-[50px] font-medium">{`${invoice.dia}/${invoice.mes}/${invoice.ano}`}</TableCell>
                              <TableCell>{invoice.categoriaDescricao}</TableCell>
                              <TableCell className="capitalize">{invoice.tipo}</TableCell>
                              <TableCell>{invoice.descricao}</TableCell>
                              <TableCell className="text-right">
                                {FormatNumberToCurrency(Number(invoice.valor))}
                              </TableCell>
                            </TableRow>
                            {editItem === Number(invoice.id) && (
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
                      })}
                    </TableBody>
                  </Table>
                </div>
                <div className="max-h-[500px]">
                  <Table>
                    <TableFooter>
                      <TableRow className={Number(invoices?.total) < 0 ? " text-pink-400" : " text-indigo-400"}>
                        <TableCell colSpan={5}>Total</TableCell>
                        <TableCell
                          className={
                            "text-right" + (Number(invoices?.total) < 0 ? " text-pink-400" : " text-indigo-400")
                          }
                        >
                          {FormatNumberToCurrency(Number(invoices?.total))}
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
