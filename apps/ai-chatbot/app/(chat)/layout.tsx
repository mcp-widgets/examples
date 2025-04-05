import { TooltipProvider } from "@/components/ui/tooltip";
import Script from "next/script";

export const experimental_ppr = true;

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
        strategy="beforeInteractive"
      />
      <TooltipProvider delayDuration={0}>
        <div>{children}</div>
      </TooltipProvider>
    </>
  );
}
