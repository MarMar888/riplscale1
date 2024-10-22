"use client";

import { useSearchParams } from "next/navigation";
import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";

export default function Signup() {
  const searchParams = useSearchParams();
  const successMessage = searchParams.get("success");
  const errorMessage = searchParams.get("error");

  let messageToShow: Message | null = null;

  if (successMessage !== null) {
    messageToShow = { success: successMessage };
  } else if (errorMessage !== null) {
    messageToShow = { error: errorMessage };
  }

  if (messageToShow) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={messageToShow} />
      </div>
    );
  }

  return (
    <>
      <form className="flex flex-col min-w-64 max-w-64 mx-auto">
        {/* Form content */}
        {messageToShow && <FormMessage message={messageToShow} />}
      </form>
      <SmtpMessage />
    </>
  );
}
