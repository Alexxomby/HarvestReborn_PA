"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IPreguntasFaq } from "@/interfaces";
import { hrApi } from "@/api";
import {
  BreadcrumbItem,
  Breadcrumbs,
  CircularProgress,
} from "@nextui-org/react";

export const FaqsAdmin = () => {
  const [preguntas, setPreguntas] = useState<IPreguntasFaq[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    hrApi.get("/admin/faq").then((res) => {
      if (res.status === 200) {
        setPreguntas(res.data);
      } else {
        setError(true);
      }
      setLoading(false);
    });
  }, []);

  return (
    <div className="my-10 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <Breadcrumbs size="lg">
        <BreadcrumbItem
          href={"/admin/dashboard"}
          startContent={<span className="material-symbols-outlined">home</span>}
        >
          Home
        </BreadcrumbItem>
        <BreadcrumbItem
          href={"/admin/dashboard/faqs"}
          startContent={
            <span className="material-symbols-outlined">quiz</span>
          }
        >
          Preguntas frecuentes
        </BreadcrumbItem>
        <BreadcrumbItem>Listado</BreadcrumbItem>
      </Breadcrumbs>

      <h3 className="text-xl font-semibold">Preguntas frecuentes</h3>
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
    </div>
  );
};
