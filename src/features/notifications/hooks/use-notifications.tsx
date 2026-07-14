"use client";

import { useCallback, useMemo, useState } from "react";

import {
  useGetNotificationsQuery,
  useGetUnreadNotificationCountQuery,
  useLazyGetNotificationsQuery,
  useMarkAllNotificationsAsReadMutation,
  useMarkNotificationAsReadMutation,
} from "@/features/notifications/api";
import { NotificationGroup } from "@/features/notifications/types";

const DEFAULT_LIMIT = 20;

type PageState = {
  groups: NotificationGroup[];
  nextCursor: string | null;
};

export const useNotifications = () => {
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const [extraPages, setExtraPages] = useState<PageState[]>([]);

  const {
    data: notificationsData,
    isLoading,
    isFetching,
  } = useGetNotificationsQuery({
    limit: DEFAULT_LIMIT,
    unreadOnly: activeTab === "unread",
  });

  const { data: unreadCountData } = useGetUnreadNotificationCountQuery();

  const [fetchMore] = useLazyGetNotificationsQuery();
  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAllAsRead] = useMarkAllNotificationsAsReadMutation();

  const firstPage: PageState = useMemo(
    () => ({
      groups: notificationsData?.data.data ?? [],
      nextCursor: notificationsData?.data.meta.nextCursor ?? null,
    }),
    [notificationsData]
  );

  const pages = useMemo(() => [firstPage, ...extraPages], [firstPage, extraPages]);

  const groups = useMemo(() => pages.flatMap((page) => page.groups), [pages]);

  const hasMore = pages[pages.length - 1]?.nextCursor;

  const unreadCount = unreadCountData?.data.count ?? 0;

  const setActiveTabWithReset = useCallback((tab: "all" | "unread") => {
    setActiveTab(tab);
    setExtraPages([]);
  }, []);

  const loadMore = useCallback(async () => {
    const cursor = pages[pages.length - 1]?.nextCursor;
    if (!cursor) return;

    const response = await fetchMore({
      cursor,
      limit: DEFAULT_LIMIT,
      unreadOnly: activeTab === "unread",
    });

    const newGroups = response.data?.data.data ?? [];
    const nextCursor = response.data?.data.meta.nextCursor ?? null;

    if (newGroups.length > 0 || nextCursor) {
      setExtraPages((prev) => [...prev, { groups: newGroups, nextCursor }]);
    }
  }, [pages, fetchMore, activeTab]);

  const handleMarkAsRead = useCallback(
    async (groupId: string) => {
      await markAsRead(groupId);
    },
    [markAsRead]
  );

  const handleMarkAllAsRead = useCallback(async () => {
    await markAllAsRead();
  }, [markAllAsRead]);

  return {
    activeTab,
    setActiveTab: setActiveTabWithReset,
    groups,
    isLoading,
    isFetching,
    unreadCount,
    hasMore,
    loadMore,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
  };
};
