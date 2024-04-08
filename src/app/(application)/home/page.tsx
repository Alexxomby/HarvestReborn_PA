import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { HomeCliente, HomeNegocio } from "@/components";
import { Spinner } from "@nextui-org/react";

const HomePage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");
  if (session?.user.id_rol === 4) redirect("/auth/register?oauth=true");
  if (session?.user.id_rol === 1) redirect("/admin/dashboard");
  
  return (
    <>
      {!session ? (
        <div className="flex flex-col items-center justify-center">
          <Spinner size="lg" />
          <p>Cargando...</p>
        </div>
      ) : (
        <section className="flex flex-col relative overflow-hidden min-h-screen">
          {session?.user.id_rol === 2 ? <HomeNegocio /> : <HomeCliente />}
        </section>
      )}
    </>
  );
};

export default HomePage;
