import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type ApiResult = {
  dish_name: string;
  source?: string;
  servings: number;
  calories_per_serving: number;
  total_calories: number;
};

export type MealError = {
  status: number | null;
  message: string;
} | null;

type MealState = {
  result: ApiResult | null;
  loading: boolean;
  error: MealError;

  setResult: (r: ApiResult | null) => void;
  setLoading: (v: boolean) => void;
  setError: (err: MealError) => void;
  clear: () => void;
};

export const useMealStore = create<MealState>()(
  persist(
    (set) => ({
      result: null,
      loading: false,
      error: null,

      setResult: (r) =>
        set(() => ({
          result: r,
          error: r ? null : null,
        })),

      setLoading: (v) =>
        set(() => ({
          loading: v,
        })),

      setError: (err) =>
        set(() => ({
          error: err,
          loading: false,
        })),

      clear: () =>
        set(() => ({
          result: null,
          loading: false,
          error: null,
        })),
    }),
    {
      name: "meal-store",

      storage: createJSONStorage(() => localStorage),

      partialize: (state) => ({
        result: state.result,
      }),
    }
  )
);
