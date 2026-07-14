"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { loginAction } from "@/features/auth/actions";
import { useAuthSuccess } from "@/features/auth/hooks/use-auth-utils";
import { signInFormSchema } from "@/features/auth/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type SignInFormValues = z.infer<typeof signInFormSchema>;

export const SignInForm = () => {
  const [remember, setRemember] = useState(true);
  const onAuthSuccess = useAuthSuccess();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignInFormValues) => {
    const result = await loginAction(values.email, values.password);

    if (result.status === "error") {
      toast.error(result.error || "Failed to login");
      return;
    }

    toast.success("Logged in successfully");

    const { accessToken, refreshToken, user } = result.data;
    onAuthSuccess({ accessToken, refreshToken, user });
  };

  return (
    <div className="rounded-md bg-buddy-card-bg p-12">
      <div className="mx-auto mb-7 max-w-[161px]">
        <Image src="/images/logo.svg" alt="Buddy Script" width={161} height={40} className="h-auto w-[161px]" />
      </div>
      <p className="mb-2 text-center text-base leading-snug font-normal text-buddy-text">Welcome back</p>
      <h4 className="mb-[50px] text-center text-[28px] font-medium text-buddy-text-dark">Login to your account</h4>

      <button
        type="button"
        className="mb-10 flex w-full items-center justify-center rounded-md border border-buddy-border-color bg-buddy-card-bg px-[60px] py-3 transition-shadow hover:shadow-md"
      >
        <Image src="/images/google.svg" alt="Google" width={20} height={20} className="mr-2 h-5 w-5" />
        <span className="text-base leading-snug font-medium whitespace-nowrap text-buddy-text-dark">
          Or sign-in with google
        </span>
      </button>

      <div className="relative mb-10 text-center">
        <span className="relative z-10 bg-buddy-card-bg px-2 text-sm leading-snug font-normal text-buddy-text-muted">
          Or
        </span>
        <span className="absolute top-1/2 left-0 h-[2px] w-[108px] -translate-y-1/2 bg-buddy-border-color" />
        <span className="absolute top-1/2 right-0 h-[2px] w-[108px] -translate-y-1/2 bg-buddy-border-color" />
      </div>

      <form className="w-full" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-[14px]">
          <label className="mb-2 block text-base leading-snug font-medium text-buddy-text">Email</label>
          <input
            type="email"
            {...register("email")}
            className="h-12 w-full rounded-md border border-buddy-input-border bg-buddy-page-bg px-4 text-sm text-buddy-text outline-none placeholder:text-[13px] placeholder:font-normal placeholder:text-buddy-text-muted"
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
        </div>
        <div className="mb-[14px]">
          <label className="mb-2 block text-base leading-snug font-medium text-buddy-text">Password</label>
          <input
            type="password"
            {...register("password")}
            className="h-12 w-full rounded-md border border-buddy-input-border bg-buddy-page-bg px-4 text-sm text-buddy-text outline-none placeholder:text-[13px] placeholder:font-normal placeholder:text-buddy-text-muted"
          />
          {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="peer sr-only"
            />
            <span className="flex h-4 w-4 items-center justify-center rounded-full border border-buddy-text-secondary transition-colors peer-checked:border-[#1890FF] peer-checked:bg-transparent">
              <span className="h-2 w-2 rounded-full bg-[#1890FF] opacity-0 transition-opacity peer-checked:opacity-100" />
            </span>
            <span className="text-sm leading-snug font-normal text-buddy-text">Remember me</span>
          </label>
          <Link href="#0" className="text-sm leading-snug font-normal text-buddy-primary">
            Forgot password?
          </Link>
        </div>

        <div className="mt-10 mb-[60px]">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full cursor-pointer rounded-md border border-transparent bg-[#1890FF] px-[116px] py-3 text-base font-medium text-white transition-shadow hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Logging in..." : "Login now"}
          </button>
        </div>
      </form>

      <p className="text-center text-sm text-buddy-text">
        Dont have an account?{" "}
        <Link href="/auth/sign-up" className="text-buddy-primary">
          Create New Account
        </Link>
      </p>
    </div>
  );
};
