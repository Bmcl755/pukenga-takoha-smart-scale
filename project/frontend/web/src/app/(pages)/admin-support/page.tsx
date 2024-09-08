"use client";
import { useApiContext } from "@/context/ApiContext";
import { useRequireLogin } from "@/hooks/useRequireLogin";
import { useEffect, useState } from "react";
import { Nurse } from "@/models/Nurse";

export default function AdminSupport() {
  const api = useApiContext();
  useRequireLogin();
  const [allNurses, setAllNurses] = useState<Nurse[]>([]);
  const [currentlySelectedNurse, setCurrentlySelectedNurse] =
    useState<Nurse | null>(null);

  useEffect(() => {
    (async () => {
      setAllNurses(await api.getAllNurses());
    })();
  }, [api]);
  return (
    <div className="section-container h-full w-full pt-20">
      <div className="grid h-full w-full grid-cols-2 grid-rows-1">
        <div className="flex flex-col">
          <h1 className="pb-5 text-2xl">Nurses:</h1>
          {allNurses &&
            allNurses.map((nurse) => {
              return (
                <div
                  className="w-min cursor-pointer text-nowrap border-b border-t p-5"
                  key={nurse._id.toString()}
                  onClick={() => {
                    console.log(nurse);
                    setCurrentlySelectedNurse(nurse);
                  }}
                >
                  <p className="text-xl">
                    {nurse.first_name} {nurse.last_name}
                  </p>
                  <p>{nurse.support_requests?.length} support requests!</p>
                </div>
              );
            })}
        </div>
        <div
          onClick={() => {
            console.log(currentlySelectedNurse?.support_requests);
          }}
        >
          {currentlySelectedNurse?.support_requests && (
            <>
              {currentlySelectedNurse.support_requests?.map((request) => {
                return (
                  <div key={request} className="chat chat-start">
                    <div className="chat-header">
                      {currentlySelectedNurse.first_name}
                    </div>
                    <div className="chat-bubble bg-slate-200">{request}</div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
