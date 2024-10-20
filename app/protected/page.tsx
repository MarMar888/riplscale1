import FetchDataSteps from "@/components/tutorial/fetch-data-steps";
import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/submit-button";
import { useState } from "react";

export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const [loading, setLoading] = useState(false);
  const [openAiResponse, setOpenAiResponse] = useState(null);

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Start loading state

    const formData = new FormData(e.target as HTMLFormElement);

    try {
      // Post form data to callOpenAIAction
      const response = await fetch("/api/openai", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setOpenAiResponse(result.data); // Store OpenAI response
      } else {
        console.error(result.error); // Handle error
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full gap-12">
        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Label htmlFor="ClassName">Class Name</Label>
          <Input name="ClassName" placeholder="AP Statistics" required />

          <Label htmlFor="GradeLevel">Grade Level</Label>
          <Input name="GradeLevel" placeholder="12th Grade" required />

          <Label htmlFor="clos">Current Learning Objectives / Mastery Target</Label>
          <Input name="clos" placeholder="Chi Squared Test" required />

          <SubmitButton pendingText="Creating Projects" isPending={loading}>
            Create Projects
          </SubmitButton>
        </form>

        {/* Display the OpenAI response */}
        {openAiResponse && (
          <div className="mt-4 p-4 border rounded bg-gray-100">
            <h3 className="font-bold">OpenAI Response:</h3>
            <pre className="text-sm">{openAiResponse}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
