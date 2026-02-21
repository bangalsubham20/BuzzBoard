"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

const loginSchema = z.object({
  jisid: z.string().min(1, "JIS ID is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      jisid: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        jisid: data.jisid,
        password: data.password,
        redirect: false,
        callbackUrl,
      });

      console.log("Sign in result:", result);

      if (result?.error) {
        console.error("Sign in error:", result.error);
        if (result.error === "CredentialsSignin") {
          setError("Invalid JIS ID or password");
        } else {
          setError("Authentication failed. Please try again.");
        }
        setIsLoading(false);
        return;
      }

      if (result?.ok) {
        // Wait a moment for the session to be established
        setTimeout(() => {
          router.push(callbackUrl);
          router.refresh();
        }, 100);
      } else {
        setError("Authentication failed. Please check your credentials.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Network error. Please check your connection and try again.");
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-premium flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="glass border-white/20 rounded-3xl overflow-hidden shadow-2xl shadow-primary/10">
          <CardHeader className="space-y-4 pb-8">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" x2="3" y1="12" y2="12" />
              </svg>
            </div>
            <div className="text-center space-y-2">
              <CardTitle className="text-3xl font-extrabold text-primary tracking-tight">
                Welcome <span className="text-gradient">Back</span>
              </CardTitle>
              <CardDescription className="text-gray-500 font-medium">
                Access your JIS College account to continue
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-6"
              >
                <Alert variant="destructive" className="rounded-2xl border-red-100 bg-red-50/50 backdrop-blur-sm">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="font-medium">{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="jisid"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-bold ml-1">JIS ID</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="JIS/2022/0926"
                          {...field}
                          className="h-12 rounded-xl border-primary/10 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-secondary/20 transition-all font-medium"
                        />
                      </FormControl>
                      <FormMessage className="text-xs font-bold" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-bold ml-1">Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          className="h-12 rounded-xl border-primary/10 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-secondary/20 transition-all font-medium"
                        />
                      </FormControl>
                      <FormMessage className="text-xs font-bold" />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-primary hover:bg-secondary shadow-lg shadow-primary/20 font-bold text-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying..." : "Login"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pb-8">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
            <div className="text-center text-sm text-gray-500 font-medium">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/register"
                className="text-primary hover:text-secondary font-bold decoration-2 underline-offset-4 hover:underline transition-all"
              >
                Sign up for free
              </Link>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
