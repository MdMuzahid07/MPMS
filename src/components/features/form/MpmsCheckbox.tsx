"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Controller, useFormContext } from "react-hook-form";

interface MpmsCheckboxProps {
  name: string;
  label: string;
  className?: string;
  disabled?: boolean;
  description?: string;
}

const MpmsCheckbox = ({
  name,
  label,
  className,
  disabled = false,
  description,
}: MpmsCheckboxProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const hasError = !!errors[name];

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <input
              type="checkbox"
              id={name}
              className={cn(
                "h-4 w-4 cursor-pointer rounded text-green-600",
                disabled && "cursor-not-allowed opacity-50",
                hasError && "border-destructive",
              )}
              checked={field.value || false}
              onChange={field.onChange}
              disabled={disabled}
            />
          )}
        />
        <Label
          htmlFor={name}
          className={cn(
            "cursor-pointer font-normal",
            disabled && "cursor-not-allowed opacity-50",
            hasError && "text-destructive",
          )}
        >
          {label}
        </Label>
      </div>
      {description && !hasError && (
        <p className="text-muted-foreground ml-6 text-sm">{description}</p>
      )}
      {hasError && (
        <p className="text-destructive ml-6 text-sm">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
};

export default MpmsCheckbox;
