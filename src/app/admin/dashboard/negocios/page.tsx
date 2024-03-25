import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { SidebarWrapper, NegociosAdmin } from "@/components";

const ProductsPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  return (
    <div className="flex">
      <div>
        <SidebarWrapper />
      </div>
      <NegociosAdmin />
    </div>
  );
};

export default ProductsPage;
