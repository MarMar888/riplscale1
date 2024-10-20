"use client";  // <-- Keep this line

import FetchDataSteps from "@/components/tutorial/fetch-data-steps";
import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/submit-button";
import { useState } from "react";
import { callOpenAIAction } from "@/app/actions";

export default function ProtectedPage() {
  const [loading, setLoading] = useState(false);
  const [openAiResponse, setOpenAiResponse] = useState<string | null>(null); // Update type to string | null

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);

    try {
      const response = await fetch("/api/openai", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        // Set openAiResponse only if data is defined
        setOpenAiResponse(result.data || "No response"); // Fallback to a default message
      } else {
        console.error(result.error);
        setOpenAiResponse(null); // Optionally clear the response on error
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setOpenAiResponse(null); // Clear response on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full gap-12 py-8">
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
