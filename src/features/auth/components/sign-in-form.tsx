"use client";

import { useState, useTransition } from "react";
import Link from "next/link";

import { loginAction } from "@/features/auth/actions";
import { AuthDivider } from "@/features/auth/components/auth-divider";
import { AuthFormInput } from "@/features/auth/components/auth-form-input";
import { AuthLink } from "@/features/auth/components/auth-link";
import { AuthLogoTitle } from "@/features/auth/components/auth-logo-title";
import { AuthSubmitButton } from "@/features/auth/components/auth-submit-button";
import { GoogleAuthButton } from "@/features/auth/components/google-auth-button";
import { useAuthSuccess } from "@/features/auth/hooks/use-auth-utils";
import { signInFormSchema } from "@/features/auth/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

type FormValues = z.infer<typeof signInFormSchema>;

export const SignInForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const onSuccess = useAuthSuccess();

  const onSubmit = (data: FormValues) => {
    setError(null);
    startTransition(async () => {
      const response = await loginAction(data.email.trim(), data.password.trim());

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
      <AuthLogoTitle subtitle="Welcome back" title="Login to your account" />

      <GoogleAuthButton label="Or sign-in with google" />

      <AuthDivider />

      <div className="flex flex-col gap-[14px]">
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
          autoComplete="current-password"
        />

        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="peer sr-only"
            />
            <span className="flex h-4 w-4 items-center justify-center rounded-full border border-buddy-text-secondary transition-colors peer-checked:border-buddy-primary peer-checked:bg-transparent">
              <span className="h-2 w-2 rounded-full bg-buddy-primary opacity-0 transition-opacity peer-checked:opacity-100" />
            </span>
            <span className="text-sm leading-snug font-normal text-buddy-text">Remember me</span>
          </label>
          <Link
            href="/auth/forgot-password"
            className="text-sm font-normal text-buddy-primary transition-colors hover:text-buddy-primary-hover"
          >
            Forgot password?
          </Link>
        </div>

        {error && <p className="text-center text-sm text-destructive">{error}</p>}

        <div className="mt-6">
          <AuthSubmitButton isLoading={isPending}>Login now</AuthSubmitButton>
        </div>
      </div>

      <AuthLink text="Don't have an account?" linkText="Create New Account" href="/auth/sign-up" />
    </form>
  );
};
