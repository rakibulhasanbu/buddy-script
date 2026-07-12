import { AuthWrapper } from "@/features/auth/components/auth-wrapper";
import OTPVerifyForm from "@/features/auth/components/otp-form";

const Page = () => {
  return (
    <AuthWrapper>
      <OTPVerifyForm />
    </AuthWrapper>
  );
};

export default Page;
