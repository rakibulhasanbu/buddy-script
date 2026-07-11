"use client";

import { useState, useTransition } from "react";

import { registerAction } from "@/features/auth/actions";
import { AuthDivider } from "@/features/auth/components/auth-divider";
import { AuthFormCheckbox } from "@/features/auth/components/auth-form-checkbox";
import { AuthFormInput } from "@/features/auth/components/auth-form-input";
import { AuthLink } from "@/features/auth/components/auth-link";
import { AuthLogoTitle } from "@/features/auth/components/auth-logo-title";
import { AuthSubmitButton } from "@/features/auth/components/auth-submit-button";
import { GoogleAuthButton } from "@/features/auth/components/google-auth-button";
import { useAuthSuccess } from "@/features/auth/hooks/use-auth-utils";
import { signUpFormSchema } from "@/features/auth/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

type FormValues = z.infer<typeof signUpFormSchema>;

export const SignUpForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const onSuccess = useAuthSuccess();

  const onSubmit = (data: FormValues) => {
    setError(null);
    startTransition(async () => {
      const response = await registerAction({
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim(),
        password: data.password.trim(),
      });

      if (response.status === "success") {
        onSuccess({
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
          user: response.data.user,
        });
      } else {
        setError(response.error || "Something went wrong");
      }
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <AuthLogoTitle subtitle="Get Started Now" title="Registration" />

      <GoogleAuthButton label="Register with google" />

      <AuthDivider />

      <div className="flex flex-col gap-[14px]">
        <div className="grid grid-cols-1 gap-[14px] sm:grid-cols-2">
          <AuthFormInput
            name="firstName"
            label="First Name"
            placeholder="Enter first name"
            type="text"
            control={form.control}
            required
            autoComplete="given-name"
          />
          <AuthFormInput
            name="lastName"
            label="Last Name"
            placeholder="Enter last name"
            type="text"
            control={form.control}
            required
            autoComplete="family-name"
          />
        </div>

        <AuthFormInput
          name="email"
          label="Email"
          placeholder="Enter your email"
          type="email"
          control={form.control}
          required
          autoComplete="email"
        />

        <AuthFormInput
          name="password"
          label="Password"
          placeholder="Enter your password"
          type="password"
          control={form.control}
          required
          autoComplete="new-password"
        />

        <AuthFormInput
          name="confirmPassword"
          label="Repeat Password"
          placeholder="Repeat your password"
          type="password"
          control={form.control}
          required
          autoComplete="new-password"
        />

        <AuthFormCheckbox name="terms" label="I agree to terms & conditions" control={form.control} />

        {error && <p className="text-center text-sm text-destructive">{error}</p>}

        <div className="mt-6">
          <AuthSubmitButton isLoading={isPending}>Login now</AuthSubmitButton>
        </div>
      </div>

      <AuthLink text="Already have an account?" linkText="Sign In" href="/auth/sign-in" />
    </form>
  );
};
