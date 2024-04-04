"use client";

import React, { useContext } from "react";
import { Sidebar } from "./sidebar.styles";
import { SidebarMenu, SidebarItem } from "@/components";
import { usePathname } from "next/navigation";
import { UiContext } from "@/context/ui";
import { Image } from "@nextui-org/react";

export const SidebarWrapper = () => {
  const pathname = usePathname();
  const { isMenuOpen, toggleSideMenu } = useContext(UiContext);

  return (
    <aside className="h-screen z-[50] sticky top-0">
      {isMenuOpen ? (
        <div className={Sidebar.Overlay()} onClick={toggleSideMenu} />
      ) : null}
      <div
        className={Sidebar({
          collapsed: isMenuOpen,
        })}
      >
        <div className={Sidebar.Header()}>
          <div className="flex items-center gap-2">
            <Image src="/images/logo.png" width={50} height={50} alt="Logo" />
            <h3 className="text-xl font-medium m-0 text-default-900 -mb-4 whitespace-nowrap">
              Dashboard
            </h3>
          </div>
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className={Sidebar.Body()}>
            <SidebarItem
              title="Home"
              icon={
                <span className="material-symbols-outlined">dashboard</span>
              }
              isActive={pathname === "/admin/dashboard"}
              href="/admin/dashboard"
            />
            <SidebarMenu title="Menu Principal">
              <SidebarItem
                isActive={pathname === "/admin/dashboard/users"}
                title="Usuarios"
                icon={<span className="material-symbols-outlined">group</span>}
                href="/admin/dashboard/users"
              />
              <SidebarItem
                isActive={pathname === "/admin/dashboard/products"}
                title="Productos"
                icon={
                  <span className="material-symbols-outlined">nutrition</span>
                }
                href="/admin/dashboard/products"
              />
              <SidebarItem
                isActive={pathname === "/admin/dashboard/negocios"}
                title="Negocios"
                icon={
                  <span className="material-symbols-outlined">storefront</span>
                }
                href="/admin/dashboard/negocios"
              />
              <SidebarItem
                isActive={pathname === "/admin/dashboard/clientes"}
                title="Clientes"
                icon={<span className="material-symbols-outlined">hiking</span>}
                href="/admin/dashboard/clientes"
              />
              <SidebarItem
                isActive={pathname === "/admin/dashboard/orders"}
                title="Ordenes"
                icon={
                  <span className="material-symbols-outlined">
                    shopping_bag
                  </span>
                }
                href="/admin/dashboard/orders"
              />
              <SidebarItem
                isActive={pathname === "/admin/dashboard/chats"}
                title="Chats"
                icon={<span className="material-symbols-outlined">forum</span>}
                href="/admin/dashboard/chats"
              />
            </SidebarMenu>
            <SidebarMenu title={"Soporte"}>
              <SidebarItem
                title="Tickets"
                icon={
                  <span className="material-symbols-outlined">
                    confirmation_number
                  </span>
                }
                href="/admin/dashboard/tickets"
              />
              <SidebarItem
                title="Preguntas Frecuentes"
                icon={<span className="material-symbols-outlined">quiz</span>}
                href="/admin/dashboard/faqs"
              />
            </SidebarMenu>
          </div>
        </div>
      </div>
    </aside>
  );
};
