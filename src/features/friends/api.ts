import { api } from "@/redux/api";
import { METHOD, ResponseObject, TagType } from "@/redux/types";

import { FriendListResponse, Friendship, SendFriendRequestInput, SuggestionListResponse } from "./types";

const friendsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getFriends: builder.query<ResponseObject<FriendListResponse>, { search?: string }>({
      query: ({ search }) => ({
        url: "/friendships/friends",
        method: METHOD.GET,
        params: search ? { search } : undefined,
      }),
      providesTags: [TagType.User],
    }),
    getPendingRequests: builder.query<ResponseObject<FriendListResponse>, void>({
      query: () => ({
        url: "/friendships/pending",
        method: METHOD.GET,
      }),
      providesTags: [TagType.User],
    }),
    getSuggestions: builder.query<ResponseObject<SuggestionListResponse>, void>({
      query: () => ({
        url: "/friendships/suggestions",
        method: METHOD.GET,
      }),
      providesTags: [TagType.User],
    }),
    sendFriendRequest: builder.mutation<ResponseObject<Friendship>, SendFriendRequestInput>({
      query: (body) => ({
        url: "/friendships/request",
        method: METHOD.POST,
        body,
      }),
      invalidatesTags: [TagType.User],
    }),
    acceptFriendRequest: builder.mutation<ResponseObject<Friendship>, string>({
      query: (id) => ({
        url: `/friendships/${id}/accept`,
        method: METHOD.PATCH,
      }),
      invalidatesTags: [TagType.User],
    }),
    declineFriendRequest: builder.mutation<ResponseObject<Friendship>, string>({
      query: (id) => ({
        url: `/friendships/${id}/decline`,
        method: METHOD.PATCH,
      }),
      invalidatesTags: [TagType.User],
    }),
    cancelFriendRequest: builder.mutation<ResponseObject<void>, string>({
      query: (id) => ({
        url: `/friendships/${id}`,
        method: METHOD.DELETE,
      }),
      invalidatesTags: [TagType.User],
    }),
  }),
});

export const {
  useGetFriendsQuery,
  useGetPendingRequestsQuery,
  useGetSuggestionsQuery,
  useSendFriendRequestMutation,
  useAcceptFriendRequestMutation,
  useDeclineFriendRequestMutation,
  useCancelFriendRequestMutation,
} = friendsApi;
