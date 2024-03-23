"use client";

import {
  Button,
  CircularProgress,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useState } from "react";
import { hrApi } from "@/api";
import { toast } from "sonner";
import { DANGER_TOAST, SUCCESS_TOAST } from "@/components";
import { useForm } from "react-hook-form";
import { ILote } from "@/interfaces";
import { useRouter } from "next/navigation";

type Errors = {
  cantidad_producto?: number;
  fecha_entrada?: string;
  fecha_vencimiento?: string;
  precio_kg?: number;
} | null;

interface IFormData {
  cantidad_producto: number;
  fecha_entrada: string;
  fecha_vencimiento: string;
  precio_kg: number;
  monto_total: number;
}

interface Props {
  lote: ILote | undefined;
  useDisclosure: { isOpen: boolean; onClose: () => void };
  loading: boolean;
}

export const EditLoteModal = ({
  lote,
  useDisclosure: { isOpen, onClose },
  loading,
}: Props) => {
  const router = useRouter();
  const methods = useForm<IFormData>();
  const { handleSubmit, register } = methods;
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<Errors>(null);

  const onSubmit = async (data: IFormData) => {
    try {
      data = {
        ...lote,
        ...data,
      };
      await hrApi
        .put(`/inventory/lote/${lote?.id_lote}`, {
          ...lote,
          ...data,
        })
        .then((res) => {
          if (res.status === 200) {
            toast("Producto actualizado", SUCCESS_TOAST);
            window.location.reload();
            router.refresh();
            onClose();
          } else {
            toast("Hubo un error al actualizar el producto", DANGER_TOAST);
            console.log("Error al actualizar producto", res.data);
          }
        });
    } catch (error) {
      console.log("Error al actualizar producto", error);
      toast("Hubo un error al actualizar el producto", DANGER_TOAST);
    }
  };

  return (
    <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            {loading ? (
              <CircularProgress size="lg" aria-label="Loading..." />
            ) : (
              <form onSubmit={handleSubmit(onSubmit)}>
                <ModalHeader className="flex flex-col">
                  Editar {lote?.producto?.nombre_producto}
                  <Button
                    type="button"
                    className="mt-2"
                    onClick={() => setIsEditing(!isEditing)}
                    startContent={
                      <span className="material-symbols-outlined">
                        edit_square
                      </span>
                    }
                  >
                    Editar
                  </Button>
                </ModalHeader>
                <ModalBody>
                  <Input
                    label="Cantidad en kg"
                    type="number"
                    {...register("cantidad_producto")}
                    errorMessage={errors?.cantidad_producto}
                    defaultValue={lote?.cantidad_producto?.toString()}
                    isDisabled={!isEditing}
                  />
                  <Input
                    label="Precio por kg"
                    type="number"
                    {...register("precio_kg")}
                    errorMessage={errors?.precio_kg}
                    defaultValue={lote?.precio_kg?.toString()}
                    isDisabled={!isEditing}
                  />
                  <Input
                    label="Fecha de llegada"
                    type="date"
                    {...register("fecha_entrada")}
                    errorMessage={errors?.fecha_entrada}
                    defaultValue={
                      new Date(lote?.fecha_entrada || "")
                        .toISOString()
                        .split("T")[0]
                    }
                    isDisabled={!isEditing}
                  />
                  <Input
                    label="Fecha de duración aproximada en estado fresco"
                    type="date"
                    {...register("fecha_vencimiento")}
                    errorMessage={errors?.fecha_vencimiento}
                    defaultValue={
                      new Date(lote?.fecha_vencimiento || "")
                        .toISOString()
                        .split("T")[0]
                    }
                    isDisabled={!isEditing}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cerrar
                  </Button>
                  <Button type="submit" className="bg-green-600">
                    Actualizar
                  </Button>
                </ModalFooter>
              </form>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
