export enum EVisibility {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
}

export enum EReactionEntity {
  POST = "POST",
  COMMENT = "COMMENT",
}

export enum EReactionType {
  LIKE = "LIKE",
  LOVE = "LOVE",
  HAHA = "HAHA",
  WOW = "WOW",
  SAD = "SAD",
  ANGRY = "ANGRY",
}

export interface PostAuthor {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  photoUrl: string | null;
}

export interface Post {
  id: string;
  content: string;
  imageUrl: string | null;
  visibility: EVisibility;
  reactionCounts: Record<string, number>;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  author: PostAuthor;
  myReaction: EReactionType | null;
  isSaved?: boolean;
}

export interface FeedResponse {
  data: Post[];
  meta: {
    nextCursor: string | null;
  };
}

export interface CreatePostInput {
  content: string;
  imageUrl?: string;
  visibility?: EVisibility;
}

export interface UpdatePostInput {
  content?: string;
  imageUrl?: string | null;
  visibility?: EVisibility;
}

export interface CommentAuthor {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  photoUrl: string | null;
}

export interface Comment {
  id: string;
  postId: string;
  parentId: string | null;
  content: string;
  reactionCounts: Record<string, number>;
  replyCount: number;
  createdAt: string;
  updatedAt: string;
  author: CommentAuthor;
  myReaction: EReactionType | null;
}

export interface CommentListResponse {
  data: Comment[];
  meta: {
    nextCursor: string | null;
  };
}

export interface CreateCommentInput {
  postId: string;
  parentId?: string;
  content: string;
}

export interface UpdateCommentInput {
  content: string;
}

export interface ToggleReactionInput {
  entityType: EReactionEntity;
  entityId: string;
  type: EReactionType;
}

export interface ToggleReactionResult {
  action: "added" | "updated" | "removed";
  type: EReactionType | null;
}

export interface ReactedUser {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  photoUrl: string | null;
  type: EReactionType;
  createdAt: string;
}

export interface WhoReactedResponse {
  data: ReactedUser[];
  meta: {
    nextCursor: string | null;
  };
}

export interface UploadImageResponse {
  url: string;
}
