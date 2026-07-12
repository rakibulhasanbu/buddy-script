import { AuthWrapper } from "@/features/auth/components/auth-wrapper";
import { ForgotForm } from "@/features/auth/components/forgot-form";

const Page = () => {
  return (
    <AuthWrapper>
      <ForgotForm />
    </AuthWrapper>
  );
};

export default Page;
