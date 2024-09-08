import { useApiContext } from "@/context/ApiContext";
import { useRequireLogin } from "@/hooks/useRequireLogin";
import RecordPage from "@/app/(pages)/children/id/[id]/page";
import React from "react";

export default function ParentHome() {
  const api = useApiContext();
  useRequireLogin();
  return <RecordPage params={{ id: "6646a9079b7e69cf718ae4c4" }} />;
}
