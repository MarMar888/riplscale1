"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const classroomName = formData.get("classroom_name")?.toString();

  const supabase = createClient();
  const headersList = await headers();
  const origin = headersList.get("origin");

  if (!email || !password || !classroomName) {
    return { error: "Email, password, and classroom name are required" };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  }

  if (data?.user) {
    // Add the teacher to the Classrooms table
    const { error: classroomError } = await supabase.from("Classrooms").insert([
      { name: classroomName, teacher_id: data.user.id }
    ]);

    if (classroomError) {
      console.error("Error creating classroom:", classroomError.message);
      return encodedRedirect("error", "/sign-up", classroomError.message);
    }
  }

  return encodedRedirect(
    "success",
    "/sign-up",
    "Thanks for signing up! Please check your email for a verification link.",
  );
};
