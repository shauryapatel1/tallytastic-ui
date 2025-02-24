
import { DashboardLayout } from "./Layout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FormCard } from "@/components/dashboard/FormCard";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getForms } from "@/lib/api";
import { CreateFormDialog } from "@/components/dashboard/CreateFormDialog";

export default function Dashboard() {
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const { data: forms, isLoading } = useQuery({
    queryKey: ["forms"],
    queryFn: getForms,
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Your Forms</h1>
            <p className="text-sm text-primary/60">
              Create and manage your forms
            </p>
          </div>
          <Button onClick={() => setIsCreateFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Form
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-48 rounded-lg bg-card animate-pulse"
              />
            ))}
          </div>
        ) : forms?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
            <div className="text-4xl">📋</div>
            <h3 className="text-xl font-semibold">No forms yet</h3>
            <p className="text-sm text-primary/60">
              Create your first form to get started
            </p>
            <Button onClick={() => setIsCreateFormOpen(true)}>
              Create Form
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms?.map((form) => (
              <FormCard key={form.id} form={form} />
            ))}
          </div>
        )}
      </div>

      <CreateFormDialog
        open={isCreateFormOpen}
        onOpenChange={setIsCreateFormOpen}
      />
    </DashboardLayout>
  );
}
