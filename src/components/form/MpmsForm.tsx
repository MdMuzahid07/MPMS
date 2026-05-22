/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  DefaultValues,
  FieldValues,
  FormProvider,
  Resolver,
  SubmitHandler,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { toast } from "sonner";

interface FormConfig<T extends FieldValues> {
  defaultValues?: DefaultValues<T>;
  resolver?: Resolver<T>;
  values?: T;
}
interface MpmsFormProps<T extends FieldValues> extends FormConfig<T> {
  children: React.ReactNode;
  onSubmit: SubmitHandler<T>;
  methods?: UseFormReturn<T>;
}

const MpmsForm = <T extends FieldValues>({
  children,
  onSubmit,
  defaultValues,
  resolver,
  values,
  methods,
}: MpmsFormProps<T>) => {
  const internalMethods = useForm<T>({
    defaultValues,
    resolver,
    values,
  });

  const formMethods = methods ?? internalMethods;

  const onFormSubmit = (data: T) => {
    onSubmit(data);
  };

  const onFormError = (errors: any) => {
    console.error("Form Validation Errors Detail:", {
      errors,
      fieldNames: Object.keys(errors),
      errorCount: Object.keys(errors).length,
    });

    // Check if there are any errors
    const errorKeys = Object.keys(errors);
    if (errorKeys.length > 0) {
      const firstErrorKey = errorKeys[0];
      const firstError = errors[firstErrorKey];

      // If it's a nested error (like skillsRequired.0.skillName)
      let message = "";
      if (firstError?.message) {
        message = firstError.message;
      } else if (typeof firstError === "object") {
        // Try to find a message deeper in the object
        const nestedValues = Object.values(firstError);
        const nestedErrorWithMessage = nestedValues.find(
          (v: any) => v?.message,
        ) as any;
        if (nestedErrorWithMessage?.message) {
          message = nestedErrorWithMessage.message;
        }
      }

      if (message) {
        toast.error(message);
      } else {
        toast.error(
          `Validation error in ${firstErrorKey}. Please check the form.`,
        );
      }
    } else {
      console.warn("onFormError called but no errors found in errors object.");
    }
  };

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onFormSubmit, onFormError)}>
        {children}
      </form>
    </FormProvider>
  );
};

export default MpmsForm;
