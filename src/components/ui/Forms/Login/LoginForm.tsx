"use client";

import { FC, useState, useContext } from "react";

import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { loginSchema } from "@/validations/auth.validation";
import { signIn, SignInResponse } from "next-auth/react";
import { toast } from "sonner";
import { AuthContext } from "@/context/auth";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Input,
  Link,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Button,
} from "@nextui-org/react";
import { DANGER_TOAST, SUCCESS_TOAST } from "@/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { isEmailVerified } from "@/helpers";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";

interface IFormData {
  user_email: string;
  user_password: string;
}

export const LoginForm: FC = () => {
  const router = useRouter();
  const { loginUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
  } = useForm<IFormData>({
    resolver: zodResolver(loginSchema),
  });
  const [visible, setVisible] = useState<boolean>(false);

  const clientAction: SubmitHandler<IFormData> = async (data) => {
    setLoading(true);
    try {
      const result = await loginUser(data.user_email, data.user_password);

      if (!result) {
        setError("user_email", {
          message: "Correo o contraseña inválidos",
        });
        setError("user_password", {
          message: "Correo o contraseña inválidos",
        });
        setLoading(false);
        return null;
      }

      const isEmailVerifiedRes = await isEmailVerified(data.user_email);

      if (isEmailVerifiedRes.message === "Este correo no ha sido verificado") {
        setError("user_email", {
          message: "Este correo no ha sido verificado",
        });
        setLoading(false);
        return null;
      } else if (
        isEmailVerifiedRes.message === "Este usuario se encuentra inactivo"
      ) {
        setError("user_email", {
          message: "Este usuario se encuentra inactivo",
        });
        setLoading(false);
        return null;
      }

      const res: SignInResponse | undefined = await signIn("credentials", {
        ...data,
        redirect: false,
      });

      if (res?.error === "CredentialsSignin") {
        setError("user_email", {
          message: "Correo o contraseña inválidos",
        });
        setError("user_password", {
          message: "Correo o contraseña inválidos",
        });
        setLoading(false);
      }
      if (res && res.ok && res.status === 200) {
        toast("¡Bienvenido!", SUCCESS_TOAST);
        setLoading(false);
        router.push("/home");
        router.refresh();
        return;
      }
    } catch (e) {
      setLoading(false);
      console.info("[ERROR_CLIENT_ACTION]", e);
      toast("¡Algo salio mal!", DANGER_TOAST);
    }
  };

  return (
    <section className="relative min-h-screen flex flex-row justify-center bg-transparent">
      <div className="flex justify-center self-center z-10">
        <Card className="p-6 w-96" shadow="lg">
          <CardHeader className="flex flex-col items-start">
            <h3 className="font-semibold text-2xl dark:text-gray-300 light:text-gray-300">
              Iniciar sesión{" "}
            </h3>
            <p className="text-gray-400">
              ¿No tienes una cuenta?{" "}
              <Link
                href={"/auth/register"}
                className="text-sm text-green-700 hover:text-green-800 hover:underline"
              >
                Regístrate
              </Link>
            </p>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit(clientAction)}>
              <div className="space-y-6">
                <div className="relative">
                  <Input
                    type="email"
                    id="email"
                    label="Email"
                    {...register("user_email")}
                  />
                  {errors?.user_email && (
                    <p className="text-red-500 text-xs">
                      {errors?.user_email.message}
                    </p>
                  )}
                </div>

                <div className="relative">
                  <Input
                    label="Contraseña"
                    type={visible ? "text" : "password"}
                    id="password"
                    {...register("user_password")}
                    endContent={
                      <button
                        type="button"
                        onClick={() => setVisible(!visible)}
                        className="flex items-center absolute inset-y-0 right-0 mr-3 cursor-pointer text-sm leading-5 text-green-700"
                      >
                        {visible ? (
                          <MdOutlineVisibilityOff size={24} />
                        ) : (
                          <MdOutlineVisibility size={24} />
                        )}
                      </button>
                    }
                  />
                  {errors?.user_password && (
                    <p className="text-red-500 text-xs">
                      {errors?.user_password.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm ml-auto">
                    <Link
                      href={"/auth/reset-password"}
                      color="success"
                      className="text-sm"
                    >
                      Olvidaste tu contraseña?
                    </Link>
                  </div>
                </div>
                <div>
                  <Button
                    type="submit"
                    isLoading={loading}
                    className="w-full flex justify-center bg-green-800 hover:bg-green-700 text-gray-100 p-3  rounded-lg tracking-wide font-semibold  cursor-pointer transition ease-in duration-500"
                  >
                    Iniciar sesión
                  </Button>
                </div>
                <div className="flex items-center justify-center space-x-2 my-5">
                  <span className="h-px w-16 bg-gray-400"></span>
                  <span className="light:text-gray-700 dark:text-gray-300 font-normal text-sm text-center">
                    O también puedes iniciar sesión con
                  </span>
                  <span className="h-px w-16 bg-gray-400"></span>
                </div>
                <div className="flex justify-center gap-5 w-full ">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => signIn("google")}
                    className="w-full flex items-center justify-center mb-6 md:mb-0 border border-gray-300 hover:border-gray-500 hover:text-yellow-700 dark:text-gray-300 dark:hover:text-yellow-700 text-sm text-gray-500 p-3  rounded-lg tracking-wide font-medium  cursor-pointer transition ease-in duration-500"
                  >
                    <FcGoogle className="mr-2" />
                    <span>Google</span>
                  </button>
                </div>
              </div>
            </form>
          </CardBody>
          <CardFooter className="flex items-center justify-center">
            <div className="light:text-gray-500 dark:text-gray-400 text-xs">
              <span>
                Copyright © 2024
                <Link href={"/"} rel="" className="text-green-500 text-sm">
                  &nbsp; Harvest Reborn
                </Link>
              </span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
};
