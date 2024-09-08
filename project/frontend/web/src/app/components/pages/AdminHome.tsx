import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { Child } from "@/models/Children";
import { useApiContext } from "@/context/ApiContext";
import { Nurse } from "@/models/Nurse";
import { useRouter } from "next/navigation";
import RecentChildren from "../RecentChildren";

export default function AdminHome() {
  const [assignedNurses, setAssignedNurses] = useState<Nurse[] | null>(null);
  const api = useApiContext();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    (async () => {
      const res: Nurse[] = await api.getAllNurses();
      console.log(res);
      setAssignedNurses(res);
    })();
  }, [api]);

  return (
    <main className="section-container flex h-full flex-col items-center justify-center">
      <div className="flex w-full flex-col pb-20">
        <h1 className="flex items-center text-nowrap text-4xl">
          Welcome to the admin dashboard
        </h1>
        <div className="flex w-full items-center justify-center pt-20">
          <div className="flex flex-col gap-5">
            <h2 className="text-2xl">All nurses:</h2>
            <table className="table ">
              <thead>
                <tr className="border-gray-200 text-xs text-gray-500">
                  <th></th>
                  <th>First name</th>
                  <th>Last Name</th>
                  <th>Username</th>
                  <th>Password</th>
                  <th>Admin Actions</th>
                </tr>
              </thead>
              <tbody>
                {assignedNurses?.map((nurse, idx) => {
                  return (
                    <tr
                      className="cursor-pointer border-gray-200 py-3"
                      key={nurse._id}
                    >
                      <th>{idx}</th>
                      <td className="">{nurse.first_name}</td>
                      <td>{nurse.last_name}</td>
                      <td>{nurse.username}</td>
                      <td>
                        <input
                          className="bg-white"
                          type="password"
                          id={nurse._id}
                          disabled={true}
                          value={nurse.password}
                        />
                      </td>
                      <td className="flex justify-between">
                        <button
                          onClick={() => {
                            const currentType = document
                              .getElementById(nurse._id)
                              ?.getAttribute("type");
                            document
                              .getElementById(nurse._id)
                              ?.setAttribute(
                                "type",
                                currentType === "text" ? "password" : "text"
                              );
                          }}
                        >
                          <Icon icon="mdi:eye-outline" className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => {
                            (async () => {
                              await api.deleteNurse(nurse._id);
                              location.reload();
                            })();
                          }}
                        >
                          <Icon
                            icon="mdi:bin-outline"
                            className="h-5 w-5 text-red-500"
                          />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <dialog id="create_nurse_modal" className="modal">
              <div className="modal-box">
                <h3 className="text-lg font-bold">Hello!</h3>
                <p className="py-4">Enter details of new nurse:</p>
                <div className="modal-action flex flex-col items-center">
                  <form
                    method="dialog "
                    onSubmit={(e) => {
                      (async () => {
                        const res = await api.createNewNurse({
                          firstName,
                          lastName,
                          username,
                          password,
                        });
                        console.log(res);
                      })();
                    }}
                  >
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
                      ✕
                    </button>
                    <div className="flex flex-col items-center gap-5">
                      <label className="input input-bordered flex w-full items-center gap-2">
                        First name
                        <input
                          type="text"
                          className="grow"
                          placeholder="Marla"
                          onChange={(e) => {
                            setFirstName(e.target.value);
                          }}
                        />
                      </label>
                      <label className="input input-bordered flex w-full items-center gap-2">
                        Last name
                        <input
                          type="text"
                          className="grow"
                          placeholder="Singer"
                          onChange={(e) => {
                            setLastName(e.target.value);
                          }}
                        />
                      </label>
                      <label className="input input-bordered flex w-full items-center gap-2">
                        Username
                        <input
                          type="text"
                          className="grow"
                          placeholder="marla1234"
                          onChange={(e) => {
                            setUsername(e.target.value);
                          }}
                        />
                      </label>
                      <label className="input input-bordered flex w-full items-center gap-2">
                        Password
                        <input
                          type="password"
                          className="grow"
                          placeholder=""
                          onChange={(e) => {
                            setPassword(e.target.value);
                          }}
                        />
                      </label>
                      <button className="btn">
                        <Icon icon="gg:add" className="h-5 w-5" />
                        Create
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </dialog>
            <button
              className="btn flex w-min flex-nowrap text-nowrap"
              onClick={() => {
                (
                  document.getElementById("create_nurse_modal") as any
                )?.showModal();
              }}
            >
              <Icon icon="gg:add" className="h-5 w-5" />
              Create new nurse account
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
