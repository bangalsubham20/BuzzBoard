"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  jisid: z
    .string()
    .min(5, "JIS ID is required")
    .regex(/^JIS\/\d{4}\/\d{4}$/, "JIS ID format should be JIS/YYYY/XXXX"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      jisid: "",
      password: "",
    },
  });

  async function onSubmit(data: RegisterFormValues) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Registration failed");
        setIsLoading(false);
        return;
      }

      toast({
        title: "Registration successful",
        description: "You can now log in with your JIS ID and password",
      });

      router.push("/auth/login");
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
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
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" x2="19" y1="8" y2="14" />
                <line x1="22" x2="16" y1="11" y2="11" />
              </svg>
            </div>
            <div className="text-center space-y-2">
              <CardTitle className="text-3xl font-extrabold text-primary tracking-tight">
                Join the <span className="text-gradient">Buzz</span>
              </CardTitle>
              <CardDescription className="text-gray-500 font-medium">
                Create your account to start participating
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
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-bold ml-1">Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          {...field}
                          className="h-11 rounded-xl border-primary/10 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-secondary/20 transition-all font-medium"
                        />
                      </FormControl>
                      <FormMessage className="text-xs font-bold" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-bold ml-1">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john.doe@jiscollege.ac.in"
                          {...field}
                          className="h-11 rounded-xl border-primary/10 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-secondary/20 transition-all font-medium"
                        />
                      </FormControl>
                      <FormMessage className="text-xs font-bold" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="jisid"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-bold ml-1">JIS ID</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="JIS/2022/XXXX"
                          {...field}
                          className="h-11 rounded-xl border-primary/10 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-secondary/20 transition-all font-medium"
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
                          className="h-11 rounded-xl border-primary/10 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-secondary/20 transition-all font-medium"
                        />
                      </FormControl>
                      <FormMessage className="text-xs font-bold" />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-primary hover:bg-secondary shadow-lg shadow-primary/20 font-bold text-lg transition-all hover:scale-[1.02] active:scale-[0.98] mt-2"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Register"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pb-8">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
            <div className="text-center text-sm text-gray-500 font-medium">
              Already a member?{" "}
              <Link
                href="/auth/login"
                className="text-primary hover:text-secondary font-bold decoration-2 underline-offset-4 hover:underline transition-all"
              >
                Log in instead
              </Link>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
