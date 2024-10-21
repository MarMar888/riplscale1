// Updated ProtectedPage Component

"use client";

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
  const [openAiResponses, setOpenAiResponses] = useState<string[]>([]);

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
        // Add new response to the list of responses
        setOpenAiResponses((prevResponses) => [...prevResponses, result.data || "No response"]);
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full gap-12 py-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ClassName">Class Name</Label>
            <Input name="ClassName" placeholder="AP Statistics" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="GradeLevel">Grade Level</Label>
            <Input name="GradeLevel" placeholder="12th Grade" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clos">Current Learning Objectives / Mastery Target</Label>
            <Input name="clos" placeholder="Chi Squared Test" required />
          </div>

          <div className="mt-8">
            <SubmitButton pendingText="Creating Projects" formAction={callOpenAIAction}>
              Create Projects
            </SubmitButton>
          </div>
        </form>

        {openAiResponses.length > 0 && (
          <div className="mt-8 space-y-4">
            {openAiResponses.map((response, index) => (
              <div key={index} className="p-4 border rounded bg-gray-100">
                <h3 className="font-bold">OpenAI Response:</h3>
                <pre className="text-sm whitespace-pre-wrap">{response}</pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
