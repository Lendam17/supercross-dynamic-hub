import { DashboardLayout } from "@/components/admin/DashboardLayout";

export default function Admin() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Dashboard
        </h1>
      </div>
    </DashboardLayout>
  );
}