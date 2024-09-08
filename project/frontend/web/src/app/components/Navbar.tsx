"use client";
import Image from "next/image";
import plunketlogo from "../../../public/plunket-large.png";
import { Icon } from "@iconify/react";
import { useApiContext } from "@/context/ApiContext";
import { LoginState } from "@/services/Api";
import { useObservable } from "@/hooks/useObservable";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const api = useApiContext();

  const loginState = useObservable(api.loginState, LoginState.LOGGED_OUT);

  const router = useRouter();

  const role = useObservable(api.role, "");

  return (
    <>
      <div className="bg-base-500 flex h-full basis-1/4 flex-col justify-between gap-3 p-3 text-gray-700 lg:w-72">
        <a
          className="hidden cursor-pointer items-center justify-center rounded-lg bg-purple-100 py-10 lg:flex"
          onClick={() => {
            router.push("/");
          }}
        >
          <Image
            src={plunketlogo}
            width="0"
            height="0"
            alt="plunket logo"
            className="hidden h-auto w-[200px] lg:block"
          />
        </a>
        <div className="hidden w-full lg:flex">
          <ul className="flex w-full flex-col gap-5">
            <li className="w-full rounded-lg bg-gray-50 p-3">
              <a
                onClick={() => {
                  router.replace("/");
                }}
                className="flex cursor-pointer items-center gap-3 py-1"
              >
                {role === "parent" ? (
                  <Icon icon="fa6-solid:baby" />
                ) : (
                  <Icon icon="ion:home-outline" className="h-5 w-5" />
                )}
                {role === "parent" ? "My Child" : "Home"}
              </a>
            </li>
            {role === "nurse" && (
              <li className="w-full rounded-lg bg-gray-50 p-3">
                <a
                  onClick={() => {
                    router.push("/create-record");
                  }}
                  className="flex cursor-pointer items-center gap-3 py-1"
                >
                  <Icon icon="gg:add" className="h-5 w-5" />
                  Create a new record
                </a>
              </li>
            )}
            {role !== "parent" && (
              <li className="w-full rounded-lg bg-gray-50 p-3">
                <a
                  onClick={() => {
                    router.push("/search");
                  }}
                  className="flex cursor-pointer items-center gap-3 py-1"
                >
                  <Icon icon="material-symbols:search" className="h-5 w-5" />
                  Search babies
                </a>
              </li>
            )}
            {role !== "parent" && (
              <li className="w-full rounded-lg bg-gray-50 p-3">
                <a
                  onClick={() => {
                    if (role === "nurse") {
                      router.push("/support");
                    } else if (role === "admin") {
                      router.push("/admin-support");
                    }
                  }}
                  className="flex cursor-pointer items-center gap-3 py-1"
                >
                  <Icon icon="fluent:chat-help-20-regular" />
                  Support
                </a>
              </li>
            )}
          </ul>
        </div>

        <div className="flex-grow rounded-lg bg-gray-50"></div>
        <div className="w-full rounded-lg bg-gray-50">
          <div className="">
            <ul tabIndex={0} className="rounded-lg-box z-[1] mt-3 p-2">
              {(loginState === LoginState.LOGGED_IN && (
                <a
                  onClick={() => {
                    router.replace("/logout");
                  }}
                  className="flex cursor-pointer items-center justify-center gap-3 lg:justify-normal"
                >
                  <Icon icon="material-symbols:logout" />
                  <p className="hidden lg:block">Logout</p>
                </a>
              )) || (
                <a
                  onClick={() => {
                    router.replace("/login");
                  }}
                  className="flex cursor-pointer items-center gap-3"
                >
                  <Icon icon="material-symbols:login" />
                  <p className="hidden lg:block">Login</p>
                </a>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
