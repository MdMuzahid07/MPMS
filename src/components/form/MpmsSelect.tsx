"use client";

import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { ChevronDown, Check } from "lucide-react";

interface MpmsSelectProps {
  name: string;
  label: string;
  placeholder?: string;
  options: { value: string; label: string }[];
  required?: boolean;
  className?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

const MpmsSelect = ({
  name,
  label,
  placeholder = "Select option...",
  options,
  required = false,
  className,
  size = "lg",
  disabled = false,
}: MpmsSelectProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const hasError = !!errors[name];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sizeClasses = {
    sm: "h-8 text-xs py-1 px-2.5",
    md: "h-10 text-sm py-2 px-3",
    lg: "h-12 text-sm py-3 px-4",
  };

  return (
    <div
      className={cn("relative w-full space-y-1", className)}
      ref={containerRef}
    >
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
        render={({ field }) => {
          const selectedOption = options.find(
            (opt) => opt.value === field.value,
          );

          return (
            <div>
              <button
                type="button"
                disabled={disabled}
                onClick={() => setOpen(!open)}
                className={cn(
                  "flex w-full items-center justify-between rounded-md border bg-white text-left text-slate-900 transition-all duration-200 outline-none dark:bg-[#111118]/80 dark:text-slate-100",
                  "border-slate-200 dark:border-[#1e1e2e]",
                  "focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20",
                  disabled && "cursor-not-allowed opacity-50",
                  hasError &&
                    "border-red-500 focus:border-red-500 focus:ring-red-500/10",
                  sizeClasses[size],
                )}
              >
                <span
                  className={cn(
                    !selectedOption && "text-slate-400 dark:text-slate-600",
                  )}
                >
                  {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown className="text-slate-450 h-4 w-4" />
              </button>

              {open && !disabled && (
                <div className="animate-in fade-in slide-in-from-top-1 absolute right-0 left-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-md border border-slate-200 bg-white p-1 shadow-lg duration-150 dark:border-[#1e1e2e] dark:bg-[#111118]">
                  {options.map((option) => {
                    const isSelected = field.value === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          field.onChange(option.value);
                          setOpen(false);
                        }}
                        className={cn(
                          "flex w-full items-center justify-between rounded px-3 py-2 text-left text-sm text-slate-700 transition-colors duration-150 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-[#1e1e2e]",
                          isSelected &&
                            "bg-indigo-500/5 font-medium text-indigo-600 dark:text-indigo-400",
                        )}
                      >
                        <span>{option.label}</span>
                        {isSelected && (
                          <Check className="h-4 w-4 text-indigo-500" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        }}
      />
      {hasError && (
        <p className="mt-1 text-[11px] leading-none font-medium text-red-500">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
};

export default MpmsSelect;
