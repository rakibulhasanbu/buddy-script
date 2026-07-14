"use client";

import Image from "next/image";

import { FriendUser } from "@/features/friends/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
    <Card className="items-center text-center">
      <CardContent className="flex flex-col items-center gap-3 pt-4">
        <div className="relative h-20 w-20 overflow-hidden rounded-full">
          <Image src={user.photoUrl || "/images/profile.png"} alt={user.name} fill className="object-cover" />
        </div>

        <div className="flex flex-col items-center gap-1">
          <h4 className="text-sm font-semibold text-buddy-text-dark">{user.name}</h4>
          {user.headline && <p className="line-clamp-2 text-xs text-buddy-text-secondary">{user.headline}</p>}
        </div>

        <div className="flex w-full flex-col items-center gap-2 pt-1">
          {action === "connect" && (
            <Button type="button" onClick={onConnect} disabled={isLoading} className="h-9 w-full rounded-full text-sm">
              {isLoading ? "Connecting..." : "Connect"}
            </Button>
          )}

          {action === "accept-decline" && (
            <div className="flex w-full gap-2">
              <Button type="button" onClick={onAccept} disabled={isLoading} className="h-9 flex-1 rounded-full text-sm">
                Accept
              </Button>
              <Button
                type="button"
                onClick={onDecline}
                disabled={isLoading}
                variant="outline"
                className="h-9 flex-1 rounded-full text-sm"
              >
                Decline
              </Button>
            </div>
          )}

          {action === "cancel" && (
            <Button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              variant="outline"
              className="h-9 w-full rounded-full text-sm"
            >
              {isLoading ? "Canceling..." : "Cancel"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
