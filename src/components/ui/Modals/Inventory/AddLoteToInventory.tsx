"use client";

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { productSchema } from "@/validations/products.validation";
import { hrApi } from "@/api";
import { toast } from "sonner";
import { SUCCESS_TOAST } from "@/components";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/auth";
import { IProduct } from "@/interfaces";
import { zodResolver } from "@hookform/resolvers/zod";

interface IFormData {
  id_producto: number;
  cantidad_producto: number;
  fecha_entrada: Date;
  fecha_vencimiento: Date;
  precio_kg: number;
  monto_total: number;
  inventory_id: number;
}

type Errors = {
  cantidad_producto?: number;
  fecha_entrada?: string;
  fecha_vencimiento?: string;
  precio_kg?: number;
} | null;

interface Props {
  id: number;
  product: IProduct | undefined;
  useDisclosure: { isOpen: boolean; onClose: () => void };
}

export const AddLoteToInventory = ({
  id,
  product,
  useDisclosure: { isOpen, onClose },
}: Props) => {
  const { handleSubmit, register, formState: { errors } } = useForm<IFormData>({
    resolver: zodResolver(productSchema),
  });
  const { user } = useContext(AuthContext);

  const addProduct: SubmitHandler<IFormData> = async (data) => {
    try {
      const res = await hrApi
        .post(`/negocio/inventory/${id}`, {
          id: id,
          cantidad_producto: data.cantidad_producto,
          fecha_entrada: data.fecha_entrada,
          fecha_vencimiento: data.fecha_vencimiento,
          precio_kg: data.precio_kg,
          monto_total: data.cantidad_producto * data.precio_kg,
          inventory_id: user?.duenonegocio?.negocio?.id_negocio,
        })
        .then(() => {
          toast("Producto agregado a tu inventario", SUCCESS_TOAST);
          onClose();
          return true;
        })
        .catch((err) => {
          console.log(err);
          return null;
        });
      if (res) {
        console.log("Producto agregado");
      } else {
        console.log("Hubo un error data");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit(addProduct)}>
            <ModalHeader className="flex flex-col gap-1 mt-4">
              Añadir {product?.nombre_producto} a tu inventario
            </ModalHeader>
            <ModalBody>
              <Input
                label="Cantidad en kg"
                type="number"
                {...register("cantidad_producto")}
                errorMessage={errors?.cantidad_producto?.message}
              />
              <Input
                label="Precio por kg"
                type="number"
                {...register("precio_kg")}
                errorMessage={errors?.precio_kg?.message}
              />
              <Input
                label="Fecha de llegada"
                type="date"
                defaultValue={new Date().toISOString().split("T")[0]}
                {...register("fecha_entrada")}
                errorMessage={errors?.fecha_entrada?.message}
              />
              <Input
                label="Fecha de duración aproximada en estado fresco"
                type="date"
                {...register("fecha_vencimiento")}
                errorMessage={errors?.fecha_vencimiento?.message}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cerrar
              </Button>
              <Button type="submit" className="bg-green-600">
                Agregar
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};
