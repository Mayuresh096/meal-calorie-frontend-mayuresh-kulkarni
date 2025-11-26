"use client";
import React from "react";
import { Toaster } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import AuthForm from "@/components/AuthForm";

export default function LoginPageWrapper() {
  return (
    <>
      <Toaster position="top-right" richColors closeButton />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e6fff2] via-[#f6fff9] to-[#ffffff] dark:from-[#071018] dark:via-[#0a1b24] dark:to-[#071018] p-6">
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left branding */}
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
                Sign in and start your healthy journey
              </h3>

              <p className="text-sm text-slate-600 dark:text-slate-400">
                Discover calories, portion details, and meal insights in
                seconds. Eat better. Track smarter. Feel healthier every day.
              </p>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="p-4 rounded-lg bg-white/60 dark:bg-white/5 border">
                  <div className="text-xs text-slate-500">Healthy choices</div>
                  <div className="font-semibold mt-1">
                    Instant nutrition lookup
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-white/60 dark:bg-white/5 border">
                  <div className="text-xs text-slate-500">Smart servings</div>
                  <div className="font-semibold mt-1">
                    Auto-calculated calories
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto text-sm text-slate-500 dark:text-slate-400">
              Fuel your day with smarter meal choices.
            </div>
          </aside>

          {/* Right form */}
          <main className="col-span-1 md:col-span-5 flex items-center justify-center">
            <Card className="w-full max-w-md rounded-2xl backdrop-blur-md bg-white/60 dark:bg-slate-900/50 border border-white/10 shadow-xl">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold">
                    Welcome back
                  </CardTitle>
                  <div className="text-xs text-slate-500">
                    Not a member?{" "}
                    <a href="/register" className="underline">
                      Create
                    </a>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <AuthForm />
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </>
  );
}
