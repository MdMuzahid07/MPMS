"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  ...rest
}: MpmsTextAreaProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const sizeClasses = {
    sm: "min-h-[60px] text-sm",
    md: "min-h-[80px] text-sm",
    lg: "min-h-[100px]",
  };

  const hasError = !!errors[name];

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className={hasError ? "text-destructive" : ""}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Textarea
        {...register(name, {
          required: required ? `${label} is required` : false,
        })}
        id={name}
        rows={rows}
        placeholder={placeholder}
        className={`${sizeClasses[size]} ${
          hasError ? "border-destructive focus-visible:ring-destructive" : ""
        } ${className || ""}`}
        {...rest}
      />
      {hasError && (
        <p className="text-destructive text-sm">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
};

export default MpmsTextArea;
