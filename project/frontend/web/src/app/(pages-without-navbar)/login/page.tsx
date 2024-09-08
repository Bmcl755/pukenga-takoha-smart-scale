"use client";
import { useApiContext } from "@/context/ApiContext";
import { useRouter } from "next/navigation";
import { useObservable } from "@/hooks/useObservable";
import { LoginState } from "@/services/Api";
import { useEffect, useState } from "react";
import Image from "next/image";
import plunketlogowithtext from "../../../../public/plunket-large.png";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");

  const api = useApiContext();
  const router = useRouter();

  async function handleLogin() {
    const isLoginSuccess = await api.login(username, password, role);
    if (isLoginSuccess) {
      router.replace("/");
    } else {
      alert("Invalid username or password.");
    }
  }
  const loginState = useObservable(api.loginState, null);

  useEffect(() => {
    if (loginState === LoginState.LOGGED_IN) {
      router.replace("/");
    }
  }, [loginState, router]);

  return (
    <div>
      <div className="section-container">
        <div>
          <div className="flex flex-col items-start gap-3">
            <Image
              src={plunketlogowithtext}
              width="0"
              height="0"
              alt="plunket logo with name"
              className="mx-auto h-[300px] w-auto"
            />
            <div className="mx-auto flex flex-col gap-4">
              <h1 className="text-left text-lg text-primary ">Welcome</h1>
              <label className="input input-bordered input-primary flex items-center gap-1 rounded-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70"
                >
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                </svg>
                <input
                  type="text"
                  className="grow"
                  placeholder="Username"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </label>
              <label className="input input-bordered input-primary flex items-center gap-1 rounded-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70"
                >
                  <path
                    fillRule="evenodd"
                    d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  type="password"
                  className="grow"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
              <div
                className="form-control"
                onClick={() => {
                  setRole("nurse");
                }}
              >
                <label className="label cursor-pointer">
                  <span className="label-text">Nurse</span>
                  <input
                    type="radio"
                    name="radio-10"
                    className="radio checked:bg-[#ee1c2f]"
                    defaultChecked
                  />
                </label>
              </div>
              <div
                className="form-control"
                onClick={() => {
                  setRole("parent");
                }}
              >
                <label className="label cursor-pointer">
                  <span className="label-text">Parent</span>
                  <input
                    type="radio"
                    name="radio-10"
                    className="radio checked:bg-[#fcb040]"
                    defaultChecked
                  />
                </label>
              </div>
              <div
                className="form-control"
                onClick={() => {
                  setRole("admin");
                  console.log("admin");
                }}
              >
                <label className="label cursor-pointer">
                  <span className="label-text">Admin</span>
                  <input
                    type="radio"
                    name="radio-10"
                    className="radio checked:bg-[#685da9]"
                    defaultChecked
                  />
                </label>
              </div>
              <button
                className="btn btn-primary mt-10 rounded-md text-white"
                onClick={handleLogin}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
