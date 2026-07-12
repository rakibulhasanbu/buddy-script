import registrationLight from "@/assets/images/registration.png";
import { AuthCard } from "@/features/auth/components/auth-card";
import { AuthIllustration } from "@/features/auth/components/auth-illustration";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { SignUpForm } from "@/features/auth/components/sign-up-form";

const Page = () => {
  return (
    <AuthLayout illustration={<AuthIllustration lightImage={registrationLight} alt="Registration illustration" />}>
      <AuthCard>
        <SignUpForm />
      </AuthCard>
    </AuthLayout>
  );
};

export default Page;
