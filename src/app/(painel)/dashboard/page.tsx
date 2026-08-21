import { DashboardContent } from "@/app/(painel)/dashboard/_components/dashboard-content";
import { getDashboardSummary } from "@/app/(painel)/dashboard/_data-access/get-dashboard-summary";

export default async function DashboardPage() {
  const summary = await getDashboardSummary();
  return <DashboardContent summary={summary} />;
}
