"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

import { useGetWhoReactedQuery } from "@/features/feed/api";
import { REACTION_CONFIG, ReactionEmoji } from "@/features/feed/components/reaction-assets";
import { EReactionEntity, EReactionType } from "@/features/feed/types";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

interface WhoReactedModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: EReactionEntity;
  entityId: string;
}

type TabValue = "ALL" | EReactionType;

export const WhoReactedModal = ({ open, onOpenChange, entityType, entityId }: WhoReactedModalProps) => {
  const [activeTab, setActiveTab] = useState<TabValue>("ALL");
  const { data, isLoading } = useGetWhoReactedQuery({ entityType, entityId, limit: 100 }, { skip: !open });

  const reactions = useMemo(() => data?.data.data || [], [data?.data.data]);

  const counts = useMemo(() => {
    const total = reactions.length;
    const byType = {} as Record<EReactionType, number>;
    Object.values(EReactionType).forEach((type) => {
      byType[type] = reactions.filter((r) => r.type === type).length;
    });
    return { total, byType };
  }, [reactions]);

  const filtered = useMemo(() => {
    if (activeTab === "ALL") return reactions;
    return reactions.filter((r) => r.type === activeTab);
  }, [reactions, activeTab]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0">
        <DialogHeader className="border-b px-4 pt-4 pb-2">
          <DialogTitle className="text-center">Reactions</DialogTitle>
        </DialogHeader>

        <div className="border-b">
          <div className="flex gap-4 px-4">
            <button
              type="button"
              onClick={() => setActiveTab("ALL")}
              className={`border-b-2 px-2 py-2 text-sm font-medium transition-colors ${
                activeTab === "ALL" ? "border-primary text-primary" : "border-transparent text-buddy-text-secondary"
              }`}
            >
              All {counts.total}
            </button>
            {Object.values(EReactionType).map((type) => {
              const count = counts.byType[type];
              if (count === 0) return null;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setActiveTab(type)}
                  className={`flex items-center gap-1 border-b-2 px-2 py-2 text-sm font-medium transition-colors ${
                    activeTab === type
                      ? "border-primary text-primary"
                      : "border-transparent text-buddy-text-secondary"
                  }`}
                >
                  <span>{REACTION_CONFIG[type].emoji}</span>
                  <span>{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        <ScrollArea className="h-80 px-4">
          {isLoading ? (
            <div className="space-y-3 py-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-buddy-text-secondary">No reactions yet</p>
          ) : (
            <div className="space-y-3 py-3">
              {filtered.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Image
                        src={user.photoUrl || "/images/Avatar.png"}
                        alt={user.name}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    </div>
                    <span className="text-sm font-medium text-buddy-text-dark">{user.name}</span>
                  </div>
                  <ReactionEmoji type={user.type} className="text-lg" />
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
