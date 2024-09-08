"use client";

import { useApiContext } from "../context/ApiContext";
import { LoginState } from "@/services/Api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useObservable } from "./useObservable";

export function useRequireLogin() {
  const api = useApiContext();

  const router = useRouter();

  const loginState = useObservable(api.loginState, null);

  useEffect(() => {
    if (loginState === LoginState.LOGGED_OUT) {
      router.replace("/login");
    }
  }, [loginState, router]);

  return loginState;
}
