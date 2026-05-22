"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, Search } from "lucide-react";

import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import IconRegistry from "../../constants/IconRegistry";

interface MpmsIconPickerProps {
  name: string;
  label: string;
  required?: boolean;
  className?: string;
}

const MpmsIconPicker = ({
  name,
  label,
  required = false,
  className,
}: MpmsIconPickerProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const [open, setOpen] = useState(false);

  const hasError = !!errors[name];

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name} className={hasError ? "text-destructive" : ""}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>

      <Controller
        name={name}
        control={control}
        rules={{ required: required ? `${label} is required` : false }}
        render={({ field }) => {
          const selectedIcon = IconRegistry.find((i) => i.name === field.value);
          const SelectedIconComponent = selectedIcon?.icon;

          return (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    "w-full justify-between",
                    hasError && "border-destructive",
                    !field.value && "text-muted-foreground",
                  )}
                >
                  <div className="flex items-center gap-2">
                    {SelectedIconComponent ? (
                      <>
                        <SelectedIconComponent className="h-4 w-4" />
                        <span>{selectedIcon.name}</span>
                      </>
                    ) : (
                      "Select an icon..."
                    )}
                  </div>
                  <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-100 p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search icons..." />
                  <CommandList>
                    <CommandEmpty>No icon found.</CommandEmpty>
                    {Array.from(
                      new Set(IconRegistry.map((i) => i.category)),
                    ).map((category) => (
                      <CommandGroup key={category} heading={category}>
                        {IconRegistry.filter(
                          (i) => i.category === category,
                        ).map(({ name: iconName, icon: Icon }) => (
                          <CommandItem
                            key={iconName}
                            value={iconName}
                            onSelect={() => {
                              field.onChange(iconName);
                              setOpen(false);
                            }}
                          >
                            <Icon className="text-primary/70 h-4 w-4" />
                            {iconName}
                            <Check
                              className={cn(
                                "ml-auto h-4 w-4",
                                field.value === iconName
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          );
        }}
      />

      {hasError && (
        <p className="text-destructive text-sm">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
};

export default MpmsIconPicker;
