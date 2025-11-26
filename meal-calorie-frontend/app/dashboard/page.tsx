"use client";

import React, { Suspense } from "react";
import { Toaster } from "sonner";
import Header from "@/components/Header";
import MealForm from "@/components/MealForm";
import ResultCard from "@/components/ResultCard";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import useAuthGuard from "../hooks/useAuthGuard";

function DashboardContent() {
  useAuthGuard('/login');

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-[#e6fff2] via-[#f6fff9] to-[#ffffff] dark:from-[#071018] dark:via-[#0a1b24] dark:to-[#071018]">
      <Toaster position="top-right" richColors closeButton />

      <div className="max-w-5xl mx-auto">
        <Header />

        <Card className="mt-6 rounded-2xl shadow-lg">
          <CardHeader className="flex flex-col gap-2">
            <div>
              <div className="text-base text-slate-800 dark:text-slate-100">
                <strong>Welcome</strong> — discover calories quickly
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Healthy choices made simple — search a dish and get instant
                nutrition numbers.
              </div>
            </div>

            <CardTitle className="text-lg mt-2">Search Meal Calories</CardTitle>
          </CardHeader>

          <CardContent className="grid gap-6">
            <div className="w-full">
              <MealForm />
            </div>

            <div className="w-full">
              <ResultCard />
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Product:{" "}
              <strong style={{ color: "var(--primary)" }}>NutriFinder</strong>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense>
      <DashboardContent />
    </Suspense>
  );
}
