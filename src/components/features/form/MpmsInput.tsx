"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    sm: "h-8 text-sm",
    md: "h-9 text-sm",
    lg: "h-10",
  };

  const hasError = !!errors[name];

  return (
    <div className="w-full space-y-2">
      <Label htmlFor={name} className={hasError ? "text-destructive" : ""}>
        {labelIcon && <span className="mr-1 inline-block">{labelIcon}</span>}
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Input
        {...register(name, {
          required: required ? `${label} is required` : false,
        })}
        id={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          sizeClasses[size],
          hasError && "border-destructive focus-visible:ring-destructive",
          className,
        )}
      />
      {hasError && (
        <p className="text-destructive text-sm">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
};

export default MpmsInput;
