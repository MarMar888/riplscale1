// /protected/reset-password/page.tsx
'use client';

import { resetPasswordAction } from "@/app/actions";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const successMessage = searchParams.get("success");
  const errorMessage = searchParams.get("error");

  let messageToShow = null;

  if (successMessage !== null) {
    messageToShow = { success: successMessage };
  } else if (errorMessage !== null) {
    messageToShow = { error: errorMessage };
  }

  return (
    <form className="flex flex-col w-full max-w-md p-4 gap-2 [&>input]:mb-4">
      <h1 className="text-2xl font-medium">Reset Password</h1>
      <div className="flex flex-col gap-2 [&>input]:mb-4 mt-8">
        <Label htmlFor="password">New Password</Label>
        <Input type="password" name="password" placeholder="New password" required />
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          type="password"
          name="confirmPassword"
          placeholder="Confirm new password"
          required
        />
        <SubmitButton pendingText="Resetting Password..." formAction={resetPasswordAction}>
          Reset Password
        </SubmitButton>
        {messageToShow && <FormMessage message={messageToShow} />}
      </div>
    </form>
  );
}
