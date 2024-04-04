"use client";

import React, { useEffect, useState } from "react";
import { IUser } from "@/interfaces";
import { hrApi } from "@/api";
import {
  CircularProgress,
  Button,
  BreadcrumbItem,
  Breadcrumbs,
} from "@nextui-org/react";
import {
  EditUserForm,
} from "@/components";

interface UserInfoAdminProps {
  id_user: string;
}

export const UserInfoAdmin = ({ id_user }: UserInfoAdminProps) => {
  const [user, setUser] = useState<IUser>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    hrApi.get(`/admin/users/${id_user}`).then((res) => {
      if (res.status === 200) {
        setUser(res.data);
      } else {
        setError(true);
        console.log("Error");
      }
      setLoading(false);
    });
  }, [id_user]);

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
          href={"/admin/dashboard/users"}
          startContent={
            <span className="material-symbols-outlined">group</span>
          }
        >
          Usuarios
        </BreadcrumbItem>
        <BreadcrumbItem href={"/admin/dashboard/users"}>Listado</BreadcrumbItem>
        <BreadcrumbItem>Info</BreadcrumbItem>
      </Breadcrumbs>

      <h3 className="text-xl font-semibold">Información del usuario</h3>

      {loading ? (
        <CircularProgress size="lg" aria-label="Loading..." />
      ) : error ? (
        <p>Hubo un error</p>
      ) : (
        <>
          <div className="max-w-[95rem] mx-auto w-full">
            <div className="flex flex-col gap-4">
              <div className="col-span-2">
                <Button
                  type="button"
                  color="success"
                  className="mt-4"
                  size="md"
                  onClick={() => setIsEditing(!isEditing)}
                  startContent={
                    <span className="material-symbols-outlined">
                      edit_square
                    </span>
                  }
                >
                  {isEditing ? "Cancelar" : "Editar"}
                </Button>
              </div>
              <EditUserForm user={user as IUser} isEditing={isEditing} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
