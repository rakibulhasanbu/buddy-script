"use client";

import { useSearchParams } from "next/navigation";

import { ComingSoon } from "@/components/shared/coming-soon";

export default function ComingSoonPage() {
  const searchParams = useSearchParams();
  const feature = searchParams.get("feature") || "This feature";

  return <ComingSoon feature={feature} />;
}
