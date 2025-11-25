// packages/frontend/components/NavBar.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "../lib/theme";
import { Button } from "./Button"; // adjust path if you used a different button component

export default function NavBar() {
  const [user, setUser] = useState<{ name?: string } | null>(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // Simple local-dev auth check: presence of accessToken in localStorage
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (token) {
      // optionally decode token to show user name or call /auth/me later
      setUser({ name: "You" });
    } else setUser(null);
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    // optionally redirect to login page
    window.location.href = "/";
  };

  return (
    <header className="bg-bg/60 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-semibold text-lg text-brand-700">Real Estate CRM
            {/* <a className="font-semibold text-lg text-brand-500">Real Estate CRM</a> */}
          </Link>1
          <nav className="md:flex gap-3 ml-6">
            <Link href="/inventory" className="text-sm">Inventory
                {/* <a className="text-sm">Inventory</a> */}
            </Link>
            <Link href="/customers" className="text-sm">Customers
                {/* <a className="text-sm">Customers</a> */}
            </Link>
            <Link href="/workflows" className="text-sm">Workflows
                {/* <a className="text-sm">Workflows</a> */}
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="px-3 py-1 rounded-md border text-sm"
          >
            {theme === "light" ? "Dark" : "Light"}
          </button>

          {!user ? (
            <>
                <Link href="/login">Login
                    {/* <a className="text-sm">Login</a> */}
                </Link>
                <Link href="/register">Sign up
                    {/* <a className="text-sm">Sign up</a> */}
                </Link>
            </>
          ) : (
            <>
              <span className="text-sm">Hi, {user.name}</span>
              <Button onClick={logout} className="text-sm px-3 py-1 rounded-md border">Logout</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
