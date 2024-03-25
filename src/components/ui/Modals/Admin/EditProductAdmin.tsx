"use client";

import {
  Button,
  Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  CircularProgress,
} from "@nextui-org/react";
import React, { useState } from "react";
import { hrApi } from "@/api";
import { toast } from "sonner";
import { adminEditProductValidation } from "@/validations/admin.validation";
import { DANGER_TOAST, SUCCESS_TOAST } from "@/components";
import { useForm } from "react-hook-form";
import { IProduct } from "@/interfaces";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

interface IFormData {
  nombre_producto: string;
  imagen_producto: File | undefined;
  file: string;
  descripcion: string;
  enTemporada: boolean;
  categoria: string;
}

interface Props {
  product: IProduct | undefined;
  useDisclosure: { isOpen: boolean; onClose: () => void };
  loading: boolean;
}

export const EditProductAdminModal = ({
  product,
  useDisclosure: { isOpen, onClose },
  loading,
}: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = useForm<IFormData>({
    resolver: zodResolver(adminEditProductValidation),
    defaultValues: {
      nombre_producto: product?.nombre_producto ?? "",
      imagen_producto: undefined,
      file: product?.imagen_producto ?? "",
      descripcion: product?.descripcion ?? "",
      enTemporada: product?.enTemporada ?? false,
      categoria: product?.categoria ?? "",
    },
  });
  const router = useRouter();

  const [isSelected, setIsSelected] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState<File | undefined>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setFile(e.target.files?.[0]);
  };

  const onSubmit = async (data: IFormData) => {
    try {
      if (file) {
        const dataImage = new FormData();
        dataImage.set("file", file as File);

        await hrApi.post("/admin/upload", dataImage).then((res) => {
          if (res.status === 200) {
            console.log("File uploaded successfully");
            data.file = res.data.secure_url;
          } else {
            setError("imagen_producto", {
              message: "Hubo un error al subir la imagen",
            });
            console.log("Hubo un error al subir la imagen");
            return null;
          }
        });
      }

      const res = await hrApi.put(`/admin/product`, {
        id: product?.id_producto,
        ...data,
      });
      if (res.status === 200) {
        toast("Producto editado correctamente", SUCCESS_TOAST);
        router.refresh();
        window.location.reload();
        onClose();
      }
    } catch (error) {
      console.log("Error al editar producto", error);
      toast("Ocurrió un error al editar el producto", DANGER_TOAST);
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            {loading ? (
              <CircularProgress size="lg" aria-label="Loading..." />
            ) : (
              <form onSubmit={handleSubmit(onSubmit)}>
                <ModalHeader className="flex flex-col">
                  Editar {product?.nombre_producto}
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
                  <div className="flex flex-col gap-4">
                    <Input
                      type="text"
                      {...register("nombre_producto")}
                      label="Nombre del producto"
                      isDisabled={!isEditing}
                      defaultValue={product?.nombre_producto}
                    />
                    {errors?.nombre_producto && (
                      <p className="text-red-500 dark:text-red-400 text-sm">
                        {errors?.nombre_producto.message}
                      </p>
                    )}
                    <div>
                      <label
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        htmlFor="file_input"
                      >
                        Imagen del producto
                      </label>
                      <input
                        type="file"
                        accept="image/png, image/jpg, image/jpeg, image/webp"
                        className="bg-zinc-900 text-zinc-100 p-2 rounded block mb-2"
                        disabled={!isEditing}
                        onChange={handleFileChange}
                      />
                      {errors?.imagen_producto && (
                        <p className="text-red-500 dark:text-red-400 text-sm">
                          {errors?.imagen_producto.message}
                        </p>
                      )}
                      <p
                        className="mt-1 text-sm text-gray-500 dark:text-gray-300"
                        id="file_input_help"
                      >
                        PNG, JPG.
                      </p>
                    </div>
                    <Input
                      type="text"
                      {...register("descripcion")}
                      label="Descripción"
                      isDisabled={!isEditing}
                      defaultValue={product?.descripcion}
                    />
                    {errors?.descripcion && (
                      <p className="text-red-500 dark:text-red-400 text-sm">
                        {errors?.descripcion.message}
                      </p>
                    )}
                    <div className="flex flex-col gap-2">
                      <p className="text-default-500">
                        En temporada {product?.enTemporada}
                      </p>
                      <Checkbox
                        isSelected={isSelected}
                        isDisabled={!isEditing}
                        onValueChange={setIsSelected}
                      >
                        {isSelected ? "Si" : "No"}
                      </Checkbox>
                      {errors?.enTemporada && (
                        <p className="text-red-500 dark:text-red-400 text-sm">
                          {errors?.enTemporada.message}
                        </p>
                      )}
                    </div>
                    <Select
                      isDisabled={!isEditing}
                      {...register("categoria")}
                      label="Categoria"
                      defaultSelectedKeys={[product?.categoria || "VERDURA"]}
                    >
                      <SelectItem key="VERDURA" value="VERDURA">
                        Verdura
                      </SelectItem>
                      <SelectItem key="FRUTA" value="FRUTA">
                        Fruta
                      </SelectItem>
                    </Select>
                    {errors?.categoria && (
                      <p className="text-red-500 dark:text-red-400 text-sm">
                        {errors?.categoria.message}
                      </p>
                    )}
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onClick={onClose}>
                    Cerrar
                  </Button>
                  <Button
                    color="primary"
                    type="submit"
                    onClick={() => {
                      setValue("imagen_producto", file as File);
                      setValue("enTemporada", isSelected);
                    }}
                  >
                    Editar
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