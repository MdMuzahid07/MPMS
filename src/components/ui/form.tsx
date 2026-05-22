/* eslint-disable @typescript-eslint/no-explicit-any */
/* src/components/ui/form.tsx */
"use client";

import React from "react";
import {
  Control,
  Controller,
  FieldValues,
  FormProvider,
  Path,
  useFormContext,
  UseFormReturn,
} from "react-hook-form";

/**
 * Wrapper that provides React Hook Form context.
 * Accepts any of the methods returned by `useForm` via spread props.
 */
export function Form({ children, ...methods }: React.PropsWithChildren<any>) {
  // The methods object typically includes register, handleSubmit, reset, watch, etc.
  // We simply pass everything to FormProvider which expects the entire form object.
  return (
    <FormProvider {...(methods as UseFormReturn<any>)}>{children}</FormProvider>
  );
}

/**
 * FormField integrates a controlled input with react-hook-form using the `Controller` component.
 * It mirrors the API used by shadcn/ui form components.
 */
export const FormField = <TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  render,
}: {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  render: (props: { field: any }) => React.ReactElement;
}) => {
  return <Controller control={control} name={name} render={render} />;
};

/**
 * Simple container for a form item. Adds vertical spacing between label, control and message.
 */
export const FormItem = ({ children }: { children: React.ReactNode }) => (
  <div className="space-y-1.5">{children}</div>
);

/**
 * Basic label component with consistent styling.
 */
export const FormLabel = ({
  children,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label className="text-sm font-medium" {...props}>
    {children}
  </label>
);

/**
 * Wrapper for the actual input element. Allows us to apply consistent layout.
 */
export const FormControl = ({ children }: { children: React.ReactNode }) => (
  <div className="mt-1">{children}</div>
);

/**
 * Displays validation message for a specific field if an error exists.
 * Usage: <FormMessage /> should be placed inside a FormItem after the control.
 */
export const FormMessage = ({ name }: { name?: string }) => {
  const {
    formState: { errors },
  } = useFormContext();

  if (!name) return null;
  const error = errors[name as keyof typeof errors];
  if (!error) return null;

  // error can be a string or an object containing `message`.
  const message = typeof error === "string" ? error : (error as any).message;
  if (!message) return null;

  return (
    <p className="text-destructive mt-1 text-sm" role="alert">
      {message}
    </p>
  );
};

export default Form;
