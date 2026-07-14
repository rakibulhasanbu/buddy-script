import { EReactionType } from "@/features/feed/types";

export const REACTION_CONFIG: Record<
  EReactionType,
  {
    label: string;
    color: string;
    emoji: string;
  }
> = {
  [EReactionType.LIKE]: { label: "Like", color: "#1890FF", emoji: "👍" },
  [EReactionType.LOVE]: { label: "Love", color: "#FF4D4F", emoji: "❤️" },
  [EReactionType.HAHA]: { label: "Haha", color: "#FFCC4D", emoji: "😂" },
  [EReactionType.WOW]: { label: "Wow", color: "#FFCC4D", emoji: "😮" },
  [EReactionType.SAD]: { label: "Sad", color: "#FFCC4D", emoji: "😢" },
  [EReactionType.ANGRY]: { label: "Angry", color: "#FF4D4F", emoji: "😡" },
};

export const ReactionEmoji = ({ type, className }: { type: EReactionType | null; className?: string }) => {
  if (!type) return null;
  return <span className={className}>{REACTION_CONFIG[type].emoji}</span>;
};

export const ReactionLabel = ({
  type,
  hasReaction,
  className,
}: {
  type: EReactionType | null;
  hasReaction: boolean;
  className?: string;
}) => {
  if (!hasReaction || !type) {
    return (
      <span className={className}>
        <span className="mr-1">👍</span>Like
      </span>
    );
  }

  const config = REACTION_CONFIG[type];

  return (
    <span className={className} style={{ color: config.color }}>
      <span className="mr-1">{config.emoji}</span>
      {config.label}
    </span>
  );
};
