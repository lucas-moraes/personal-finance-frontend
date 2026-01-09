"use client";

import { Card, CardContent } from "@/components/ui/card";
import { GlassCard } from "@developer-hub/liquid-glass";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CardInvoicesList } from "./card-invoices";
import { CardCategories } from "./card-categories";
import { CardGroups } from "./card-groups";
import { useState } from "react";

export const HomePage = () => {
  const [activeTab, setActiveTab] = useState("invoices");

  return (
    <GlassCard shadowMode={true} cornerRadius={16} blurAmount={0.01}>
      <Card id="home" className="w-[800px] p-5 bg-slate-950/50 text-white shadow-none border border-purple-400/30">
        <CardContent>
          <div className="flex w-full flex-col gap-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
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
                <CardInvoicesList />
              </TabsContent>
              <TabsContent value="categories">
                <CardCategories />
              </TabsContent>
              <TabsContent value="groups">
                <CardGroups onSyncSuccess={() => setActiveTab("invoices")} />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </GlassCard>
  );
};
