"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useGetRepliesByCommentQuery,
  useToggleReactionMutation,
  useUpdateCommentMutation,
} from "@/features/feed/api";
import { CommentBox } from "@/features/feed/components/comment-box";
import { REACTION_CONFIG, ReactionEmoji, ReactionLabel } from "@/features/feed/components/reaction-assets";
import { ReactionPicker } from "@/features/feed/components/reaction-picker";
import { WhoReactedModal } from "@/features/feed/components/who-reacted-modal";
import { Comment, EReactionEntity, EReactionType } from "@/features/feed/types";
import { formatRelativeTime, getTopReactions, getTotalReactions } from "@/features/feed/utils";
import { AlertType } from "@/providers/AlertProvider";
import { useAppSelector } from "@/redux/hook";
import { toast } from "sonner";

import { useAlert } from "@/hooks/use-alert";
import { Spinner } from "@/components/ui/spinner";

interface CommentItemProps {
  comment: Comment;
  postId: string;
  depth?: number;
}

export const CommentItem = ({ comment, postId, depth = 0 }: CommentItemProps) => {
  const currentUser = useAppSelector((state) => state.auth.user);
  const isAuthor = currentUser?.id === comment.author.id;
  const { fire } = useAlert();

  const [showReplies, setShowReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const [showWhoReacted, setShowWhoReacted] = useState(false);

  const { data: repliesData, isLoading: isLoadingReplies } = useGetRepliesByCommentQuery(
    { commentId: comment.id },
    { skip: !showReplies }
  );
  const [createReply, { isLoading: isCreatingReply }] = useCreateCommentMutation();
  const [updateComment, { isLoading: isUpdating }] = useUpdateCommentMutation();
  const [deleteComment, { isLoading: isDeleting }] = useDeleteCommentMutation();
  const [toggleReaction] = useToggleReactionMutation();

  const replies = repliesData?.data.data || [];
  const totalReactions = getTotalReactions(comment.reactionCounts);
  const topReactions = getTopReactions(comment.reactionCounts);

  const handleReact = (type: EReactionType) => {
    toggleReaction({ entityType: EReactionEntity.COMMENT, entityId: comment.id, type });
  };

  const handleReply = async () => {
    if (!replyText.trim()) return;
    try {
      await createReply({ postId, parentId: comment.id, content: replyText.trim() }).unwrap();
      setReplyText("");
      setShowReplyInput(false);
      setShowReplies(true);
    } catch {
      toast.error("Failed to add reply");
    }
  };

  const handleUpdate = async () => {
    if (!editText.trim()) return;
    try {
      await updateComment({ id: comment.id, body: { content: editText.trim() } }).unwrap();
      setIsEditing(false);
    } catch {
      toast.error("Failed to update comment");
    }
  };

  const handleDelete = () => {
    fire({
      title: "Delete comment?",
      text: "This action cannot be undone.",
      type: AlertType.ERROR,
      confirmButtonOptions: { text: "Delete", variant: "destructive" },
      onConfirm: async () => {
        try {
          await deleteComment({ id: comment.id, postId, parentId: comment.parentId }).unwrap();
        } catch {
          toast.error("Failed to delete comment");
        }
      },
    });
  };

  return (
    <div className={`flex gap-3 ${depth > 0 ? "mt-3" : ""}`}>
      <div className="shrink-0">
        <Link href={`/users/${comment.author.id}`}>
          <Image
            src={comment.author.photoUrl || "/images/txt_img.png"}
            alt={comment.author.name}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />
        </Link>
      </div>
      <div className="flex-1">
        <div>
          <Link href={`/users/${comment.author.id}`} className="mb-1 hover:underline">
            <h4 className="text-sm font-medium text-buddy-text-dark">{comment.author.name}</h4>
          </Link>

          {isEditing ? (
            <div className="mb-2">
              <CommentBox
                value={editText}
                onChange={setEditText}
                onSubmit={handleUpdate}
                onCancel={() => {
                  setIsEditing(false);
                  setEditText(comment.content);
                }}
                isLoading={isUpdating}
                autoFocus
              />
            </div>
          ) : (
            <div className="mb-1">
              <p className="text-sm leading-relaxed text-buddy-text-secondary">
                <span>{comment.content}</span>
              </p>
            </div>
          )}

          {totalReactions > 0 && (
            <button
              type="button"
              onClick={() => setShowWhoReacted(true)}
              className="mb-1 flex cursor-pointer items-center gap-1"
            >
              <div className="flex">
                {topReactions.map((type) => (
                  <span key={type} className="-ml-1 first:ml-0">
                    <ReactionEmoji type={type as EReactionType} />
                  </span>
                ))}
              </div>
              <span className="text-sm text-buddy-text-dark">{totalReactions}</span>
            </button>
          )}

          {!isEditing && (
            <div className="mb-2">
              <ul className="flex items-center gap-1 text-sm text-buddy-text-secondary">
                <li>
                  <ReactionPicker onReact={handleReact}>
                    <button
                      type="button"
                      onClick={() => handleReact(EReactionType.LIKE)}
                      className={`cursor-pointer ${comment.myReaction ? "font-medium" : ""}`}
                      style={{ color: comment.myReaction ? REACTION_CONFIG[comment.myReaction].color : undefined }}
                    >
                      <ReactionLabel type={comment.myReaction} hasReaction={!!comment.myReaction} />
                    </button>
                  </ReactionPicker>
                </li>
                <li>
                  <button type="button" onClick={() => setShowReplyInput((prev) => !prev)} className="cursor-pointer">
                    Reply.
                  </button>
                </li>
                {isAuthor && (
                  <>
                    <li>
                      <button type="button" onClick={() => setIsEditing(true)} className="cursor-pointer">
                        Edit.
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="cursor-pointer text-destructive disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </li>
                  </>
                )}
                <li>
                  <span className="text-primary">.{formatRelativeTime(comment.createdAt)}</span>
                </li>
              </ul>
            </div>
          )}
        </div>

        {showReplyInput && (
          <div className="mb-3">
            <CommentBox
              value={replyText}
              onChange={setReplyText}
              onSubmit={handleReply}
              isLoading={isCreatingReply}
              placeholder="Write a reply"
              autoFocus
              onCancel={() => setShowReplyInput(false)}
            />
          </div>
        )}

        {comment.replyCount > 0 && (
          <button
            type="button"
            onClick={() => setShowReplies((prev) => !prev)}
            className="mb-2 cursor-pointer text-sm font-medium text-buddy-primary"
          >
            {showReplies ? "Hide replies" : `View ${comment.replyCount} reply${comment.replyCount === 1 ? "" : "ies"}`}
          </button>
        )}

        {showReplies && (
          <div className="mt-2 pl-2">
            {isLoadingReplies ? (
              <div className="flex justify-center py-2">
                <Spinner className="h-4 w-4" />
              </div>
            ) : (
              replies.map((reply) => <CommentItem key={reply.id} comment={reply} postId={postId} depth={depth + 1} />)
            )}
          </div>
        )}
      </div>

      <WhoReactedModal
        open={showWhoReacted}
        onOpenChange={setShowWhoReacted}
        entityType={EReactionEntity.COMMENT}
        entityId={comment.id}
      />
    </div>
  );
};
