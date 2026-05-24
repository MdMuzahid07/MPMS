"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, CloudUpload, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  client: z.string().min(2, "Client name must be at least 2 characters"),
  description: z.string().optional(),
  budget: z.string().optional(),
  status: z.string(),
  startDate: z.date({
    message: "A start date is required.",
  }),
  endDate: z.date({
    message: "An end date is required.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateProjectForm() {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      client: "",
      description: "",
      budget: "",
      status: "Planning",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form Data:", data);
    toast.success("Project workspace generated successfully!");
    router.push("/projects");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-8 space-y-6 lg:grid lg:grid-cols-3 lg:gap-8 lg:space-y-0"
      >
        {/* Left Column: General Information */}
        <div className="space-y-8 lg:col-span-2">
          <div className="border-border/50 bg-card rounded-xl border p-6 shadow-sm">
            <h3 className="text-foreground mb-6 text-lg font-semibold tracking-tight">
              General Information
            </h3>

            <div className="space-y-5">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                      Project Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Quantum System Migration"
                        className="bg-background"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="client"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                      Client / Entity
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Select or type client name"
                        className="bg-background"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Define project scope, objectives, and key deliverables..."
                        className="bg-background min-h-30 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                        Budget ($)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0.00"
                          className="bg-background"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                        Status
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Planning">Planning</SelectItem>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="On Hold">On Hold</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Timeline & Assets */}
        <div className="space-y-6">
          <div className="border-border/50 bg-card rounded-xl border p-6 shadow-sm">
            <h3 className="text-foreground mb-6 text-lg font-semibold tracking-tight">
              Timeline
            </h3>
            <div className="space-y-5">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <div className="flex flex-col">
                    <FormItem>
                      <FormLabel className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                        Start Date
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={`bg-background border-border w-full justify-start text-left font-normal ${!field.value && "text-muted-foreground"}`}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "MM/dd/yyyy")
                              ) : (
                                <span>mm/dd/yyyy</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <div className="flex flex-col">
                    <FormItem>
                      <FormLabel className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                        End Date (Estimated)
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={`bg-background border-border w-full justify-start text-left font-normal ${!field.value && "text-muted-foreground"}`}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "MM/dd/yyyy")
                              ) : (
                                <span>mm/dd/yyyy</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  </div>
                )}
              />
            </div>
          </div>

          <div className="border-border/50 bg-card rounded-xl border p-6 shadow-sm">
            <h3 className="text-foreground mb-6 text-lg font-semibold tracking-tight">
              Project Assets
            </h3>
            <div className="space-y-3">
              <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Thumbnail
              </span>
              <div className="border-border/80 bg-background/50 hover:bg-muted/50 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors">
                <div className="bg-primary/10 text-primary mb-4 rounded-full p-3">
                  <CloudUpload className="h-6 w-6" />
                </div>
                <p className="text-foreground text-sm font-medium">
                  Click to upload or drag and drop
                </p>
                <p className="text-muted-foreground mt-1 text-[10px] uppercase">
                  SVG, PNG, JPG or GIF (max. 800x400px)
                </p>
              </div>
            </div>
          </div>

          <div className="border-border/50 bg-primary/5 text-primary flex gap-3 rounded-xl border p-4">
            <Info className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="text-xs leading-relaxed opacity-90">
              Complete the project metadata to automatically generate a
              collaboration workspace and assign initial team leads.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-6 pb-12 lg:col-span-3 lg:pb-0">
          <Button
            type="button"
            variant="ghost"
            className="hover:bg-muted w-full text-xs font-semibold sm:w-auto"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="w-full px-6 text-xs font-semibold shadow-sm sm:w-auto"
          >
            Create Project
          </Button>
        </div>
      </form>
    </Form>
  );
}
