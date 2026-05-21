"use client";

import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Search, Check, ChevronDown } from "lucide-react";
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
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const hasError = !!errors[name];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredIcons = IconRegistry.filter(
    (icon) =>
      icon.name.toLowerCase().includes(search.toLowerCase()) ||
      icon.category.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className={cn("relative space-y-1", className)} ref={dropdownRef}>
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
          const selectedIcon = IconRegistry.find((i) => i.name === field.value);
          const SelectedIconComponent = selectedIcon?.icon;

          return (
            <div>
              <button
                type="button"
                onClick={() => setOpen(!open)}
                className={cn(
                  "flex h-12 w-full items-center justify-between rounded-md border bg-white px-4 text-sm text-slate-900 transition-all duration-200 outline-none dark:bg-[#111118]/80 dark:text-slate-100",
                  "border-slate-200 dark:border-[#1e1e2e]",
                  "focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20",
                  hasError &&
                    "border-red-500 focus:border-red-500 focus:ring-red-500/10",
                )}
              >
                <div className="flex items-center gap-2">
                  {SelectedIconComponent ? (
                    <>
                      <SelectedIconComponent className="h-4 w-4 text-indigo-500" />
                      <span className="font-medium">{selectedIcon.name}</span>
                    </>
                  ) : (
                    <span className="text-slate-400 dark:text-slate-600">
                      Select an icon...
                    </span>
                  )}
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400 dark:text-slate-600" />
              </button>

              {open && (
                <div className="animate-in fade-in slide-in-from-top-1 absolute right-0 left-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-md border border-slate-200 bg-white p-2 shadow-lg duration-150 dark:border-[#1e1e2e] dark:bg-[#111118]">
                  <div className="mb-2 flex items-center gap-2 border-b border-slate-100 px-1 pb-2 dark:border-[#1e1e2e]">
                    <Search className="h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search icons..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full border-none bg-transparent text-xs text-slate-800 placeholder-slate-400 outline-none dark:text-slate-100"
                    />
                  </div>

                  <div className="space-y-2">
                    {filteredIcons.length === 0 ? (
                      <p className="py-2 text-center text-xs text-slate-400 dark:text-slate-600">
                        No icons found
                      </p>
                    ) : (
                      filteredIcons.map(
                        ({ name: iconName, icon: Icon, category }) => (
                          <button
                            key={iconName}
                            type="button"
                            onClick={() => {
                              field.onChange(iconName);
                              setOpen(false);
                            }}
                            className={cn(
                              "flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-xs text-slate-700 transition-colors duration-150 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-[#1e1e2e]",
                              field.value === iconName &&
                                "bg-slate-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              <span>{iconName}</span>
                              <span className="ml-1 text-[9px] tracking-wider text-slate-400 uppercase">
                                ({category})
                              </span>
                            </div>
                            {field.value === iconName && (
                              <Check className="h-3 w-3" />
                            )}
                          </button>
                        ),
                      )
                    )}
                  </div>
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

export default MpmsIconPicker;
