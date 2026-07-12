import loginImage from "@/assets/images/login.png";
import { AuthCard } from "@/features/auth/components/auth-card";
import { AuthIllustration } from "@/features/auth/components/auth-illustration";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { SignInForm } from "@/features/auth/components/sign-in-form";

const Page = () => {
  return (
    <AuthLayout illustration={<AuthIllustration lightImage={loginImage} alt="Login illustration" />}>
      <AuthCard>
        <SignInForm />
      </AuthCard>
    </AuthLayout>
  );
};

export default Page;
