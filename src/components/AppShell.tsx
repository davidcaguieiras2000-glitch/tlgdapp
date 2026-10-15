import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { BusFront, Calculator, CarFront, Fuel, Gauge, LayoutGrid, Menu, MessageCircle, Route as RouteIcon, Signpost, X } from "lucide-react";
import logo from "@/assets/tlgd-logo-blue-v2.jpg.asset.json";
import { cn } from "@/lib/utils";

const nav = [
  ["/", "Painel", LayoutGrid], ["/rotas", "Rotas", RouteIcon], ["/combustivel", "Combustível", Fuel],
  ["/pedagios", "Pedágios", Signpost], ["/transito", "Trânsito", CarFront], ["/frota", "Frota", BusFront],
  ["/calculo", "Cálculo de Rota", Calculator],
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const name = "David Aguieiras";
  return (
    <div className={cn("min-h-screen bg-background text-foreground", pathname === "/" && "operations-shell")}>
      <header className="sticky top-0 z-40 border-b border-border bg-header/95 backdrop-blur">
        <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" aria-label="TLGD — Painel" className="flex items-center gap-3">
            <img src={logo.url} alt="TLGD" className="h-12 w-auto max-w-44 object-contain" />
          </Link>
          <button aria-label="Abrir menu" onClick={() => setOpen(true)} className="grid size-11 place-items-center rounded-md text-muted-foreground transition hover:bg-secondary hover:text-foreground">
            <Menu size={25} />
          </button>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-7 sm:px-6 sm:py-10">{children}</main>
      {open && <button aria-label="Fechar menu" className="fixed inset-0 z-40 bg-overlay" onClick={() => setOpen(false)} />}
      <aside className={cn("fixed inset-y-0 left-0 z-50 flex w-[86%] max-w-sm flex-col border-r border-border bg-header shadow-2xl transition-transform duration-300", open ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex h-20 items-center justify-between border-b border-border px-6">
          <img src={logo.url} alt="TLGD" className="h-12 w-auto max-w-44 object-contain" />
          <button aria-label="Fechar menu" onClick={() => setOpen(false)} className="grid size-10 place-items-center text-muted-foreground hover:text-foreground"><X /></button>
        </div>
        <nav className="flex-1 space-y-2 overflow-y-auto p-5">
          {nav.map(([to, label, Icon]) => (
            <Link key={to} to={to} onClick={() => setOpen(false)} className={cn("flex min-h-13 items-center gap-4 rounded-md px-4 font-semibold text-muted-foreground transition hover:bg-secondary hover:text-foreground", pathname === to && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground")}>
              <Icon size={22} /><span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="border-t border-border p-5">
          <a href="https://wa.me/5521995888049" target="_blank" rel="noreferrer" className="mb-5 flex items-center gap-4 rounded-md bg-success/12 p-4 text-success">
            <MessageCircle size={28}/><span><strong className="block text-foreground">WhatsApp</strong><small className="text-muted-foreground">Fale conosco</small></span>
          </a>
          <div className="flex items-center gap-3 px-2"><div className="grid size-11 place-items-center rounded-full bg-brand-gradient font-bold">{name.charAt(0).toUpperCase()}</div><div className="min-w-0 flex-1"><b className="block truncate">{name}</b><small className="block text-muted-foreground">Administrador</small></div></div>
        </div>
      </aside>
    </div>
  );
}
