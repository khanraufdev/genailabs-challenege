'use client'

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useState } from "react"

export const SignOutButton = () => {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  const handleSignOut = async () => {
    if (isPending) return
    setIsPending(true)
    try {
      await authClient.signOut()
    } finally {
      router.replace("/login")
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      type="button"
      aria-label="Sign out"
      title="Sign out"
      className="min-w-24 hover:cursor-pointer"
      onClick={handleSignOut}
      disabled={isPending}
    >
      {isPending ? "Signing out..." : "Sign out"}
    </Button>
  )
}


