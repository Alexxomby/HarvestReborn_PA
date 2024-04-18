"use client";

import React, {
  useState,
  DragEvent,
  ChangeEvent,
  useContext,
} from "react";
import {
  Card,
  CardHeader,
  Input,
  Select,
  SelectItem,
  Textarea,
  Button,
  CardBody,
  Divider,
  Image
} from "@nextui-org/react";
import { FaX } from "react-icons/fa6";
import { AuthContext } from "@/context/auth";
import { postValidationSchema } from "@/validations/negocio.validation";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface IFormData {
  images_publicacion: string;
  titulo_publicacion: string;
  descripcion_publicacion: string;
  price?: number;
  disponibilidad: string;
}

export const PublicacionSection = () => {
  const { user } = useContext(AuthContext);
  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
    getValues,
    watch,
    setValue,
  } = useForm<IFormData>({
    // resolver: zodResolver(postValidationSchema),
  });
  const [images, setImages] = useState<File[]>([]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const newFiles = Array.from(selectedFiles);
      setImages((prevFiles: File[]) => [...prevFiles, ...newFiles]);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      const newFiles = Array.from(droppedFiles);
      setImages((prevFiles: File[]) => [...prevFiles, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setImages((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <>
      <aside className="py-4 w-full md:w-1/3 lg:w-1/4 md:block border-r-1">
        <div className="flex flex-col gap-2 p-4 text-sm top-12">
          <h4 className="text-md dark:text-gray-300">Harvest Reborn</h4>
          <h2 className="mb-4 text-2xl font-semibold dark:text-gray-300">
            Crear publicación
          </h2>
        </div>
        <div className="p-4">
          <h4 className="text-sm dark:text-gray-300">
            Imágenes - {images.length}/10 - (Máximo 10 imágenes)
          </h4>

          {images.length === 0 ? (
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div
                  className="flex flex-col items-center justify-center w-full h-full"
                  onDrop={handleDrop}
                  onDragOver={(event) => event.preventDefault()}
                >
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                    <span className="font-semibold">
                      Agrega imágenes haciendo clic
                    </span>{" "}
                    o arrastrando y soltando
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {images.map((file, index) => (
                <div
                  key={index}
                  className="relative w-28 h-28 bg-gray-300 dark:bg-gray-700 rounded-lg"
                >
                  <Image
                    src={URL.createObjectURL(file)}
                    alt="Imagen de la publicación"
                    className="object-cover w-full h-full rounded-lg"
                  />
                  <Button
                    onClick={() => handleRemoveFile(index)}
                    isIconOnly
                    size="sm"
                    radius="full"
                    className="absolute top-0 right-0 p-1 bg-red-500 z-10"
                  >
                    <FaX />
                  </Button>
                </div>
              ))}
              <label
                htmlFor="dropzone-file"
                className="w-28 h-28 flex flex-col items-center justify-center border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div
                  className="flex flex-col items-center justify-center w-full h-full"
                  onDrop={handleDrop}
                  onDragOver={(event) => event.preventDefault()}
                >
                  <svg
                    className="w-8 h-8 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    <span className="font-semibold">Agregar más imágenes</span>
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          )}
        </div>
        <form className="flex flex-col gap-2 p-4 text-sm top-12">
          <h4 className="text-lg dark:text-gray-300">
            Información de la publicación
          </h4>
          <div className="flex flex-col gap-2">
            <Input
              label="Título"
              type="text"
              id="title"
              className="input"
              {...register("titulo_publicacion")}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Textarea
              label="Descripción"
              id="description"
              className="input"
              {...register("descripcion_publicacion")}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Input
              label="Precio"
              type="number"
              id="price"
              className="input"
              {...register("price")}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Select
              label="Disponible para"
              id="unit"
              className="input"
              {...register("disponibilidad")}
            >
              <SelectItem key="1" value="1">
                Venta
              </SelectItem>
              <SelectItem key="2" value="2">
                Donación
              </SelectItem>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              color="primary"
              size="lg"
              className="w-full"
            >
              Publicar
            </Button>
          </div>
        </form>
      </aside>
      <div className="w-full min-h-screen">
        <div className="w-full h-full flex items-center justify-center">
          <Card className="p-4 h-[700px] w-[800px]">
            <CardHeader>
              <h2 className="text-md">Vista previa</h2>
            </CardHeader>
            <CardBody className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-2">
                {images.length > 0 ? (
                  images.map((file, index) => (
                    <div
                      key={index}
                      className="w-full h-full bg-gray-300 dark:bg-gray-700 rounded-lg"
                    >
                      <Image
                        src={URL.createObjectURL(file)}
                        alt="Imagen de la publicación"
                        className="object-cover w-full h-full rounded-lg"
                      />
                    </div>
                  ))
                ) : (
                  <div className="w-full h-full bg-gray-300 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <p className="text-center text-gray-500 dark:text-gray-400">
                      Vista previa de la publicación
                    </p>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <h2 className="text-lg">
                    {watch("titulo_publicacion")
                      ? watch("titulo_publicacion")
                      : "Título de la publicación"}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {watch("price") ? `$${watch("price")}` : "Precio"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Publicado hace unos segundos
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-md">Descripción</p>
                  <p className="text-sm text-default-700">
                    {watch("descripcion_publicacion")
                      ? watch("descripcion_publicacion")
                      : "Aqui va la descripción de la publicación"}
                  </p>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Disponible para:{" "}
                  {watch("disponibilidad") === "1"
                    ? "Venta"
                    : watch("disponibilidad") === "2"
                      ? "Donación"
                      : "Venta/Donación"}
                </p>
                <Divider className="my-4" />
                <div className="flex flex-col gap-2">
                  <h2 className="text-lg">Información del vendedor</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user?.duenonegocio?.negocio?.nombre_negocio ??
                      "Nombre del negocio"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user?.duenonegocio?.negocio?.direccion_negocio ??
                      "Dirección"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user?.duenonegocio?.negocio?.telefono_negocio ??
                      "Teléfono"}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
};
