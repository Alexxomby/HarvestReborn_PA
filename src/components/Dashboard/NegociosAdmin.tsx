"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { TableNegocios } from "@/components";
import { INegocio } from "@/interfaces";
import { hrApi } from "@/api";
import { CircularProgress } from "@nextui-org/react";

export const NegociosAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [negocios, setNegocios] = React.useState<INegocio[]>([]);

  useEffect(() => {
    hrApi.get("/admin/users/negocios").then((res) => {
      if (res.status === 200) {
        setNegocios(res.data);
      } else {
        setError(true);
      }
      setLoading(false);
    });
  }, []);

  return (
    <div className="my-10 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <ul className="flex">
        <li className="flex gap-2">
          <span className="material-symbols-outlined">home</span>
          <Link href={"/admin/dashboard"}>
            <span>Home</span>
          </Link>
          <span> / </span>{" "}
        </li>

        <li className="flex gap-2">
          <span className="material-symbols-outlined">store</span>
          <span>Negocios </span> <span> / </span>{" "}
        </li>
        <li className="flex gap-2">
          <span>Listado</span>
        </li>
      </ul>

      <h3 className="text-xl font-semibold">Todos los negocios</h3>
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex flex-row gap-3.5 flex-wrap">
          {/*<Button*/}
          {/*  color="primary"*/}
          {/*  startContent={*/}
          {/*    <span className="material-symbols-outlined">ios_share</span>*/}
          {/*  }*/}
          {/*>*/}
          {/*  Export to CSV*/}
          {/*</Button>*/}
        </div>
      </div>
      {loading ? (
        <div className="flex flex-col items-center justify-center">
          <CircularProgress size="lg" aria-label="Loading..." />
        </div>
      ) : error ? (
        <p>Hubo un error</p>
      ) : (
        <div className="max-w-[95rem] mx-auto w-full">
          <TableNegocios negocios={negocios} />
        </div>
      )}
    </div>
  );
};
