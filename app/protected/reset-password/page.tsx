"use client";

import { resetPasswordAction } from "@/app/actions";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSearchParams } from "next/navigation";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const successMessage = searchParams.get("success");
  const errorMessage = searchParams.get("error");

  let messageToShow: Message | null = null;

  if (successMessage !== null) {
    messageToShow = { success: successMessage };
  } else if (errorMessage !== null) {
    messageToShow = { error: errorMessage };
  }

  return (
    <form className="flex flex-col w-full max-w-md p-4 gap-2 [&>input]:mb-4">
      {/* Form content */}
      {messageToShow && <FormMessage message={messageToShow} />}
    </form>
  );
}
