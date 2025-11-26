"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useMealStore } from "@/stores/mealStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import api from "@/lib/api";

const SAMPLE_DISHES = [
  "Paneer Butter Masala",
  "Grilled Chicken",
  "Masala Dosa",
  "Veg Biryani",
  "Caesar Salad",
  "Oatmeal",
  "Chocolate Milkshake",
  "Avocado Toast",
];

export default function MealForm() {
  const [dish, setDish] = useState<string>("");
  const [servingsStr, setServingsStr] = useState<string>("1");
  const [suggestIndex, setSuggestIndex] = useState<number>(0);

  const setResult = useMealStore((s) => s.setResult);
  const setLoading = useMealStore((s) => s.setLoading);
  const clearStore = useMealStore((s) => s.clear);

  useEffect(() => {
    const id = setInterval(() => setSuggestIndex((i) => (i + 1) % SAMPLE_DISHES.length), 2500);
    return () => clearInterval(id);
  }, []);

  const clear = () => {
    setDish("");
    setServingsStr("");
    clearStore();
  };

  const showMappedErrorToast = (status: number | null, serverMsg?: string) => {
    let message = serverMsg || "Something went wrong. Please try again.";
    switch (status) {
      case 400:
        message = "Validation failed or invalid dish name";
        break;
      case 401:
        message = "Missing or invalid JWT";
        break;
      case 404:
        message = "Dish not found or no nutrition data available";
        break;
      case 500:
        message = "Unexpected error or missing calories data";
        break;
      default:
        if (serverMsg) message = serverMsg;
        else message = "Network error or no server response";
    }
    toast.error(message);
    return message;
  };

  const onSearch = async () => {
    setResult(null);

    if (!dish.trim()) {
      const msg = "Please enter a dish name.";
      toast.error(msg);
      return;
    }

    const servings = servingsStr === "" ? NaN : Number(servingsStr);
    if (Number.isNaN(servings) || servings < 0.1 || servings > 1000) {
      const msg = "Servings must be a positive number between 0.1 and 1000.";
      toast.error(msg);
      return;
    }

    setLoading(true);

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      const res = await api.post(
        '/get-calories',
        { dish_name: dish.trim(), servings }
      );

      const body = res?.data ?? {};

      if (typeof body === "object" && ((body.message && /not found/i.test(body.message)) || (body.error && /not found/i.test(body.error)))) {
        const msg = body.message || body.error || "Dish not found";
        showMappedErrorToast(404, msg);
        setResult(null);
        return;
      }

      const normalized = {
        dish_name: (body.dish_name ?? dish).toString(),
        source: body.source ?? "USDA",
        servings: Number(body.servings ?? servings),
        calories_per_serving: Number(body.calories_per_serving ?? 0),
        total_calories: Number(body.total_calories ?? (body.calories_per_serving ? body.calories_per_serving * servings : 0)),
      };

      setResult(normalized);
    } catch (err: any) {
      const resp = err?.response;
      const status = resp?.status ?? null;
      const serverMsg = resp?.data?.message || resp?.data?.error || err?.message || null;
      showMappedErrorToast(status, serverMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="grid gap-2">
        <Label htmlFor="dish" className="flex items-center justify-between">
          <span>Dish name</span>
        </Label>

        <div className="flex gap-3">
          <Input
            id="dish"
            placeholder={dish ? "" : `e.g. ${SAMPLE_DISHES[suggestIndex]}`}
            value={dish}
            onChange={(e) => setDish(e.target.value)}
            className="w-full"
          />
        </div>

        {/* suggestion chips */}
        <div className="mt-2 flex flex-wrap gap-2">
          {SAMPLE_DISHES.slice(0, 6).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setDish(s);
              }}
              className="text-sm px-3 py-1 rounded border transition duration-150 ease-in-out hover:bg-slate-100 dark:hover:bg-slate-700 hover:scale-105 cursor-pointer"
              style={{ backgroundColor: "transparent", color: "var(--foreground)", borderColor: "var(--border)" }}
              aria-label={`Use suggestion ${s}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-2 mt-4">
        <Label htmlFor="servings">Servings</Label>
        <Input
          id="servings"
          type="number"
          inputMode="decimal"
          placeholder="e.g. 1 or 0.5"
          value={servingsStr}
          onChange={(e) => setServingsStr(e.target.value)}
          className="w-full"
          min={0.1}
          max={1000}
          step={0.1}
        />
        <div className="text-xs text-slate-500">Enter a number between 0.1 and 1000 (decimals allowed, e.g. 0.5)</div>
      </div>

      <div className="flex items-center gap-3 mt-4">
        <Button onClick={onSearch} disabled={useMealStore.getState().loading}>
            Search
        </Button>

        <Button variant="ghost" onClick={clear}>
          Reset
        </Button>

      </div>
    </div>
  );
}
