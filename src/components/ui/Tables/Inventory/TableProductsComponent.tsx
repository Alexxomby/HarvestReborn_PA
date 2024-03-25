"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { ILote } from "@/interfaces";
import { ReactNode, useState } from "react";
import { Tooltip, useDisclosure } from "@nextui-org/react";
import { hrApi } from "@/api";
import { toast } from "sonner";
import { DANGER_TOAST, EditLoteModal, SUCCESS_TOAST, Row } from "@/components";

interface ProductsCollapsibleTableProps {
  lotesById: ILote[];
  allLotes: ILote[];
  children?: ReactNode;
}

export const ProductsCollapsibleTable = ({
  lotesById,
  allLotes,
}: ProductsCollapsibleTableProps) => {
  const [loading, setLoading] = useState(true);
  const { onOpen, onClose, isOpen } = useDisclosure();
  const [lote, setLote] = useState<ILote>();

  const getLote = async (id: number) => {
    setLoading(true);
    await hrApi.get(`/inventory/lote/${id}`).then((res) => {
      if (res.status === 200) {
        setLote(res.data);
      } else {
        console.log("Error al obtener producto", res.data);
      }
      setLoading(false);
    });
  };
  const handleDelete = async (id: number) => {
    await hrApi.delete(`/inventory/${id}`).then((res) => {
      if (res.status === 200) {
        toast("Producto eliminado con éxito", SUCCESS_TOAST);
        window.location.reload();
      } else {
        toast("Hubo un error al borrar el producto", DANGER_TOAST);
        console.log("Error al borrar producto", res.data);
      }
    });
  };
  return (
    <>
      <EditLoteModal
        lote={lote}
        useDisclosure={{ isOpen, onClose }}
        loading={loading}
      />
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Ver lotes</TableCell>
              <TableCell>Imagen</TableCell>
              <TableCell align="right">Nombre del producto</TableCell>
              <TableCell align="right">
                No. de lotes
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lotesById?.map((loteMap) => (
              <Row lote={loteMap} allLotes={allLotes} key={loteMap.id_lote}>
                <div>
                  <Tooltip content="Editar">
                    <button
                      onClick={() => {
                        getLote(loteMap.id_lote).then(() => {});
                        onOpen();
                      }}
                    >
                      <span className="material-symbols-outlined text-blue-700">
                        edit
                      </span>
                    </button>
                  </Tooltip>
                  <Tooltip content="Eliminar">
                    <button
                      onClick={() => {
                        handleDelete(loteMap.id_lote).then(() => {});
                      }}
                    >
                      <span className="material-symbols-outlined text-red-700">
                        delete
                      </span>
                    </button>
                  </Tooltip>
                </div>
              </Row>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};