"use client";

import React, { useEffect, useRef } from "react";
import { useMealStore } from "@/stores/mealStore";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import ResultCardSkeleton from "./ResultCardSkeleton";

export default function ResultCard() {
  const result = useMealStore((s) => s.result);
  const loading = useMealStore((s) => s.loading);
  const error = useMealStore((s) => s.error);

  // Prevent duplicate toasts on rerenders
  const lastErrorRef = useRef<string | null>(null);

  useEffect(() => {
    if (error && error.message !== lastErrorRef.current) {
      lastErrorRef.current = error.message;
      toast.error(error.message || "Something went wrong");
    }
  }, [error]);

  if (loading && !result) {
    return <ResultCardSkeleton/>;
  }

  return (
    <div>
      {result && (
        <Card className="p-4">
          <CardContent>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-semibold" style={{ color: "#16a34a" }}>
                  {String(result.dish_name).toUpperCase()}
                </div>
                <div className="text-sm mt-1 text-slate-500">
                  Source: {result.source ?? "USDA"}
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg font-extrabold">{result.servings}</div>
                <div className="text-sm mt-1 text-slate-500">Servings</div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 border rounded" style={{ borderColor: "var(--border)" }}>
                <div className="text-sm text-slate-500">Calories / serving</div>
                <div className="text-2xl font-bold" style={{ color: "#16a34a" }}>
                  {result.calories_per_serving}
                </div>
              </div>

              <div className="p-3 border rounded" style={{ borderColor: "var(--border)" }}>
                <div className="text-sm text-slate-500">Total calories</div>
                <div className="text-2xl font-bold" style={{ color: "var(--accent)" }}>
                  {result.total_calories}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
