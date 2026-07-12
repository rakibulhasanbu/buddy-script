import Image from "next/image";

import { AuthPageLayout } from "@/features/auth/components/auth-page-layout";
import { SignUpForm } from "@/features/auth/components/sign-up-form";

export default function SignUpPage() {
  return (
    <AuthPageLayout
      illustration={
        <div className="relative w-full max-w-[633px]">
          <Image
            src="/images/registration.png"
            alt="Registration illustration"
            width={633}
            height={500}
            className="h-auto w-full"
            priority
          />
        </div>
      }
    >
      <SignUpForm />
    </AuthPageLayout>
  );
}
