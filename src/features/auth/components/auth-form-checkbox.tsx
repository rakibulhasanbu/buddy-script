"use client";

import { Control, Controller, FieldValues, Path } from "react-hook-form";

import { cn } from "@/lib/utils";

interface AuthFormCheckboxProps<T extends FieldValues> {
  name: Path<T>;
  label: React.ReactNode;
  control: Control<T>;
}

export const AuthFormCheckbox = <T extends FieldValues>({ name, label, control }: AuthFormCheckboxProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="flex flex-col gap-1">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              className={cn("peer sr-only")}
            />
            <span
              className={cn(
                "flex h-4 w-4 items-center justify-center rounded-full border border-buddy-text-secondary transition-colors peer-checked:border-buddy-primary peer-checked:bg-transparent",
                fieldState.invalid && "border-destructive"
              )}
            >
              <span className="h-2 w-2 rounded-full bg-buddy-primary opacity-0 transition-opacity peer-checked:opacity-100" />
            </span>
            <span className="text-sm leading-snug font-normal text-buddy-text">{label}</span>
          </label>
          {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
        </div>
      )}
    />
  );
};
