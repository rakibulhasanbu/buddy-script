interface AuthCardProps {
  children: React.ReactNode;
}

export const AuthCard = ({ children }: AuthCardProps) => {
  return <div className="rounded-md bg-card p-12 shadow-buddy-md">{children}</div>;
};
