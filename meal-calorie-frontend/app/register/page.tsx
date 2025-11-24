"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Mail, Lock, Check } from "lucide-react";


const REGISTER_URL =
  `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`;

type RegisterForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState<RegisterForm>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setFieldErrors((p) => ({ ...p, [e.target.name]: "" }));
  };

  const showErrorToast = (status?: number | null, serverMsg?: string) => {
    let message = serverMsg || "Something went wrong. Please try again.";
    switch (status) {
      case 400:
        message = "Email already in use.";
        break;
      case 401:
        message = "Unauthorized — please try again.";
        break;
      case 404:
        message = "Server error — try again later.";
        break;
      case 500:
        message = "Server error — try again later.";
        break;
      default:
        if (serverMsg) message = serverMsg;
        else message = "Network error — check your connection.";
    }
    toast.error(message);
    return message;
  };

  const parseServerDetails = (details: any[]) => {
    const errs: Record<string, string> = {};
    for (const d of details) {
      const p = d?.path?.[0];
      if (!p) continue;
      errs[p] = d.message || "Invalid";
    }
    return errs;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});

    try {
      // send camelCase keys
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      };

      const res = await axios.post(REGISTER_URL, payload, {
        headers: { Accept: "application/json" },
        timeout: 15000,
      });

      setTimeout(() => router.push("/login"), 900);
    } catch (err: any) {
      const resp = err?.response;
      const status = resp?.status ?? null;
      const serverMsg = resp?.data?.message || resp?.data?.error || null;

      // if server sent details array, map to field errors
      if (resp?.data && Array.isArray(resp.data.details)) {
        const errs = parseServerDetails(resp.data.details);
        setFieldErrors(errs);
        const toastMsg = showErrorToast(status, serverMsg);
      } else {
        const toastMsg = showErrorToast(status, serverMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" richColors closeButton />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e6fff2] via-[#f6fff9] to-[#ffffff] dark:from-[#071018] dark:via-[#0a1b24] dark:to-[#071018] p-6">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left: Nutrition branding (hidden on small screens) */}
          <aside className="hidden md:flex md:col-span-7 flex-col gap-6 p-10 rounded-2xl backdrop-blur-md bg-white/40 dark:bg-slate-900/40 border border-white/10 shadow-lg">
            <div>
              <h2 className="text-3xl font-bold" style={{ color: "#16a34a" }}>
                NutriFinder
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Your smart companion for quick and accurate nutrition insights.
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <h3 className="text-3xl font-extrabold leading-tight text-slate-900 dark:text-slate-100">
                Create your account & start healthy tracking
              </h3>

              <p className="text-sm text-slate-600 dark:text-slate-400">
                Easily search dishes, track servings, and know the calories —
                simple and quick.
              </p>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="p-4 rounded-lg bg-white/60 dark:bg-white/5 border">
                  <div className="text-xs text-slate-500">Easy lookups</div>
                  <div className="font-semibold mt-1">Search dishes fast</div>
                </div>

                <div className="p-4 rounded-lg bg-white/60 dark:bg-white/5 border">
                  <div className="text-xs text-slate-500">Helpful UI</div>
                  <div className="font-semibold mt-1">Clear results</div>
                </div>
              </div>
            </div>

            <div className="mt-auto text-sm text-slate-500 dark:text-slate-400">
              Fuel your day with smarter meal choices.
            </div>
          </aside>

          {/* Right: Register form */}
          <main className="col-span-1 md:col-span-5 flex items-center justify-center">
            <Card className="w-full max-w-md rounded-2xl backdrop-blur-md bg-white/60 dark:bg-slate-900/50 border border-white/10 shadow-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold">
                  Create your account
                </CardTitle>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleRegister} className="grid gap-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="firstName">First name</Label>
                      <div className="relative">
                        <Input
                          id="firstName"
                          name="firstName"
                          placeholder="John"
                          value={form.firstName}
                          onChange={handleChange}
                          required
                          className="pl-10"
                          style={{ backgroundColor: "rgba(255,255,255,0.6)" }}
                        />
                        <User
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                          size={16}
                        />
                      </div>
                      {fieldErrors.firstName && (
                        <p className="text-sm text-red-600 mt-1">
                          {fieldErrors.firstName}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="lastName">Last name</Label>
                      <div className="relative">
                        <Input
                          id="lastName"
                          name="lastName"
                          placeholder="Doe"
                          value={form.lastName}
                          onChange={handleChange}
                          required
                          className="pl-10"
                          style={{ backgroundColor: "rgba(255,255,255,0.6)" }}
                        />
                        <User
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                          size={16}
                        />
                      </div>
                      {fieldErrors.lastName && (
                        <p className="text-sm text-red-600 mt-1">
                          {fieldErrors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="pl-10"
                        style={{ backgroundColor: "rgba(255,255,255,0.6)" }}
                      />
                      <Mail
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                        size={16}
                      />
                    </div>
                    {fieldErrors.email && (
                      <p className="text-sm text-red-600 mt-1">
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-2">
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
                        className="pl-10"
                        style={{ backgroundColor: "rgba(255,255,255,0.6)" }}
                      />
                      <Lock
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                        size={16}
                      />
                    </div>
                    {fieldErrors.password && (
                      <p className="text-sm text-red-600 mt-1">
                        {fieldErrors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <Button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 py-3 transition-transform hover:scale-[1.02]"
                      disabled={loading}
                      style={{ backgroundColor: "#16a34a", color: "#fff" }}
                    >
                      {loading ? (
                        "Registering..."
                      ) : (
                        <>
                          <Check size={16} /> Create account
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>

              <CardFooter className="flex justify-center items-center text-xs text-slate-500">
                <div>
                  Already have an account?{" "}
                  <a href="/login" className="underline">
                    Sign in
                  </a>
                </div>
              </CardFooter>
            </Card>
          </main>
        </div>
      </div>
    </>
  );
}
