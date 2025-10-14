import { MetricsPage } from "@/pages/metrics";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/metrics")({ component: AppMetrics });

function AppMetrics() {
  return <MetricsPage />;
}
