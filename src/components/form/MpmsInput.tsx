"use client";

import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";

interface MpmsInputProps {
  size?: "sm" | "md" | "lg";
  required?: boolean;
  type?: "text" | "email" | "password" | "number";
  label: string;
  name: string;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  labelIcon?: React.ReactNode;
}

const MpmsInput = ({
  size = "lg",
  required = false,
  type = "text",
  label,
  name,
  className,
  labelIcon,
  disabled = false,
  placeholder,
}: MpmsInputProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const sizeClasses = {
    sm: "h-8 text-xs py-1 px-2",
    md: "h-10 text-sm py-2 px-3",
    lg: "h-12 text-sm py-3 px-4",
  };

  const hasError = !!errors[name];

  return (
    <div className="w-full space-y-1">
      <div className="flex items-center justify-between">
        <label
          htmlFor={name}
          className={cn(
            "text-[10px] font-semibold tracking-wider uppercase",
            hasError ? "text-red-500" : "text-slate-400 dark:text-slate-500",
          )}
        >
          {labelIcon && <span className="mr-1">{labelIcon}</span>}
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      </div>
      <input
        {...register(name, {
          required: required ? `${label} is required` : false,
        })}
        id={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "w-full rounded-md border bg-white text-slate-900 transition-all duration-200 outline-none dark:bg-[#111118]/80 dark:text-slate-100",
          "border-slate-200 dark:border-[#1e1e2e]",
          "focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20",
          "placeholder-slate-400 dark:placeholder-slate-600",
          disabled && "cursor-not-allowed opacity-50",
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

export default MpmsInput;
