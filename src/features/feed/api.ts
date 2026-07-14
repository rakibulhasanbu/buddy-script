import {
  Comment,
  CommentListResponse,
  CreateCommentInput,
  CreatePostInput,
  EReactionEntity,
  FeedResponse,
  Post,
  ToggleReactionInput,
  ToggleReactionResult,
  UpdateCommentInput,
  UpdatePostInput,
  UploadImageResponse,
  WhoReactedResponse,
} from "@/features/feed/types";
import { api } from "@/redux/api";
import { METHOD, ResponseObject, TagType } from "@/redux/types";

const feedApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getFeed: builder.query<ResponseObject<FeedResponse>, { cursor?: string; limit?: number }>({
      query: ({ cursor, limit }) => ({
        url: `/posts`,
        method: METHOD.GET,
        params: { cursor, limit },
      }),
      serializeQueryArgs: ({ endpointName }) => endpointName,
      merge: (currentCache, newItems, { arg }) => {
        if (!arg?.cursor) {
          currentCache.data.data = newItems.data.data;
        } else {
          currentCache.data.data.push(...newItems.data.data);
        }
        currentCache.data.meta.nextCursor = newItems.data.meta.nextCursor;
      },
      forceRefetch: ({ currentArg, previousArg }) => currentArg?.cursor !== previousArg?.cursor,
      providesTags: (result) =>
        result
          ? [
              ...result.data.data.map(({ id }) => ({ type: TagType.Post, id }) as const),
              { type: TagType.Post, id: "LIST" },
            ]
          : [{ type: TagType.Post, id: "LIST" }],
    }),

    getPost: builder.query<ResponseObject<Post>, string>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: METHOD.GET,
      }),
      providesTags: (result, error, id) => [{ type: TagType.Post, id }],
    }),

    savePost: builder.mutation<ResponseObject<{ isSaved: boolean }>, string>({
      query: (id) => ({
        url: `/posts/${id}/save`,
        method: METHOD.POST,
      }),
      invalidatesTags: (result, error, id) => [
        { type: TagType.Post, id },
        { type: TagType.Post, id: "SAVED" },
      ],
    }),

    unsavePost: builder.mutation<void, string>({
      query: (id) => ({
        url: `/posts/${id}/save`,
        method: METHOD.DELETE,
      }),
      invalidatesTags: (result, error, id) => [
        { type: TagType.Post, id },
        { type: TagType.Post, id: "SAVED" },
      ],
    }),

    getSavedPosts: builder.query<ResponseObject<FeedResponse>, { cursor?: string; limit?: number }>({
      query: ({ cursor, limit }) => ({
        url: `/posts/saved`,
        method: METHOD.GET,
        params: { cursor, limit },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.data.map(({ id }) => ({ type: TagType.Post, id }) as const),
              { type: TagType.Post, id: "SAVED" },
            ]
          : [{ type: TagType.Post, id: "SAVED" }],
    }),

    createPost: builder.mutation<ResponseObject<Post>, CreatePostInput>({
      query: (body) => ({
        url: `/posts`,
        method: METHOD.POST,
        body,
      }),
      invalidatesTags: [{ type: TagType.Post, id: "LIST" }],
    }),

    updatePost: builder.mutation<ResponseObject<Post>, { id: string; body: UpdatePostInput }>({
      query: ({ id, body }) => ({
        url: `/posts/${id}`,
        method: METHOD.PATCH,
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: TagType.Post, id },
        { type: TagType.Post, id: "LIST" },
      ],
    }),

    deletePost: builder.mutation<void, string>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: METHOD.DELETE,
      }),
      invalidatesTags: [{ type: TagType.Post, id: "LIST" }],
    }),

    uploadImage: builder.mutation<ResponseObject<UploadImageResponse>, FormData>({
      query: (body) => ({
        url: `/file-upload/upload-image`,
        method: METHOD.POST,
        body,
      }),
    }),

    getCommentsByPost: builder.query<
      ResponseObject<CommentListResponse>,
      { postId: string; cursor?: string; limit?: number }
    >({
      query: ({ postId, cursor, limit }) => ({
        url: `/comments/post/${postId}`,
        method: METHOD.GET,
        params: { cursor, limit },
      }),
      providesTags: (result, error, { postId }) => [{ type: TagType.Comment, id: postId }],
    }),

    getRepliesByComment: builder.query<
      ResponseObject<CommentListResponse>,
      { commentId: string; cursor?: string; limit?: number }
    >({
      query: ({ commentId, cursor, limit }) => ({
        url: `/comments/${commentId}/replies`,
        method: METHOD.GET,
        params: { cursor, limit },
      }),
      providesTags: (result, error, { commentId }) => [{ type: TagType.Comment, id: `REPLIES-${commentId}` }],
    }),

    createComment: builder.mutation<ResponseObject<Comment>, CreateCommentInput>({
      query: (body) => ({
        url: `/comments`,
        method: METHOD.POST,
        body,
      }),
      invalidatesTags: (result, error, { postId, parentId }) => [
        { type: TagType.Comment, id: postId },
        ...(parentId ? [{ type: TagType.Comment, id: `REPLIES-${parentId}` }] : []),
        { type: TagType.Post, id: "LIST" },
      ],
    }),

    updateComment: builder.mutation<ResponseObject<Comment>, { id: string; body: UpdateCommentInput }>({
      query: ({ id, body }) => ({
        url: `/comments/${id}`,
        method: METHOD.PATCH,
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: TagType.Comment, id: result?.data.postId || id }],
    }),

    deleteComment: builder.mutation<void, { id: string; postId: string; parentId?: string | null }>({
      query: ({ id }) => ({
        url: `/comments/${id}`,
        method: METHOD.DELETE,
      }),
      invalidatesTags: (result, error, { postId, parentId }) => [
        { type: TagType.Comment, id: postId },
        ...(parentId ? [{ type: TagType.Comment, id: `REPLIES-${parentId}` }] : []),
        { type: TagType.Post, id: "LIST" },
      ],
    }),

    toggleReaction: builder.mutation<ResponseObject<ToggleReactionResult>, ToggleReactionInput>({
      query: (body) => ({
        url: `/reactions/toggle`,
        method: METHOD.POST,
        body,
      }),
      async onQueryStarted({ entityType, entityId, type }, { dispatch, queryFulfilled, getState }) {
        const patchResults: { undo: () => void }[] = [];

        if (entityType === EReactionEntity.POST) {
          const feedArgs = feedApi.util.selectCachedArgsForQuery(getState(), "getFeed");
          feedArgs.forEach((arg) => {
            patchResults.push(
              dispatch(
                feedApi.util.updateQueryData("getFeed", arg, (draft) => {
                  const post = draft.data.data.find((p) => p.id === entityId);
                  if (post) {
                    updateReactionInDraft(post, type);
                  }
                })
              )
            );
          });

          const postArgs = feedApi.util.selectCachedArgsForQuery(getState(), "getPost");
          postArgs.forEach((arg) => {
            patchResults.push(
              dispatch(
                feedApi.util.updateQueryData("getPost", arg, (draft) => {
                  if (draft.data.id === entityId) {
                    updateReactionInDraft(draft.data, type);
                  }
                })
              )
            );
          });
        }

        if (entityType === EReactionEntity.COMMENT) {
          const commentListArgs = feedApi.util.selectCachedArgsForQuery(getState(), "getCommentsByPost");
          commentListArgs.forEach((arg) => {
            patchResults.push(
              dispatch(
                feedApi.util.updateQueryData("getCommentsByPost", arg, (draft) => {
                  const comment = draft.data.data.find((c) => c.id === entityId);
                  if (comment) {
                    updateReactionInDraft(comment, type);
                  }
                })
              )
            );
          });

          const replyListArgs = feedApi.util.selectCachedArgsForQuery(getState(), "getRepliesByComment");
          replyListArgs.forEach((arg) => {
            patchResults.push(
              dispatch(
                feedApi.util.updateQueryData("getRepliesByComment", arg, (draft) => {
                  const reply = draft.data.data.find((c) => c.id === entityId);
                  if (reply) {
                    updateReactionInDraft(reply, type);
                  }
                })
              )
            );
          });
        }

        try {
          await queryFulfilled;
        } catch {
          patchResults.forEach((result) => result.undo());
        }
      },
    }),

    getWhoReacted: builder.query<
      ResponseObject<WhoReactedResponse>,
      { entityType: EReactionEntity; entityId: string; cursor?: string; limit?: number }
    >({
      query: ({ entityType, entityId, cursor, limit }) => ({
        url: `/reactions/${entityType}/${entityId}`,
        method: METHOD.GET,
        params: { cursor, limit },
      }),
    }),
  }),
});

function updateReactionInDraft(
  entity: { myReaction: string | null; reactionCounts: Record<string, number> },
  type: string
) {
  const previousType = entity.myReaction;

  if (previousType === type) {
    entity.myReaction = null;
    entity.reactionCounts[type] = Math.max((entity.reactionCounts[type] || 0) - 1, 0);
  } else {
    entity.myReaction = type;
    if (previousType) {
      entity.reactionCounts[previousType] = Math.max((entity.reactionCounts[previousType] || 0) - 1, 0);
    }
    entity.reactionCounts[type] = (entity.reactionCounts[type] || 0) + 1;
  }
}

export const {
  useGetFeedQuery,
  useLazyGetFeedQuery,
  useGetPostQuery,
  useSavePostMutation,
  useUnsavePostMutation,
  useGetSavedPostsQuery,
  useLazyGetSavedPostsQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useUploadImageMutation,
  useGetCommentsByPostQuery,
  useLazyGetCommentsByPostQuery,
  useGetRepliesByCommentQuery,
  useLazyGetRepliesByCommentQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useToggleReactionMutation,
  useGetWhoReactedQuery,
  useLazyGetWhoReactedQuery,
} = feedApi;
