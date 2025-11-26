"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { Mail, Lock, LogIn } from "lucide-react";

import { useAuthStore } from "@/stores/authStore";
import api from "@/lib/api";

type Props = {
  onSuccess?: (token: string | null, user: any | null) => void;
  defaultRedirect?: string | null;
};

type LoginPayload = {
  email: string;
  password: string;
};

export default function AuthForm({ onSuccess, defaultRedirect }: Props) {
  const router = useRouter();

  const [form, setForm] = useState<LoginPayload>({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [rememberMe, setRememberMe] = useState(false);

  // Zustand setter
  const setAuth = useAuthStore((s) => s.setAuth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setFieldErrors((p) => ({ ...p, [e.target.name]: "" }));
  };

  const showError = (status?: number | null, serverMessage?: string) => {
    let msg = serverMessage || "Something went wrong. Please try again.";
    switch (status) {
      case 400:
        msg = "Validation failed or invalid credentials.";
        break;
      case 401:
        msg = "Missing or invalid authentication.";
        break;
      case 404:
        msg = "User not found.";
        break;
      case 500:
        msg = "Server error — please try again later.";
        break;
      default:
        if (serverMessage) msg = serverMessage;
        else msg = "Network error — check your connection.";
    }
    toast.error(msg);
    return msg;
  };

  const doLogin = async (redirectTo?: string | null) => {
    setLoading(true);
    setFieldErrors({});
    try {
      const res = await api.post(`/auth/login`, form);

      const token = res.data?.accessToken || res.data?.token || res.data?.data?.token || null;
      const user = res.data?.user ?? res.data?.data?.user ?? null;

      if (token) {
        try {
          localStorage.setItem("accessToken", token);
          if (user) localStorage.setItem("user", JSON.stringify(user));
          if (rememberMe) localStorage.setItem("rememberMe", "1");
          else localStorage.removeItem("rememberMe");
        } catch (e) {
          // ignore quota / private mode errors
        }

        try {
          setAuth(token, user);
          try {
            const st = (useAuthStore as any).getState?.();
            if (st?.markHydrated && typeof st.markHydrated === "function") {
              st.markHydrated();
            } else {
              (useAuthStore as any).setState({ isHydrated: true });
            }
          } catch (e2) {
            // ignore
          }
        } catch (e) {
          console.warn("[AuthForm] failed to set auth in store:", e);
        }
      } else {
        showError(null, "Login succeeded but server did not return a token.");
      }

      if (onSuccess) onSuccess(token, user);

      const safe = redirectTo && redirectTo.startsWith("/") && !redirectTo.startsWith("//") ? redirectTo : "/dashboard";
      router.replace(safe);
    } catch (err: any) {
      const resp = err?.response;
      const status = resp?.status ?? null;
      const data = resp?.data;

      if (data && Array.isArray(data.details)) {
        const errs: Record<string, string> = {};
        for (const d of data.details) {
          const p = d?.path?.[0];
          if (p) errs[p] = d.message || "Invalid";
        }
        setFieldErrors(errs);
      }

      const serverMsg = data?.message || data?.error || null;
      showError(status, serverMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doLogin(defaultRedirect ?? null);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-1">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="john@example.com"
            value={form.email}
            onChange={handleChange}
            required
            className="pl-10 placeholder:text-slate-500 dark:placeholder:text-slate-300"
            style={{ backgroundColor: "rgba(255,255,255,0.6)" }}
          />
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
        </div>
        {fieldErrors.email && <p className="text-sm text-red-600 mt-1">{fieldErrors.email}</p>}
      </div>

      <div className="grid gap-1">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            required
            className="pl-10 placeholder:text-slate-500 dark:placeholder:text-slate-300"
            style={{ backgroundColor: "rgba(255,255,255,0.6)" }}
          />
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
        </div>
        {fieldErrors.password && <p className="text-sm text-red-600 mt-1">{fieldErrors.password}</p>}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Checkbox id="remember" checked={rememberMe} onCheckedChange={(v: any) => setRememberMe(Boolean(v))} className="border-slate-500 dark:border-slate-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600" />
          <Label htmlFor="remember" className="text-sm">Remember me</Label>
        </div>
      </div>

      <div>
        <Button
          type="submit"
          className="w-full flex items-center justify-center gap-2 py-3 transition-transform hover:scale-[1.02]"
          disabled={loading}
          style={{ backgroundColor: "#16a34a", color: "#fff" }}
        >
          {loading ? "Signing in..." : <><LogIn size={16} /> Sign in</>}
        </Button>
      </div>
    </form>
  );
}
