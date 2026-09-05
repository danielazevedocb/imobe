import { DashboardContent } from "@/app/(painel)/dashboard/_components/dashboard-content";
import { getDashboardSummary } from "@/app/(painel)/dashboard/_data-access/get-dashboard-summary";
import { getQuickPaymentProperties } from "@/app/(painel)/dashboard/_data-access/get-quick-payment-properties";

export default async function DashboardPage() {
  const [summary, quickPaymentProperties] = await Promise.all([
    getDashboardSummary(),
    getQuickPaymentProperties(),
  ]);

  return (
    <DashboardContent
      summary={summary}
      quickPaymentProperties={quickPaymentProperties}
    />
  );
}
