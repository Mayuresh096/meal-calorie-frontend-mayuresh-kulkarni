import { useMemo, useState } from "react";
import LoginPageWrapper from "./login/page";
import { useAuthStore } from "@/stores/authStore";
import DashboardPage from "./dashboard/page";

export default function Home() {
  const token = useAuthStore((s) => s.token);
  const isAuthenticated = useMemo(()=>{
    return token ? true : false
  },[token])
  return (
    <>
      {isAuthenticated ? <DashboardPage/> : <LoginPageWrapper/>}
    </>
  );
}
