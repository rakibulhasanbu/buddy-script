"use client";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type CustomTextareaProps = {
  label?: string;
  placeholder: string;
  description?: string;
  disabled?: boolean;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  rows?: number;
  className?: string;
  error?: string;
};

export const CustomTextarea = ({
  label,
  disabled,
  placeholder,
  description,
  value,
  onChange,
  required,
  rows = 4,
  className,
  error,
}: CustomTextareaProps) => {
  return (
    <div className={cn("w-full space-y-1", className)}>
      {label && <Label htmlFor={label}>{label}</Label>}
      <Textarea
        id={label}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        className={`pr-4 pl-4`}
        rows={rows}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        required={required}
      />
      {description && <div className="text-[0.8rem] text-muted-foreground">{description}</div>}
      {error && <div className="text-sm font-medium text-destructive">{error}</div>}
    </div>
  );
};
