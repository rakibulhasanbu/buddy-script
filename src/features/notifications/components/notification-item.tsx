"use client";

import Image from "next/image";
import Link from "next/link";

import { formatRelativeTime } from "@/features/feed/utils";
import { ENotificationType, NotificationGroup } from "@/features/notifications/types";

interface NotificationItemProps {
  notification: NotificationGroup;
  onClick?: () => void;
}

const getNotificationText = (notification: NotificationGroup): string => {
  const { actor, actorCount, type } = notification;
  const actorName = actor.name;
  const othersText = actorCount > 1 ? ` and ${actorCount - 1} other${actorCount > 2 ? "s" : ""}` : "";

  switch (type) {
    case ENotificationType.FRIEND_REQUEST:
      return `${actorName}${othersText} sent you a friend request`;
    case ENotificationType.FRIEND_REQUEST_ACCEPTED:
      return `${actorName}${othersText} accepted your friend request`;
    case ENotificationType.POST_CREATED:
      return `${actorName}${othersText} posted an update`;
    case ENotificationType.COMMENT_CREATED:
      return `${actorName}${othersText} commented on your post`;
    case ENotificationType.REACTION_ON_POST:
      return `${actorName}${othersText} reacted to your post`;
    case ENotificationType.REACTION_ON_COMMENT:
      return `${actorName}${othersText} reacted to your comment`;
    default:
      return "You have a new notification";
  }
};

export const NotificationItem = ({ notification, onClick }: NotificationItemProps) => {
  const text = getNotificationText(notification);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`mb-2 flex w-full items-start rounded-md p-2 text-left transition-colors hover:bg-buddy-muted-bg ${
        notification.isRead ? "bg-buddy-card-bg" : "bg-[#e6f3ff] dark:bg-[#1a3a5c]"
      }`}
    >
      <div className="relative mr-3 shrink-0">
        <Image
          src={notification.actor.photoUrl || "/images/profile.png"}
          alt={notification.actor.name}
          width={48}
          height={48}
          className="h-12 w-12 rounded-full object-cover"
        />
        {!notification.isRead && <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-[#1890FF]" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-relaxed text-buddy-text-secondary">
          <span className="font-medium text-buddy-text-dark">{notification.actor.name}</span>
          <span dangerouslySetInnerHTML={{ __html: text.replace(notification.actor.name, "") }} />
        </p>
        <p className="mt-1 text-xs font-semibold text-buddy-primary">
          {formatRelativeTime(notification.createdAt)} ago
        </p>
      </div>
    </button>
  );
};

interface FriendRequestNotificationItemProps {
  notification: NotificationGroup;
  onAccept: () => void;
  onDecline: () => void;
}

export const FriendRequestNotificationItem = ({
  notification,
  onAccept,
  onDecline,
}: FriendRequestNotificationItemProps) => {
  return (
    <div
      className={`mb-2 flex items-start rounded-md p-2 ${notification.isRead ? "bg-buddy-card-bg" : "bg-[#e6f3ff] dark:bg-[#1a3a5c]"}`}
    >
      <Link href={`/users/${notification.actor.id}`} className="mr-3 shrink-0">
        <Image
          src={notification.actor.photoUrl || "/images/profile.png"}
          alt={notification.actor.name}
          width={48}
          height={48}
          className="h-12 w-12 rounded-full object-cover"
        />
      </Link>
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-relaxed text-buddy-text-secondary">
          <Link href={`/users/${notification.actor.id}`} className="font-medium text-buddy-text-dark hover:underline">
            {notification.actor.name}
          </Link>{" "}
          sent you a friend request
        </p>
        <p className="mt-1 text-xs font-semibold text-buddy-primary">
          {formatRelativeTime(notification.createdAt)} ago
        </p>
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={onAccept}
            className="rounded-md bg-[#1890FF] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#40a9ff]"
          >
            Accept
          </button>
          <button
            type="button"
            onClick={onDecline}
            className="rounded-md border border-buddy-border-color bg-buddy-card-bg px-3 py-1.5 text-xs font-medium text-buddy-text-dark hover:bg-buddy-muted-bg"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};
