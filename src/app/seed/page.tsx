"use client";

import { useState } from "react";

import { Loader2, Sprout } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export default function SeedPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ count: number } | null>(null);

  const handleSeed = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/seed-users`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Something went wrong" }));
        throw new Error(error.message || "Failed to seed users");
      }

      const data = await response.json();
      setResult(data.data);
      toast.success(`Seeded ${data.data.count} demo users`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to seed users");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#F3F9FF] to-[#E6F4FF] p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#1890FF]/10">
          <Sprout className="h-8 w-8 text-[#1890FF]" />
        </div>

        <h1 className="mb-2 text-2xl font-semibold text-[#212121]">Seed Demo Users</h1>
        <p className="mb-6 text-[#666666]">
          Create 50 demo accounts with password <span className="font-medium text-[#212121]">12345678</span>. Each user
          gets a unique email, name, headline, bio, and avatar.
        </p>

        <Button
          onClick={handleSeed}
          disabled={isLoading}
          className="h-11 w-full gap-2 bg-[#1890FF] text-white hover:bg-[#1890FF]/90 disabled:opacity-60"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sprout className="h-4 w-4" />}
          {isLoading ? "Seeding..." : "Seed 50 Users"}
        </Button>

        {result && (
          <div className="mt-6 rounded-lg border border-[#0ACF83]/20 bg-[#0ACF83]/10 p-4">
            <p className="text-sm font-medium text-[#0ACF83]">Successfully created {result.count} demo users.</p>
          </div>
        )}
      </div>
    </div>
  );
}
