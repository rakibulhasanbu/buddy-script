import { api } from "@/redux/api";
import { METHOD, PaginatedResponse, QueryParams, ResponseObject, TagType } from "@/redux/types";

import { Friendship, FriendUser, SendFriendRequestInput } from "./types";

const friendsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getFriends: builder.query<PaginatedResponse<Friendship>, QueryParams>({
      query: (params) => ({
        url: "/friendships/friends",
        method: METHOD.GET,
        params,
      }),
      providesTags: [TagType.User],
    }),
    getPendingRequests: builder.query<PaginatedResponse<Friendship>, QueryParams>({
      query: (params) => ({
        url: "/friendships/pending",
        method: METHOD.GET,
        params,
      }),
      providesTags: [TagType.User],
    }),
    getSuggestions: builder.query<PaginatedResponse<FriendUser>, QueryParams>({
      query: (params) => ({
        url: "/friendships/suggestions",
        method: METHOD.GET,
        params,
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
