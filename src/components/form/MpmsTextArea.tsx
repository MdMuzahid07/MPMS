"use client";

import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";

interface MpmsTextAreaProps {
  size?: "sm" | "md" | "lg";
  required?: boolean;
  label: string;
  name: string;
  className?: string;
  rows?: number;
  placeholder?: string;
}

const MpmsTextArea = ({
  size = "lg",
  required = false,
  label,
  name,
  className,
  rows = 3,
  placeholder,
}: MpmsTextAreaProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const sizeClasses = {
    sm: "min-h-[60px] text-xs py-1.5 px-2.5",
    md: "min-h-[80px] text-sm py-2 px-3",
    lg: "min-h-[100px] text-sm py-3 px-4",
  };

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
      <textarea
        {...register(name, {
          required: required ? `${label} is required` : false,
        })}
        id={name}
        rows={rows}
        placeholder={placeholder}
        className={cn(
          "w-full resize-none rounded-md border bg-white text-slate-900 transition-all duration-200 outline-none dark:bg-[#111118]/80 dark:text-slate-100",
          "border-slate-200 dark:border-[#1e1e2e]",
          "focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20",
          "placeholder-slate-400 dark:placeholder-slate-600",
          hasError &&
            "border-red-500 focus:border-red-500 focus:ring-red-500/10",
          sizeClasses[size],
          className,
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

export default MpmsTextArea;
