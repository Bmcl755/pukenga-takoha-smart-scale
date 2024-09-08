"use client";

import { useApiContext } from "@/context/ApiContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Logout() {
  const api = useApiContext();
  const router = useRouter();

  useEffect(() => {
    api.logout();
    router.replace("/login");
  }, []);
  return <div>Logging out...</div>;
}
