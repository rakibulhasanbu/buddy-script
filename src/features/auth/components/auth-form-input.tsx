"use client";

import { useState } from "react";

import { Eye, EyeOff } from "lucide-react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

import { cn } from "@/lib/utils";

interface AuthFormInputProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "password";
  control: Control<T>;
  required?: boolean;
  autoComplete?: string;
}

export const AuthFormInput = <T extends FieldValues>({
  name,
  label,
  placeholder,
  type = "text",
  control,
  required,
  autoComplete,
}: AuthFormInputProps<T>) => {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (visible ? "text" : "password") : type;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="flex flex-col gap-2">
          <label htmlFor={name} className="text-base leading-snug font-medium text-buddy-text-secondary">
            {label}
            {required && <span className="ml-0.5 text-destructive">*</span>}
          </label>
          <div className="relative">
            <input
              {...field}
              id={name}
              type={inputType}
              placeholder={placeholder}
              autoComplete={autoComplete}
              aria-invalid={fieldState.invalid}
              className={cn(
                "h-12 w-full rounded-md border border-buddy-input-border bg-card px-4 text-sm text-buddy-text placeholder:text-[13px] placeholder:text-buddy-text focus:border-buddy-primary focus:outline-none",
                fieldState.invalid && "border-destructive"
              )}
            />
            {isPassword && (
              <button
                type="button"
                onClick={() => setVisible((prev) => !prev)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-buddy-text-secondary hover:text-buddy-primary"
                aria-label={visible ? "Hide password" : "Show password"}
              >
                {visible ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            )}
          </div>
          {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
        </div>
      )}
    />
  );
};
