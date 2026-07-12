import { PageHeader } from "@/components/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FuelPanel } from "@/features/fuel/fuel-panel"
import { ExpensePanel } from "@/features/expenses/expense-panel"

export function FuelExpensesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Fuel & Expenses"
        description="Track fuel consumption and operational costs across the fleet."
      />

      <Tabs defaultValue="fuel" className="space-y-4">
        <TabsList>
          <TabsTrigger value="fuel">Fuel Logs</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
        </TabsList>
        <TabsContent value="fuel">
          <FuelPanel />
        </TabsContent>
        <TabsContent value="expenses">
          <ExpensePanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}
