"use client";
import { useEffect, useState } from "react";
import { useRequireLogin } from "@/hooks/useRequireLogin";
import { LoginState } from "@/services/Api";
import { useApiContext } from "@/context/ApiContext";
import NurseHome from "../components/pages/NurseHome";
import AdminHome from "../components/pages/AdminHome";
import ParentHome from "../components/pages/ParentHome";
import { useObservable } from "@/hooks/useObservable";

export default function Home() {
  const api = useApiContext();
  const loginState = useRequireLogin();
  const role = useObservable(api.role, "");

  useEffect(() => {
    if (loginState === LoginState.LOGGED_OUT) {
      console.log("Not logged in");
      return;
    }
  }, [loginState, api]);

  return (
    <>
      {(role === "nurse" && <NurseHome />) ||
        (role === "admin" && <AdminHome />) ||
        (role === "parent" && <ParentHome />)}
    </>
  );
}
