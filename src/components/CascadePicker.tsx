import { useState, type ReactNode } from "react";
import { ChevronLeft, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Groups } from "@/lib/vehicle-data";

/**
 * Click → list of groups (manufacturer, state…) → pick one → list of items.
 * With freeText, the panel also offers a field where any address can be typed
 * (same option as the free address field), so the user never has to choose a state.
 */
export function CascadePicker({ label, groups, value, onChange, icon, groupLabel = "Fabricante", join = (g, i) => `${g} ${i}`, placeholder, freeText }: {
  label: string; groups: Groups; value: string; onChange: (v: string) => void; icon?: ReactNode; groupLabel?: string; join?: (group: string, item: string) => string; placeholder?: string; freeText?: { placeholder: string; hint?: string };
}) {
  const [open, setOpen] = useState(false);
  const [group, setGroup] = useState<string>();
  const [q, setQ] = useState("");
  const [addr, setAddr] = useState("");
  const items = group ? (groups[group] ?? []).filter((i) => i.toLowerCase().includes(q.toLowerCase())).slice(0, 300) : Object.keys(groups);
  const useAddress = () => { const v = addr.trim(); if (!v) return; onChange(v); setOpen(false); };
  return (
    <div className="relative">
      <span className="mb-2 block text-sm text-muted-foreground">{label}</span>
      <button type="button" onClick={() => { setOpen(!open); setGroup(undefined); setQ(""); }} className="flex h-14 w-full items-center gap-3 rounded-md bg-input px-4 text-left text-muted-foreground">
        {icon}<span className={cn("min-w-0 flex-1 truncate", value && "text-foreground")}>{value || placeholder || `Escolher ${groupLabel.toLowerCase()}`}</span><ChevronDown size={18} className={cn("transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-md border border-border bg-card shadow-lg animate-in fade-in slide-in-from-top-2">
          {freeText && !group && (
            <div className="border-b border-border p-3">
              <input autoFocus value={addr} onChange={(e) => setAddr(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); useAddress(); } }} placeholder={freeText.placeholder} className="w-full rounded-md bg-secondary px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground" />
              <div className="mt-2 flex items-center justify-between gap-3">
                <small className="text-xs text-muted-foreground">{freeText.hint ?? "Digite o endereço e pressione Enter"}</small>
                <button type="button" onClick={useAddress} disabled={!addr.trim()} className="shrink-0 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground disabled:opacity-40">Usar endereço</button>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2 border-b border-border px-3 py-2 text-xs text-muted-foreground">
            {group ? <button type="button" onClick={() => { setGroup(undefined); setQ(""); }} className="flex items-center gap-1 text-primary"><ChevronLeft size={14} />{group}</button> : <span>Selecione {groupLabel.toLowerCase()}</span>}
          </div>
          {group && (groups[group]?.length ?? 0) > 12 && <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar..." className="w-full border-b border-border bg-transparent px-3 py-2 text-sm text-foreground outline-none" />}
          <ul className="max-h-64 overflow-y-auto py-1">
            {items.map((it) => {
              const full = group ? join(group, it) : "";
              return (
                <li key={it}>
                  <button type="button" onClick={() => { if (!group) { setGroup(it); return; } onChange(full); setOpen(false); }} className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-foreground hover:bg-secondary">
                    {it}{group ? value === full && <Check size={15} className="text-primary" /> : <span className="text-xs text-muted-foreground">{groups[it]?.length}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
