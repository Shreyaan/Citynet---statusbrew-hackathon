"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

export function GoogleAuthButton() {
  async function googleAuth() {
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      window.location.href = "/error";
    }
  }
  return (
    <Button
      onClick={(e) => {
        e.preventDefault();
        googleAuth();
      }}
      type="submit"
      variant="outline"
      className="w-full"
    >
      Login with Google
    </Button>
  );
}
