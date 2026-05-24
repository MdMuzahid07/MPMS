"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
    <div className={cn("space-y-2", className)}>
      <Label className={hasError ? "text-destructive" : ""}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Controller
        name={name}
        control={control}
        rules={{ required: required ? `${label} is required` : false }}
        render={({ field }) => (
          <RadioGroup
            onValueChange={field.onChange}
            value={field.value}
            className={cn(
              orientation === "horizontal" && "flex gap-4",
              hasError && "text-destructive",
            )}
          >
            {options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option.value}
                  id={`${name}-${option.value}`}
                />
                <Label
                  htmlFor={`${name}-${option.value}`}
                  className="cursor-pointer font-normal"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
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

export default MpmsRadioGroup;
