"use client";
import "../globals.css";
import Navbar from "../components/Navbar";
import { Providers } from "@/context/Providers";

export default function NavbarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="flex h-full w-full">
        <Navbar />
        {children}
      </div>
    </>
  );
}
