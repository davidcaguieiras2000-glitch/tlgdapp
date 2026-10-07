import { createFileRoute, redirect } from "@tanstack/react-router";

// Login was removed; keep old links working by sending visitors to the dashboard.
export const Route = createFileRoute("/login")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});
