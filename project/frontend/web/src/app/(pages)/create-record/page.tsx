"use client";

import { useApiContext } from "@/context/ApiContext";
import { useRequireLogin } from "@/hooks/useRequireLogin";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateRecord() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");

  const api = useApiContext();
  const router = useRouter();
  useRequireLogin();

  async function addRecord() {
    return api.createChildRecord(firstName, lastName, address);
  }

  return (
    <div className="section-container flex h-full flex-col justify-center">
      <div className="mx-auto mt-10 w-2/5">
        <div className="card border-2 bg-neutral-content shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-primary">New Record</h2>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">First Name:</span>
              </div>
              <input
                type="text"
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
                placeholder="Type here"
                className="input input-bordered input-primary w-full rounded-md"
              />
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Last Name:</span>
              </div>
              <input
                type="text"
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
                placeholder="Type here"
                className="input input-bordered input-primary w-full rounded-md"
              />
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Address:</span>
              </div>
              <input
                type="text"
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
                placeholder="Type here"
                className="input input-bordered input-primary w-full rounded-md"
              />
            </label>
            <div className="card-actions justify-end"></div>
          </div>
        </div>
        <div className="text-right">
          <button
            onClick={async () => {
              const newChildRecord = await addRecord();
              router.replace("/children/id/" + newChildRecord._id);
            }}
            className="btn btn-primary mt-5 rounded-md  text-white"
          >
            Add Record
          </button>
        </div>
      </div>
    </div>
  );
}
