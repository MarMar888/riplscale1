import { resetPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function ResetPassword({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const params = await searchParams;

  const successMessage = params.success;
  const errorMessage = params.error;

  let messageToShow: Message | null = null;

  if (successMessage !== undefined) {
    messageToShow = {
      success: Array.isArray(successMessage) ? successMessage[0] : successMessage,
    };
  } else if (errorMessage !== undefined) {
    messageToShow = {
      error: Array.isArray(errorMessage) ? errorMessage[0] : errorMessage,
    };
  }

  return (
    <form className="flex flex-col w-full max-w-md p-4 gap-2 [&>input]:mb-4">
      <h1 className="text-2xl font-medium">Reset password</h1>
      <p className="text-sm text-foreground/60">
        Please enter your new password below.
      </p>
      <Label htmlFor="password">New password</Label>
      <Input type="password" name="password" placeholder="New password" required />
      <Label htmlFor="confirmPassword">Confirm password</Label>
      <Input
        type="password"
        name="confirmPassword"
        placeholder="Confirm password"
        required
      />
      <SubmitButton formAction={resetPasswordAction}>Reset password</SubmitButton>
      {messageToShow && <FormMessage message={messageToShow} />}
    </form>
  );
}
