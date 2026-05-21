"use client";

import { cn } from "@/lib/utils";
import { Controller, useFormContext } from "react-hook-form";

interface MpmsRadioGroupProps {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  required?: boolean;
  className?: string;
  orientation?: "horizontal" | "vertical";
}

const MpmsRadioGroup = ({
  name,
  label,
  options,
  required = false,
  className,
  orientation = "vertical",
}: MpmsRadioGroupProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const hasError = !!errors[name];

  return (
    <div className={cn("space-y-1", className)}>
      <label
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
          <div
            className={cn(
              "mt-1 flex gap-3",
              orientation === "vertical" ? "flex-col" : "flex-row flex-wrap",
            )}
          >
            {options.map((option) => {
              const isSelected = field.value === option.value;
              return (
                <label
                  key={option.value}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium transition-all duration-150 select-none",
                    isSelected
                      ? "border-indigo-500 bg-indigo-500/5 text-indigo-600 dark:text-indigo-400"
                      : "border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-[#1e1e2e] dark:text-slate-300 dark:hover:bg-[#111118]/50",
                  )}
                >
                  <input
                    type="radio"
                    name={name}
                    value={option.value}
                    checked={isSelected}
                    onChange={() => field.onChange(option.value)}
                    className="sr-only"
                  />
                  <div
                    className={cn(
                      "flex h-3.5 w-3.5 items-center justify-center rounded-full border transition-all duration-150",
                      isSelected
                        ? "border-indigo-500"
                        : "border-slate-300 dark:border-[#1e1e2e]",
                    )}
                  >
                    {isSelected && (
                      <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    )}
                  </div>
                  <span>{option.label}</span>
                </label>
              );
            })}
          </div>
        )}
      />
      {hasError && (
        <p className="mt-1 text-[11px] leading-none font-medium text-red-500">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
};

export default MpmsRadioGroup;
