"use client";

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
    <div className={cn("space-y-1", className)}>
      <div className="flex items-start gap-2">
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <input
              type="checkbox"
              id={name}
              className={cn(
                "mt-1 h-4 w-4 cursor-pointer rounded border border-slate-300 bg-white text-indigo-600 focus:ring-indigo-500/20 focus:ring-offset-0 dark:border-[#1e1e2e] dark:bg-[#111118]",
                disabled && "cursor-not-allowed opacity-50",
                hasError && "border-red-500 focus:border-red-500",
              )}
              checked={field.value || false}
              onChange={(e) => field.onChange(e.target.checked)}
              disabled={disabled}
            />
          )}
        />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor={name}
            className={cn(
              "cursor-pointer text-sm font-medium select-none",
              disabled && "cursor-not-allowed opacity-50",
              hasError ? "text-red-500" : "text-slate-700 dark:text-slate-300",
            )}
          >
            {label}
          </label>
          {description && !hasError && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>
      </div>
      {hasError && (
        <p className="ml-6 text-[11px] font-medium text-red-500">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
};

export default MpmsCheckbox;
