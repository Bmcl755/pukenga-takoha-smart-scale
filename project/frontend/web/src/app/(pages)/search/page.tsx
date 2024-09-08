"use client";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { useApiContext } from "@/context/ApiContext";
import { useRequireLogin } from "@/hooks/useRequireLogin";
import { Child } from "@/models/Children";
import { useRouter } from "next/navigation";
import { useObservable } from "@/hooks/useObservable";

export default function Search() {
  useRequireLogin();
  const [searchTerm, setSearchTerm] = useState("");
  const [assignedChildren, setAssignedChildren] = useState<Child[] | null>(
    null
  );
  const [filteredChildren, setFilteredChildren] = useState<Child[] | null>(
    null
  );
  const api = useApiContext();
  const router = useRouter();
  const role = useObservable(api.role, "");

  useEffect(() => {
    (async () => {
      const res: Child[] =
        role === "nurse"
          ? await api.getAssignedChildren()
          : role === "admin"
            ? await api.getAllChildren()
            : [];
      res.sort((a, b) => (a > b ? -1 : 1));
      setAssignedChildren(res);
      setFilteredChildren(res);
    })();
  }, [api, role]);

  useEffect(() => {
    if (assignedChildren) {
      const filteredRecords = assignedChildren.filter(
        (child: Child) =>
          child.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          child.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          child.first_name
            .toLowerCase()
            .concat(" ", child.last_name.toLowerCase())
            .includes(searchTerm.toLowerCase()) ||
          child.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredChildren(filteredRecords);
    }
  }, [assignedChildren, searchTerm]);

  return (
    <div className="section-container mt-5">
      <div className="flex flex-col items-center gap-10">
        <div className="flex w-full flex-row justify-between gap-5">
          <div className="w-10">
            <a href="/">
              <Icon
                className="h-full w-full"
                icon="material-symbols:arrow-back"
              />
            </a>
          </div>
          <label className="input input-bordered flex w-1/2 items-center gap-2 rounded-md">
            <input
              type="text"
              className="grow"
              placeholder="Search the baby records"
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </label>
          <div className="w-10"></div>
        </div>
        <div className="max-h-[80vh] w-full overflow-scroll">
          {filteredChildren && (
            <table className="table table-zebra w-full">
              <thead>
                <tr className="top-0 border-gray-200 text-xs text-gray-500">
                  <th className="w-1/3">First name</th>
                  <th className="w-1/3">Last name</th>
                  <th className="w-1/3">Address</th>
                  {role === "admin" && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredChildren?.map((child, idx) => {
                  return (
                    <tr
                      className="cursor-pointer border-gray-200 py-3"
                      key={child._id}
                    >
                      <td
                        className=""
                        onClick={() => {
                          router.push(`/children/id/${child._id.toString()}`);
                        }}
                      >
                        {child.first_name}
                      </td>
                      <td
                        className=""
                        onClick={() => {
                          router.push(`/children/id/${child._id.toString()}`);
                        }}
                      >
                        {child.last_name}
                      </td>
                      <td
                        onClick={() => {
                          router.push(`/children/id/${child._id.toString()}`);
                        }}
                      >
                        {child.address}
                      </td>
                      {role === "admin" && (
                        <td
                          className="z-10 flex justify-center"
                          onClick={async () => {
                            await api.deleteChild(child._id);
                            location.reload();
                          }}
                        >
                          <Icon
                            icon="mdi:bin-outline"
                            className="h-5 w-5 text-red-500"
                          />
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
