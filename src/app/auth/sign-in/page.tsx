import Image from "next/image";

import { AuthPageLayout } from "@/features/auth/components/auth-page-layout";
import { SignInForm } from "@/features/auth/components/sign-in-form";

export default function SignInPage() {
  return (
    <AuthPageLayout
      illustration={
        <div className="relative w-full max-w-[633px]">
          <Image
            src="/images/login.png"
            alt="Login illustration"
            width={633}
            height={500}
            className="h-auto w-full"
            priority
          />
        </div>
      }
    >
      <SignInForm />
    </AuthPageLayout>
  );
}
