"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { useAcceptFriendRequestMutation, useDeclineFriendRequestMutation } from "@/features/friends/api";
import { useNotifications } from "@/features/notifications/hooks/use-notifications";
import { ENotificationType, NotificationGroup } from "@/features/notifications/types";
import { toast } from "sonner";

import { NotificationListSkeleton } from "@/components/shared/notification-skeleton";

import { FriendRequestNotificationItem, NotificationItem } from "./notification-item";
import { PostNotificationModal } from "./post-notification-modal";

const BellIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="22" fill="none" viewBox="0 0 20 22">
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M7.547 19.55c.533.59 1.218.915 1.93.915.714 0 1.403-.324 1.938-.916a.777.777 0 011.09-.056c.318.284.344.77.058 1.084-.832.917-1.927 1.423-3.086 1.423h-.002c-1.155-.001-2.248-.506-3.077-1.424a.762.762 0 01.057-1.083.774.774 0 011.092.057zM9.527 0c4.58 0 7.657 3.543 7.657 6.85 0 1.702.436 2.424.899 3.19.457.754.976 1.612.976 3.233-.36 4.14-4.713 4.478-9.531 4.478-4.818 0-9.172-.337-9.528-4.413-.003-1.686.515-2.544.973-3.299l.161-.27c.398-.679.737-1.417.737-2.918C1.871 3.543 4.948 0 9.528 0zm0 1.535c-3.6 0-6.11 2.802-6.11 5.316 0 2.127-.595 3.11-1.12 3.978-.422.697-.755 1.247-.755 2.444.173 1.93 1.455 2.944 7.986 2.944 6.494 0 7.817-1.06 7.988-3.01-.003-1.13-.336-1.681-.757-2.378-.526-.868-1.12-1.851-1.12-3.978 0-2.514-2.51-5.316-6.111-5.316z"
      clipRule="evenodd"
    />
  </svg>
);

const formatBadgeCount = (count: number): string => {
  if (count <= 0) return "";
  if (count > 99) return "99+";
  return String(count);
};

export const NotificationDropdown = () => {
  const [open, setOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [postModalOpen, setPostModalOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { activeTab, setActiveTab, groups, isLoading, unreadCount, hasMore, loadMore, markAsRead, markAllAsRead } =
    useNotifications();

  const [acceptFriendRequest] = useAcceptFriendRequestMutation();
  const [declineFriendRequest] = useDeclineFriendRequestMutation();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleNotificationClick = async (notification: NotificationGroup) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }

    switch (notification.type) {
      case ENotificationType.POST_CREATED:
      case ENotificationType.COMMENT_CREATED:
      case ENotificationType.REACTION_ON_POST:
      case ENotificationType.REACTION_ON_COMMENT:
        if (notification.entityId) {
          setSelectedPostId(notification.entityId);
          setPostModalOpen(true);
        }
        break;
      case ENotificationType.FRIEND_REQUEST_ACCEPTED:
        if (notification.actor?.id) {
          router.push(`/users/${notification.actor.id}`);
        }
        break;
      default:
        break;
    }

    setOpen(false);
  };

  const handleAcceptFriendRequest = async (notification: NotificationGroup) => {
    if (!notification.entityId) return;
    try {
      await acceptFriendRequest(notification.entityId).unwrap();
      toast.success("Friend request accepted");
    } catch {
      toast.error("Failed to accept friend request");
    }
  };

  const handleDeclineFriendRequest = async (notification: NotificationGroup) => {
    if (!notification.entityId) return;
    try {
      await declineFriendRequest(notification.entityId).unwrap();
      toast.success("Friend request declined");
    } catch {
      toast.error("Failed to decline friend request");
    }
  };

  const badgeText = formatBadgeCount(unreadCount);

  return (
    <>
      <div ref={ref} className="relative">
        <span
          onClick={() => setOpen((prev) => !prev)}
          className="relative block cursor-pointer px-4 py-5.5 text-buddy-text-secondary transition-colors hover:text-primary"
        >
          <BellIcon />
          {badgeText && (
            <span className="absolute top-4 right-2.5 flex h-4.25 min-w-4.25 items-center justify-center rounded-[9px] border border-buddy-card-bg bg-primary px-0.75 text-[11px] leading-none font-normal text-primary-foreground">
              {badgeText}
            </span>
          )}
        </span>

        {open && (
          <div className="absolute top-8 -left-27.5 z-50 max-h-[calc(100vh-90px)] w-100 overflow-auto rounded-md bg-buddy-card-bg p-4 shadow-[0_8px_24px_rgba(149,157,165,0.2)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
            <div className="mb-5 flex items-center justify-between">
              <h4 className="m-0 text-[20px] leading-tight font-semibold text-buddy-text-dark">Notifications</h4>
              <button
                type="button"
                onClick={() => markAllAsRead()}
                className="text-xs text-buddy-primary hover:underline"
              >
                Mark all as read
              </button>
            </div>

            <div className="mb-3 flex gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`h-9 rounded-md border border-buddy-border-color px-3 text-base leading-tight font-medium transition-colors ${
                  activeTab === "all" ? "bg-accent text-primary" : "text-buddy-text-dark hover:bg-buddy-muted-bg"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("unread")}
                className={`h-9 rounded-md border border-buddy-border-color px-3 text-base leading-tight font-medium transition-colors ${
                  activeTab === "unread"
                    ? "bg-accent text-primary"
                    : "text-buddy-text-dark hover:bg-buddy-muted-bg"
                }`}
              >
                Unread
              </button>
            </div>

            <div>
              {isLoading ? (
                <NotificationListSkeleton count={4} />
              ) : groups.length === 0 ? (
                <div className="py-8 text-center text-sm text-buddy-text-secondary">No notifications</div>
              ) : (
                groups.map((notification) =>
                  notification.type === ENotificationType.FRIEND_REQUEST ? (
                    <FriendRequestNotificationItem
                      key={notification.id}
                      notification={notification}
                      onAccept={() => handleAcceptFriendRequest(notification)}
                      onDecline={() => handleDeclineFriendRequest(notification)}
                    />
                  ) : (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onClick={() => handleNotificationClick(notification)}
                    />
                  )
                )
              )}

              {hasMore && (
                <button
                  type="button"
                  onClick={loadMore}
                  className="mt-2 w-full rounded-md py-2 text-sm font-medium text-buddy-primary hover:bg-buddy-muted-bg"
                >
                  Load more
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <PostNotificationModal
        postId={selectedPostId}
        open={postModalOpen}
        onOpenChange={(isOpen) => {
          setPostModalOpen(isOpen);
          if (!isOpen) {
            setSelectedPostId(null);
          }
        }}
      />
    </>
  );
};
