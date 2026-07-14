"use client";

import Image from "next/image";

import { FriendUser } from "@/features/friends/types";

import { Button } from "@/components/ui/button";

interface FriendCardProps {
  user: FriendUser;
  action?: "connect" | "accept-decline" | "cancel" | "none";
  isLoading?: boolean;
  onConnect?: () => void;
  onAccept?: () => void;
  onDecline?: () => void;
  onCancel?: () => void;
}

export const FriendCard = ({
  user,
  action = "none",
  isLoading,
  onConnect,
  onAccept,
  onDecline,
  onCancel,
}: FriendCardProps) => {
  return (
    <div className="flex items-center justify-between rounded-md bg-buddy-card-bg p-4 shadow-[0_2px_4px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-12 overflow-hidden rounded-full">
          <Image src={user.photoUrl || "/images/profile.png"} alt={user.name} fill className="object-cover" />
        </div>
        <div>
          <h4 className="text-base font-medium text-buddy-text-dark">{user.name}</h4>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {action === "connect" && (
          <Button
            type="button"
            onClick={onConnect}
            disabled={isLoading}
            className="h-9 rounded-md bg-primary px-4 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            {isLoading ? "Connecting..." : "Connect"}
          </Button>
        )}

        {action === "accept-decline" && (
          <>
            <Button
              type="button"
              onClick={onAccept}
              disabled={isLoading}
              className="h-9 rounded-md bg-primary px-4 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
            >
              Accept
            </Button>
            <Button
              type="button"
              onClick={onDecline}
              disabled={isLoading}
              variant="outline"
              className="h-9 rounded-md border-buddy-border-color bg-buddy-card-bg px-4 text-sm text-buddy-text-dark hover:bg-buddy-muted-bg disabled:opacity-60"
            >
              Decline
            </Button>
          </>
        )}

        {action === "cancel" && (
          <Button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            variant="outline"
            className="h-9 rounded-md border-buddy-border-color bg-buddy-card-bg px-4 text-sm text-buddy-text-dark hover:bg-buddy-muted-bg disabled:opacity-60"
          >
            {isLoading ? "Canceling..." : "Cancel"}
          </Button>
        )}
      </div>
    </div>
  );
};
