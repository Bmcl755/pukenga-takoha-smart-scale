"use client";
import { useApiContext } from "@/context/ApiContext";
import { useRequireLogin } from "@/hooks/useRequireLogin";
import { Nurse } from "@/models/Nurse";
import { useEffect, useState } from "react";

export default function Support() {
  useRequireLogin();
  const api = useApiContext();
  const [supportRequest, setSupportRequest] = useState("");

  const [loggedInNurse, setLoggedInNurse] = useState<Nurse | null>(null);

  function handleSubmit() {
    api.submitSupportRequest(supportRequest);
    alert("Request successfully submitted!");
    location.reload();
  }

  useEffect(() => {
    (async () => {
      const nurse = await api.getLoggedInNurse();
      setLoggedInNurse(nurse);
    })();
  }, []);

  return (
    <div className="section-container mt-10">
      <div className="flex flex-row items-start gap-10">
        <div className="flex w-1/2 flex-col gap-3">
          <h1 className="text-2xl font-bold text-primary">Support Ticket</h1>
          <p>Submit your support ticket here</p>
          <textarea
            className="textarea textarea-secondary textarea-md w-full"
            placeholder="Enter your support ticket here"
            onChange={(e) => {
              setSupportRequest(e.target.value);
            }}
          ></textarea>
          <button className="btn btn-primary text-white" onClick={handleSubmit}>
            Send Support Ticket
          </button>
          {loggedInNurse && (
            <>
              <h1 className="text-xl">Previous requests:</h1>
              <div>
                {loggedInNurse.support_requests?.map((request) => {
                  return (
                    <div key={request} className="chat chat-start">
                      <div className="chat-header">Me</div>
                      <div className="chat-bubble bg-slate-200">{request}</div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
        <div className="ml-auto text-left">
          <h2 className="mb-4 text-xl font-bold text-primary">Contact Us</h2>
          <p className="mb-4">Email: team15support@notreal.com</p>
          <p className="mb-4">Address: 31 Symonds Street, Auckland CBD</p>
        </div>
      </div>
    </div>
  );
}
