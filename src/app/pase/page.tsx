import type { Metadata } from "next";
import { RecoverForm } from "@/components/features/RecoverForm";

export const metadata: Metadata = {
  title: "Recuperar pase · Simposio Dermocosmético",
};

export default function PasePage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-dark px-5 py-12 text-light">
      <RecoverForm />
    </main>
  );
}
