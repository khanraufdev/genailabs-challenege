import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { LabControls } from "@/components/lab/lab-controls";
import { SignOutButton } from "@/components/signout-button";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Suspense } from "react";
import { Lab } from "@/components/lab";

export const metadata: Metadata = {
  title: "GenAI Labs",
  description: "Private LLM workspace. Compare models, prompts, and metrics.",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export default async function LabPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    redirect("/login");
  }
  return (
    <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      <Link
        href="/"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft />
        <span>Back to Home</span>
      </Link>
      <Suspense fallback={<div>Loading...</div>}>
        <Lab />
      </Suspense>
    </div>
  );
}
