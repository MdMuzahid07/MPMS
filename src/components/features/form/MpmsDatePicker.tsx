"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    <div className="space-y-2">
      <Label htmlFor={name} className={hasError ? "text-destructive" : ""}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Controller
        name={name}
        control={control}
        rules={{ required: required ? `${label} is required` : false }}
        render={({ field }) => (
          <Input
            {...field}
            id={name}
            type="date"
            min={min}
            max={max}
            disabled={disabled}
            className={cn(
              "h-10",
              hasError && "border-destructive focus-visible:ring-destructive",
              className,
            )}
          />
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

export default MpmsDatePicker;
