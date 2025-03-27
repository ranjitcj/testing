"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { verifyStudentSchema } from "@/schemas/verifyStudentSchemas";
import { ApiResponseStudentV } from "@/types/ApiResponseStudentV";
import Image from "next/image";
import logo from "@/app/logo/logo.png";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

// Schema that matches 162 format

export default function VerifyAccount() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof verifyStudentSchema>>({
    resolver: zodResolver(verifyStudentSchema),
    defaultValues: {
      rollno: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof verifyStudentSchema>) => {
    try {
      const response = await axios.post<ApiResponseStudentV>(
        "/api/verify-student",
        {
          rollno: data.rollno,
        }
      );

      if (response.data.success) {
        toast({
          title: "Success",
          description: response.data.message,
        });
        router.replace("/");
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponseStudentV>;
      toast({
        title: "Verification Failed",
        description:
          axiosError.response?.data?.message ??
          "An error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 rounded-lg shadow-md border">
        <div className="text-center">
          <div className="flex items-center space-x-4">
            <Image
              src={logo}
              width={100}
              height={100}
              alt="College Connect Logo"
            />
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
              College Connect
            </h1>
          </div>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/3 space-y-6 mx-auto"
          >
            <FormField
              control={form.control}
              name="rollno"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verify Your Account As Student</FormLabel>
                  <FormControl>
                    <InputOTP
                      maxLength={3}
                      {...field}
                      onComplete={(value) => {
                        field.onChange(value);
                        form.handleSubmit(onSubmit)();
                      }}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription>
                    Enter the Roll Number provided by your college.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
