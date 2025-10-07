import { Card, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import React from "react";

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
  return (
    <Card className="p-10 bg-slate-900 text-white ">
      <CardHeader className="text-2xl font-bold">Recent Invoices</CardHeader>
      <Table>
        <TableHeader className="text-white">
          <TableRow>
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
                <TableRow>
                  <TableCell className="w-[50px] font-medium">{`${invoice.dia}/${invoice.mes}/${invoice.mes}`}</TableCell>
                  <TableCell>{invoice.categoria}</TableCell>
                  <TableCell>{invoice.tipo}</TableCell>
                  <TableCell>{invoice.descricao}</TableCell>
                  <TableCell className="text-right">{invoice.valor}</TableCell>
                </TableRow>
              );
            }),
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Total</TableCell>
            <TableCell className="text-right">{invoices[invoices.length - 1].total}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </Card>
  );
};
