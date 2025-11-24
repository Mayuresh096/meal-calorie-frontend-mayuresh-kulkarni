"use client";

import { Card } from "@/components/ui/card";

export default function ResultCardSkeleton() {
  return (
    <Card className="p-4 animate-pulse rounded-xl bg-white/60 dark:bg-slate-900/50 border border-white/10">
      {/* Top row: title + servings */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="h-6 w-40 bg-slate-300 dark:bg-slate-700 rounded"></div>
          <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded"></div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="h-6 w-10 bg-slate-300 dark:bg-slate-700 rounded"></div>
          <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded"></div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-3 border rounded border-slate-200 dark:border-slate-800">
          <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded mb-3"></div>
          <div className="h-8 w-16 bg-slate-300 dark:bg-slate-700 rounded"></div>
        </div>

        <div className="p-3 border rounded border-slate-200 dark:border-slate-800">
          <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded mb-3"></div>
          <div className="h-8 w-20 bg-slate-300 dark:bg-slate-700 rounded"></div>
        </div>
      </div>
    </Card>
  );
}
