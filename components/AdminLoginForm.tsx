"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(""); setBusy(true);
    try {
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) throw new Error("These credentials could not be verified.");
      const session = await fetch("/api/auth/session").then((response) => response.json()) as { user?: { role?: string } };
      if (session.user?.role !== "ADMIN") throw new Error("This account does not have administration access.");
      router.push("/admin"); router.refresh();
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Please try again."); }
    finally { setBusy(false); }
  }

  return <main className="adminLogin"><div className="adminLoginGrid" aria-hidden="true" /><header className="adminLoginHeader"><div className="adminBrand"><span className="adminMark">SG</span><span>Shree Ganesh</span></div><span>Secure administration</span></header><section className="adminLoginContent"><div className="adminLoginLead"><span className="adminKicker"><i /> Restricted area</span><h1>Welcome<br /> <em>back.</em></h1><p>Sign in to manage the Shree Ganesh Pashmina atelier.</p></div><form onSubmit={submit} className="adminLoginCard"><div><label htmlFor="admin-email">Email address</label><input id="admin-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></div><div><label htmlFor="admin-password">Password</label><input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required /></div>{error && <p className="formError">{error}</p>}<button disabled={busy}>{busy ? "Verifying access..." : <>Enter workspace <span>→</span></>}</button><small>Access is limited to authorised studio staff.</small></form></section><footer className="adminLoginFooter"><span>© {new Date().getFullYear()} Shree Ganesh Pashmina</span><span>Handmade in Nepal</span></footer></main>;
}
