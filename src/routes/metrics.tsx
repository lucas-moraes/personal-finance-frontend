import { MetricsPage } from "@/pages/metrics";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/metrics")({ component: Metrics });

function Metrics() {
  return <MetricsPage />;
}
