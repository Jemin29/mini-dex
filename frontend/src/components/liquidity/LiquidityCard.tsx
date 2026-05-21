"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TokenSelect from "@/components/swap/TokenSelect";

export default function LiquidityCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Liquidity</CardTitle>
        <CardDescription>Add or remove liquidity with full slippage protection.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="add">
          <TabsList>
            <TabsTrigger value="add">Add</TabsTrigger>
            <TabsTrigger value="remove">Remove</TabsTrigger>
          </TabsList>

          <TabsContent value="add" className="mt-6 space-y-4">
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-[0.2em] text-muted">Token A</label>
              <div className="flex gap-3">
                <Input placeholder="0.00" />
                <TokenSelect variant="in" />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-[0.2em] text-muted">Token B</label>
              <div className="flex gap-3">
                <Input placeholder="0.00" />
                <TokenSelect variant="out" />
              </div>
            </div>
            <Button size="lg" className="w-full">Add liquidity</Button>
          </TabsContent>

          <TabsContent value="remove" className="mt-6 space-y-4">
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-[0.2em] text-muted">LP tokens</label>
              <Input placeholder="0.00" />
            </div>
            <Button variant="outline" size="lg" className="w-full">Remove liquidity</Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
