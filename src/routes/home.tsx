import { HomePage } from "@/pages/home";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute('/home')({ component: Home });

function Home() {
  return HomePage();
}
