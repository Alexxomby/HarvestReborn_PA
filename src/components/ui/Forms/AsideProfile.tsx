"use client";

import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "@/context/auth";

export const AsideProfile = () => {
  const { user } = useContext(AuthContext);
  return (
    <aside className="hidden py-4 md:w-1/3 lg:w-1/4 md:block">
      <div className="flex flex-col gap-2 p-4 text-sm border-r border-indigo-100 top-12">
        <h2 className="pl-3 mb-4 text-2xl font-semibold">Settings</h2>
        <Link href={`/user/profile/${user?.id}`}>
          <button className="flex items-center px-3 py-2.5 font-semibold hover:text-indigo-900 hover:border hover:rounded-full">
            Perfil público
          </button>
        </Link>
        <Link href={`/user/profile/account/${user?.id}`}>
          <button className="flex items-center px-3 py-2.5 font-semibold hover:text-indigo-900 hover:border hover:rounded-full">
            Cuenta
          </button>
        </Link>
      </div>
    </aside>
  );
};
