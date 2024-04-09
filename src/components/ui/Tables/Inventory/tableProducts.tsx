"use client";

import React, { useState, useMemo, useCallback, ChangeEvent, Key } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Selection,
  SortDescriptor,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { ILote } from "@/interfaces";
import { columnsLotes as columns } from "@/utils/data-table";
import { FaChevronDown, FaRegTrashAlt, FaEdit } from "react-icons/fa";
import { capitalize } from "@/utils/capitalize";
import { hrApi } from "@/api";
import { toast } from "sonner";
import { DANGER_TOAST, EditLoteModal, SUCCESS_TOAST } from "@/components";

interface Props {
  lotes: ILote[];
}

const INITIAL_VISIBLE_COLUMNS = [
  "fecha_entrada",
  "cantidad_producto",
  "fecha_vencimiento",
  "acciones",
];

export const TableProductsInventory = ({ lotes }: Props) => {
  const [lote, setLote] = useState<ILote>();
  const [loading, setLoading] = useState(false);
  const { onOpen, onClose, isOpen } = useDisclosure();

  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "fecha_orden",
    direction: "ascending",
  });

  const [page, setPage] = useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredOrders = [...lotes];

    if (hasSearchFilter) {
      filteredOrders = filteredOrders.filter((lote) =>
        lote.producto.nombre_producto
          .toLowerCase()
          .includes(filterValue.toLowerCase())
      );
    }

    return filteredOrders;
  }, [lotes, filterValue, hasSearchFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    const { column, direction } = sortDescriptor;

    return items.sort((a, b) => {
      if ((a[column as keyof ILote] ?? "") < (b[column as keyof ILote] ?? "")) {
        return direction === "ascending" ? -1 : 1;
      }
      if ((a[column as keyof ILote] ?? "") > (b[column as keyof ILote] ?? "")) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }, [sortDescriptor, items]);

  const getLote = async (id: number) => {
    setLoading(true);
    await hrApi.get(`/negocio/inventory/lote/${id}`).then((res) => {
      if (res.status === 200) {
        setLote(res.data);
      } else {
        console.log("Error al obtener producto", res.data);
      }
      setLoading(false);
    });
  };

  const handleDelete = async (id: number) => {
    await hrApi.delete(`/negocio/inventory/${id}`).then((res) => {
      if (res.status === 200) {
        toast("Producto eliminado con éxito", SUCCESS_TOAST);
        window.location.reload();
      } else {
        toast("Hubo un error al borrar el producto", DANGER_TOAST);
        console.log("Error al borrar producto", res.data);
      }
    });
  };

  const renderCell = useCallback((lote: ILote, columnKey: Key) => {
    const cellValue = lote[columnKey as keyof ILote];

    switch (columnKey) {
      case "id_lote":
        return <div className="dark:text-gray-300">{lote.id_lote}</div>;
      case "fecha_entrada":
        return (
          <div className="dark:text-gray-300">
            {new Date(lote.fecha_entrada).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        );
      case "cantidad_producto":
        return (
          <div className="dark:text-gray-300">{lote.cantidad_producto} kg</div>
        );
      case "fecha_vencimiento":
        return (
          <div className="dark:text-gray-300">
            {new Date(lote.fecha_vencimiento).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        );
      case "acciones":
        return (
          <div className="flex items-center gap-2">
            <div>
              <Tooltip content="Editar">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onClick={() => {
                    getLote(lote.id_lote).then(() => {});
                    onOpen();
                  }}
                >
                  <FaEdit className="text-blue-700" size={20} />
                </Button>
              </Tooltip>
            </div>
            <div>
              <Tooltip content="Eliminar">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onClick={() => {
                    handleDelete(lote.id_lote).then(() => {});
                  }}
                >
                  <FaRegTrashAlt className="text-red-700" size={20} />
                </Button>
              </Tooltip>
            </div>
          </div>
        );
      default:
        return cellValue;
    }
  }, [onOpen]);

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<FaChevronDown size={20} />} variant="flat">
                  Columnas
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total de lotes: {lotes.length}
          </span>
        </div>
      </div>
    );
  }, [
    visibleColumns,
    lotes.length,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "Todos los lotes seleccionados"
            : `${selectedKeys.size} de ${filteredItems.length} lotes seleccionados`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Anterior
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Siguiente
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, page, pages, filteredItems.length, onNextPage, onPreviousPage]);

  return (
    <>
      {lote && (
        <EditLoteModal
          lote={lote}
          useDisclosure={{ isOpen, onClose }}
          loading={loading}
        />
      )}
      <div className=" w-full flex flex-col gap-4">
        <Table
          aria-label="Example table with custom cells, pagination and sorting"
          isHeaderSticky
          bottomContent={bottomContent}
          bottomContentPlacement="outside"
          selectedKeys={selectedKeys}
          selectionMode="multiple"
          sortDescriptor={sortDescriptor}
          topContent={topContent}
          topContentPlacement="outside"
          onSelectionChange={setSelectedKeys}
          onSortChange={setSortDescriptor}
        >
          <TableHeader columns={headerColumns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
                allowsSorting={column.sortable}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody emptyContent={"No hay lotes 😭"} items={sortedItems}>
            {(item) => (
              <TableRow key={item.id_lote}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey) as any}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};