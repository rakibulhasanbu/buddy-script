export enum ENotificationType {
  FRIEND_REQUEST = "FRIEND_REQUEST",
  FRIEND_REQUEST_ACCEPTED = "FRIEND_REQUEST_ACCEPTED",
  POST_CREATED = "POST_CREATED",
  COMMENT_CREATED = "COMMENT_CREATED",
  REACTION_ON_POST = "REACTION_ON_POST",
  REACTION_ON_COMMENT = "REACTION_ON_COMMENT",
}

export enum ENotificationEntity {
  POST = "POST",
  COMMENT = "COMMENT",
  FRIENDSHIP = "FRIENDSHIP",
}

export type NotificationActor = {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  photoUrl: string | null;
};

export type NotificationGroup = {
  id: string;
  type: ENotificationType;
  entityType: ENotificationEntity | null;
  entityId: string | null;
  referenceId: string | null;
  actor: NotificationActor;
  actorCount: number;
  isRead: boolean;
  createdAt: string;
};

export type NotificationListResponse = {
  data: NotificationGroup[];
  meta: {
    nextCursor: string | null;
  };
};

export type UnreadCountResponse = {
  count: number;
};
