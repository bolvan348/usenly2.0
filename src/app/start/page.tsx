import { Suspense } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { StartFlow } from "@/components/start/StartFlow";

export const metadata = {
  title: "Start — Usenly",
  description: "Register and claim your collectible bear",
};

export default function StartPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="px-6 pt-32 pb-24">
        <Suspense>
          <StartFlow />
        </Suspense>
      </div>
    </main>
  );
}
