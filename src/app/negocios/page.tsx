import { NegociosList } from "@/components";

const NegociosPage = async () => {
  return (
    <>
      <section className="flex flex-col relative overflow-hidden min-h-screen">
        <NegociosList />
      </section>
    </>
  );
};

export default NegociosPage;
