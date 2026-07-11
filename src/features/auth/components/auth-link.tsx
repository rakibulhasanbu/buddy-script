import Link from "next/link";

interface AuthLinkProps {
  text: string;
  linkText: string;
  href: string;
}

export const AuthLink = ({ text, linkText, href }: AuthLinkProps) => {
  return (
    <p className="text-center text-sm text-buddy-text">
      {text}{" "}
      <Link href={href} className="font-medium text-buddy-primary transition-colors hover:text-buddy-primary-hover">
        {linkText}
      </Link>
    </p>
  );
};
