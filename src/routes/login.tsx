import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { KeyRound, Mail, User } from "lucide-react";
import logo from "@/assets/tlgd-logo.jpg.asset.json";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/Button";
import { Field } from "@/components/Ui";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [
    { title: "Entrar — TLGD" }, { name: "description", content: "Acesse a plataforma TLGD com código de verificação por e-mail." },
    { property: "og:title", content: "Entrar — TLGD" }, { property: "og:description", content: "Acesse a plataforma TLGD com código de verificação por e-mail." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ]}),
  component: LoginPage,
});


function LoginPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => { if (cooldown <= 0) return; const t = setTimeout(() => setCooldown((c) => c - 1), 1000); return () => clearTimeout(t); }, [cooldown]);
  useEffect(() => { supabase.auth.getSession().then(({ data }) => { if (data.session) navigate({ to: "/" }); }); }, [navigate]);

  const send = async () => {
    if (!/^\S+@\S+\.\S+$/.test(phone.trim())) { setMsg("Informe um e-mail válido."); return; }
    setBusy(true); setMsg("");
    const { error } = await supabase.auth.signInWithOtp({ email: phone.trim(), options: { data: { full_name: name.trim() }, emailRedirectTo: window.location.origin } });
    setBusy(false);
    if (error) { setMsg("Não foi possível enviar o código: " + error.message); return; }
    setStep("code"); setCooldown(60); setMsg("Código enviado. Confira seu e-mail (e a caixa de spam). Você também pode clicar no link do e-mail.");
  };

  const verify = async () => {
    if (code.trim().length < 4) { setMsg("Digite o código recebido."); return; }
    setBusy(true); setMsg("");
    const { data, error } = await supabase.auth.verifyOtp({ email: phone.trim(), token: code.trim(), type: "email" });
    if (error || !data.user) { setBusy(false); setMsg("Código inválido ou expirado."); return; }
    if (name.trim()) await supabase.from("profiles").update({ full_name: name.trim() }).eq("id", data.user.id);
    setBusy(false);
    navigate({ to: "/" });
  };

  return (
    <div className="grid min-h-screen place-items-center bg-background px-4">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-7 shadow-2xl">
        <img src={logo.url} alt="TLGD" className="mx-auto h-12 w-auto object-contain" />
        <h1 className="mt-6 text-center text-2xl font-bold">Entrar na plataforma</h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">{step === "phone" ? "Enviaremos um código de verificação por e-mail." : `Digite o código enviado para ${phone}.`}</p>
        <div className="mt-6 space-y-4">
          {step === "phone" ? <>
            <Field label="Nome (opcional)" placeholder="Seu nome" value={name} onChange={setName} icon={<User size={18} className="text-primary" />} />
            <Field label="E-mail" type="email" placeholder="seu@email.com" value={phone} onChange={setPhone} icon={<Mail size={18} className="text-primary" />} />
            <Button className="w-full" disabled={busy} onClick={send}>{busy ? "Enviando..." : "Enviar código por e-mail"}</Button>
          </> : <>
            <Field label="Código de verificação" placeholder="000000" value={code} onChange={setCode} icon={<KeyRound size={18} className="text-primary" />} />
            <Button className="w-full" disabled={busy} onClick={verify}>{busy ? "Verificando..." : "Entrar"}</Button>
            <div className="flex justify-between text-sm">
              <button className="text-muted-foreground hover:text-foreground" onClick={() => { setStep("phone"); setCode(""); setMsg(""); }}>Trocar e-mail</button>
              <button className="text-primary disabled:text-muted-foreground" disabled={cooldown > 0 || busy} onClick={send}>{cooldown > 0 ? `Reenviar em ${cooldown}s` : "Reenviar código"}</button>
            </div>
          </>}
          {msg && <p role="status" className="text-center text-sm text-muted-foreground">{msg}</p>}
        </div>
      </div>
    </div>
  );
}
