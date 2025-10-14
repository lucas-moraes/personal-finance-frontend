import { LoginPage } from "@/pages/login";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({ component: Index });

function Index() {
  return <LoginPage />;
}
