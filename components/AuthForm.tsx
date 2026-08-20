"use client";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const signup = mode === "signup";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (signup && password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      if (signup) {
        const response = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = (await response.json()) as { error?: string };
        if (!response.ok)
          throw new Error(data.error || "Unable to create account.");
      } else {
        const response = await fetch("/api/account-exists", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = (await response.json()) as {
          exists?: boolean;
          error?: string;
        };
        if (!response.ok)
          throw new Error(data.error || "Unable to check this account.");
        if (!data.exists) throw new Error("No account exists for this email.");
      }
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.error) throw new Error("The password is incorrect.");
      const session = (await fetch("/api/auth/session").then((response) =>
        response.json(),
      )) as { user?: { role?: string } };
      router.push(session.user?.role === "ADMIN" ? "/admin" : "/");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="authPage">
      <div className="authPanel">
        <div className="eyebrow">Shree Ganesh Pashmina</div>
        <h1 className="serif">
          {signup ? "Begin your collection." : "Welcome back."}
        </h1>
        <p className="muted">
          {signup
            ? "Create an account for a quieter way to keep in touch."
            : "Sign in to your account."}
        </p>
        <form onSubmit={submit} className="authForm">
          {signup && (
            <input
              className="field"
              placeholder="Your name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          )}
          <input
            className="field"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <input
            className="field"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={8}
            required
          />
          {signup && (
            <input
              className="field"
              type="password"
              placeholder="Confirm password"
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
              minLength={8}
              required
            />
          )}
          {error && <p className="formError">{error}</p>}
          <button className="btn dark" disabled={busy}>
            {busy ? "Please wait…" : signup ? "Create account" : "Sign in"}
          </button>
        </form>
        <p className="muted">
          {signup
            ? "Already have an account?"
            : "New to Shree Ganesh Pashmina?"}{" "}
          <Link href={signup ? "/login" : "/signup"}>
            {signup ? "Sign in" : "Create an account"}
          </Link>
        </p>
        {!signup && (
          <p className="muted" style={{ fontSize: 11 }}>
            Forgot password? This service will be available shortly.
          </p>
        )}
      </div>
    </main>
  );
}
