// packages/frontend/pages/login.tsx
"use client";
import { useState } from "react";
import Router from "next/router";
import { Button } from "components/Button";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");

  const submit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) return setMsg(data.error || "Invalid login");
    // store tokens (dev). For prod, prefer HttpOnly cookie set by server.
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    // navigate to protected page
    Router.push("/");
  };

  return (
    <main className="p-6 max-w-md mx-auto mt-16">
      <h1 className="text-3xl font-bold mb-8 text-center text-brand-600">Login</h1>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      <Button
        type="submit"
        className="bg-brand-500 text-white font-semibold py-2 rounded hover:bg-brand-600 transition"
      >
        Login
      </Button>
    </form>
    <p className="mt-4 text-center text-red-500">{msg}</p>
  </main>
  );
}
