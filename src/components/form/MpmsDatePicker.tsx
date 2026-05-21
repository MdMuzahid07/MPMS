"use client";

import { cn } from "@/lib/utils";
import { Controller, useFormContext } from "react-hook-form";

interface MpmsDatePickerProps {
  name: string;
  label: string;
  required?: boolean;
  className?: string;
  min?: string;
  max?: string;
  disabled?: boolean;
}

const MpmsDatePicker = ({
  name,
  label,
  required = false,
  className,
  min,
  max,
  disabled,
}: MpmsDatePickerProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const hasError = !!errors[name];

  return (
    <div className="w-full space-y-1">
      <label
        htmlFor={name}
        className={cn(
          "text-[10px] font-semibold tracking-wider uppercase",
          hasError ? "text-red-500" : "text-slate-400 dark:text-slate-500",
        )}
      >
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        rules={{ required: required ? `${label} is required` : false }}
        render={({ field }) => (
          <input
            {...field}
            id={name}
            type="date"
            min={min}
            max={max}
            disabled={disabled}
            className={cn(
              "h-12 w-full rounded-md border bg-white px-4 text-sm text-slate-900 transition-all duration-200 outline-none dark:bg-[#111118]/80 dark:text-slate-100",
              "border-slate-200 dark:border-[#1e1e2e]",
              "focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20",
              disabled && "cursor-not-allowed opacity-50",
              hasError &&
                "border-red-500 focus:border-red-500 focus:ring-red-500/10",
              className,
            )}
          />
        )}
      />
      {hasError && (
        <p className="animate-in fade-in slide-in-from-top-1 mt-1 text-[11px] leading-none font-medium text-red-500 duration-150">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
};

export default MpmsDatePicker;
