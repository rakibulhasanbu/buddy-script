import { api } from "@/redux/api";
import { METHOD, ResponseObject, TagType } from "@/redux/types";

import { NotificationListResponse, UnreadCountResponse } from "./types";

const notificationsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<
      ResponseObject<NotificationListResponse>,
      { cursor?: string; limit?: number; unreadOnly?: boolean }
    >({
      query: ({ cursor, limit, unreadOnly }) => ({
        url: "/notifications",
        method: METHOD.GET,
        params: { cursor, limit, unreadOnly: unreadOnly ? "true" : undefined },
      }),
      providesTags: [TagType.Notification],
    }),

    getUnreadNotificationCount: builder.query<ResponseObject<UnreadCountResponse>, void>({
      query: () => ({
        url: "/notifications/unread-count",
        method: METHOD.GET,
      }),
      providesTags: [TagType.Notification],
    }),

    markNotificationAsRead: builder.mutation<ResponseObject<null>, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: METHOD.PATCH,
      }),
      invalidatesTags: [TagType.Notification],
    }),

    markAllNotificationsAsRead: builder.mutation<ResponseObject<null>, void>({
      query: () => ({
        url: "/notifications/mark-all-read",
        method: METHOD.PATCH,
      }),
      invalidatesTags: [TagType.Notification],
    }),

    deleteNotification: builder.mutation<ResponseObject<null>, string>({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: METHOD.DELETE,
      }),
      invalidatesTags: [TagType.Notification],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useLazyGetNotificationsQuery,
  useGetUnreadNotificationCountQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
} = notificationsApi;
