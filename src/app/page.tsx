import { ExploreTheLab, Hero } from "@/components/hero";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";

export default function Page() {
  return (
    <Hero>
      <Suspense fallback={null}>
        <LoginOrRedirectButton />
      </Suspense>
    </Hero>
  );
}

const LoginOrRedirectButton = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session?.user) {
    return <ExploreTheLab />;
  }
  return (
    <Link
      href="/login"
      className="w-60 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 hover:cursor-pointer text-center"
    >
      Login to Continue
    </Link>
  );
};
