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
}

const MpmsForm = <T extends FieldValues>({
  children,
  onSubmit,
  defaultValues,
  resolver,
  values,
}: MpmsFormProps<T>) => {
  const methods: UseFormReturn<T> = useForm<T>({
    defaultValues,
    resolver,
    values,
  });

  const submitHandler = methods.handleSubmit;

  const onFormSubmit = (data: T) => {
    onSubmit(data);
  };

  const onFormError = (errors: any) => {
    console.error("Form Validation Errors:", errors);

    const errorKeys = Object.keys(errors);
    if (errorKeys.length > 0) {
      const firstErrorKey = errorKeys[0];
      const firstError = errors[firstErrorKey];

      let message = "";
      if (firstError?.message) {
        message = firstError.message;
      } else if (typeof firstError === "object") {
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
          `Validation error in ${firstErrorKey}. Please check the fields.`,
        );
      }
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={submitHandler(onFormSubmit, onFormError)}
        className="space-y-4"
      >
        {children}
      </form>
    </FormProvider>
  );
};

export default MpmsForm;
