interface AuthSubmitButtonProps {
  children: React.ReactNode;
  isLoading?: boolean;
}

export const AuthSubmitButton = ({ children, isLoading }: AuthSubmitButtonProps) => {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="w-full rounded-md bg-buddy-primary px-8 py-3 text-base font-medium text-white transition-shadow hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
};
