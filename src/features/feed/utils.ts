import { formatDistanceToNow } from "date-fns";

export const formatRelativeTime = (date: string | Date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: false });
};

export const getTotalReactions = (reactionCounts: Record<string, number>) => {
  return Object.values(reactionCounts).reduce((sum, count) => sum + (count || 0), 0);
};

export const getTopReactions = (reactionCounts: Record<string, number>, limit = 3) => {
  return Object.entries(reactionCounts)
    .filter(([, count]) => count > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([type]) => type);
};
