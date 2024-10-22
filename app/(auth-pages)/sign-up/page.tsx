"use client";

import { signUpAction } from "@/app/actions";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";
import { useSearchParams } from "next/navigation";

export default function Signup() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  return (
    <div className="w-full flex-1 flex items-center h-screen justify-center p-4">
      {message ? (
        <FormMessage message={{ success: message }} />
      ) : (
        <form className="flex flex-col min-w-64 max-w-64 mx-auto gap-4">
          <h1 className="text-2xl font-medium">Sign up</h1>
          <p className="text-sm text-foreground">
            Already have an account?{" "}
            <Link
              className="text-primary font-medium underline"
              href="/sign-in"
            >
              Sign in
            </Link>
          </p>
          <div className="flex flex-col gap-2 mt-8">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" placeholder="you@example.com" required />

            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="Your password"
              minLength={6}
              required
            />

            <Label htmlFor="classroom_name">Classroom Name</Label>
            <Input
              id="classroom_name"
              name="classroom_name"
              placeholder="Enter your classroom name"
              required
            />

            <SubmitButton formAction={signUpAction} pendingText="Signing up...">
              Sign up
            </SubmitButton>
          </div>
          {message && <FormMessage message={{ success: message }} />}
        </form>
      )}
      <SmtpMessage />
    </div>
  );
}
