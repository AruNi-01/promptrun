import { Divider } from "@nextui-org/react";

export default function MarketLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-5 w-4/6 mt-8">
      <h1 className="text-4xl self-start">我出售的 Promps</h1>
      <Divider />
      {children}
    </section> 
  );
}
