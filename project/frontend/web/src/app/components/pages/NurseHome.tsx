import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { Child } from "@/models/Children";
import { useApiContext } from "@/context/ApiContext";
import { Nurse } from "@/models/Nurse";
import { useRouter } from "next/navigation";
import RecentChildren from "../RecentChildren";

export default function NurseHome() {
  const [assignedChildren, setAssignedChildren] = useState<Child[] | null>(
    null
  );
  const api = useApiContext();
  const router = useRouter();

  const [loggedInNurse, setLoggedInNurse] = useState<Nurse | null>(null);

  useEffect(() => {
    (async () => {
      const res: Child[] = await api.getAssignedChildren();
      res.sort((a, b) => (a > b ? -1 : 1));
      setAssignedChildren(res);
    })();
    (async () => {
      const nurse = await api.getLoggedInNurse();
      setLoggedInNurse(nurse);
    })();
  }, [api]);

  return (
    <main className="section-container flex h-full flex-col items-center justify-center">
      <div className="flex w-full flex-col pb-20">
        <h1 className="flex items-center text-nowrap text-4xl">
          Welcome
          {loggedInNurse?.first_name ? (
            <span className="ml-[0.3em]">
              {loggedInNurse.first_name} {loggedInNurse.last_name}
            </span>
          ) : (
            <div className="skeleton ml-[0.3em] h-10 w-56"></div>
          )}
        </h1>
        <div className="flex w-full items-center justify-between pt-20">
          <div className="flex flex-col gap-5">
            <h2 className="text-2xl">All assigned children:</h2>
            <table className="table ">
              <thead>
                <tr className="border-gray-200 text-xs text-gray-500">
                  <th></th>
                  <th>First name</th>
                  <th>Last Name</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                {assignedChildren?.map((child, idx) => {
                  return (
                    <tr
                      className="cursor-pointer border-gray-200 py-3"
                      key={child.first_name}
                      onClick={() => {
                        router.push(`/children/id/${child._id.toString()}`);
                      }}
                    >
                      <th>{idx}</th>
                      <td className="">{child.first_name}</td>
                      <td>{child.last_name}</td>
                      <td>{child.address}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <button
              className="btn flex w-min flex-nowrap text-nowrap"
              onClick={() => {
                router.push("/create-record");
              }}
            >
              <Icon icon="gg:add" className="h-5 w-5" />
              Create new child record
            </button>
          </div>
          <div className="">
            <h1 className="text-nowrap pb-5 text-2xl">
              Most Recently Created Child:{" "}
            </h1>
            <RecentChildren />
          </div>
        </div>
      </div>
    </main>
  );
}
