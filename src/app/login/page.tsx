import { LoginForm } from "@/components/login-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Access your Genailabs LLM Playground account.",
  alternates: { canonical: "/login" },
  robots: { index: false, follow: false },
  openGraph: { url: "/login" },
};

export default async function LoginPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user) {
    redirect("/");
  }

  return (
    <div className="flex h-svh items-center justify-centers px-4">
      <div className="w-full max-w-md mx-auto">
        <LoginForm />
      </div>
    </div>
  );
}
