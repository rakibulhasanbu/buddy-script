import { FeedResponse } from "@/features/feed/types";
import { api } from "@/redux/api";
import { METHOD, ResponseObject, TagType } from "@/redux/types";

import { ProfileUser, PublicProfileUser, UpdateProfileInput } from "./types";

const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<ResponseObject<ProfileUser>, void>({
      query: () => ({
        url: "/user/me",
        method: METHOD.GET,
      }),
      providesTags: [TagType.User],
    }),
    getUserById: builder.query<ResponseObject<PublicProfileUser>, string>({
      query: (id) => ({
        url: `/user/${id}`,
        method: METHOD.GET,
      }),
      providesTags: (result, error, id) => [{ type: TagType.User, id }],
    }),
    updateMe: builder.mutation<ResponseObject<ProfileUser>, UpdateProfileInput>({
      query: (body) => ({
        url: "/user/me",
        method: METHOD.PATCH,
        body,
      }),
      invalidatesTags: [TagType.User],
    }),
    getUserPosts: builder.query<ResponseObject<FeedResponse>, { userId: string; cursor?: string; limit?: number }>({
      query: ({ userId, cursor, limit }) => ({
        url: `/posts/user/${userId}`,
        method: METHOD.GET,
        params: { cursor, limit },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.data.map(({ id }) => ({ type: TagType.Post, id }) as const),
              { type: TagType.Post, id: "USER_POSTS" },
            ]
          : [{ type: TagType.Post, id: "USER_POSTS" }],
    }),
  }),
});

export const { useGetMeQuery, useGetUserByIdQuery, useUpdateMeMutation, useGetUserPostsQuery } = userApi;
