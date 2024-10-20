import FetchDataSteps from "@/components/tutorial/fetch-data-steps";
import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/submit-button";


export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }


  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full gap-12">


        <Label htmlFor="ClassName">Class Name</Label>
        <Input name="ClassName" placeholder="AP Statistics" required />
        <Label htmlFor="ClassName">Grade Level</Label>
        <Input name="GradeLevel" placeholder="12th Grade" required />
        <Label htmlFor="ClassName">Current Learning Objectives / Mastery Target</Label>
        <Input name="clos" placeholder="Chi Squared Test" required />
        <SubmitButton pendingText="Creating Projects" 
        // formAction={}
        >
          Create Projects
        </SubmitButton>
      </div>
    </div>
  );
}
