export const AuthDivider = () => {
  return (
    <div className="relative mb-10 text-center">
      <span className="relative z-[1] inline-block bg-card px-4 text-sm leading-snug font-normal text-buddy-text-muted">
        Or
      </span>
      <div className="absolute top-1/2 left-0 h-[2px] w-full -translate-y-1/2">
        <div className="mx-auto h-full w-[108px] border border-buddy-border-color" />
      </div>
    </div>
  );
};
