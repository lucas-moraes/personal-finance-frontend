import { HomePage } from "@/pages/home";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute('/app/home')({ component: AppHome });

function AppHome() {
  return <HomePage />;
}
