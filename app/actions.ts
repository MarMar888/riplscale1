"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const classroomName = formData.get("classroom_name")?.toString();

  const supabase = await createClient(); // Await the createClient() function

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
    console.error(`${error.code} ${error.message}`);
    return encodedRedirect("error", "/sign-up", error.message);
  }

  if (data?.user) {
    // Add the teacher to the Classrooms table
    const { error: classroomError } = await supabase.from("Classrooms").insert([
      { name: classroomName, teacher_id: data.user.id },
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

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient(); // Await createClient()

  if (!email || !password) {
    return encodedRedirect("error", "/sign-in", "Email and password are required");
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/protected");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient(); // Await createClient()

  const headersList = await headers();
  const origin = headersList.get("origin");

  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect("error", "/forgot-password", "Could not reset password");
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient(); // Await createClient()

  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();

  if (!password || !confirmPassword) {
    return encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    return encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return encodedRedirect("error", "/protected/reset-password", "Password update failed");
  }

  return encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient(); // Await createClient()
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const callOpenAIAction = async (
  formData: FormData,
): Promise<{ success: boolean; data?: string; error?: string }> => {
  const className = formData.get("ClassName")?.toString();
  const gradeLevel = formData.get("GradeLevel")?.toString();
  const clos = formData.get("clos")?.toString();

  const prompt = `Class Name: ${className}, Grade Level: ${gradeLevel}, Objective: ${clos}`;

  const requestConfig = {
    model: "gpt-4",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: prompt },
    ],
    max_tokens: 256,
    temperature: 0,
  };

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestConfig),
    });

    const result = await response.json();

    if (response.ok) {
      return {
        success: true,
        data: result.choices?.[0]?.message?.content ?? "No response",
      };
    } else {
      console.error("Error calling OpenAI API", result);
      return {
        success: false,
        error: result.error.message || "OpenAI error occurred.",
      };
    }
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return {
      success: false,
      error: "An error occurred while calling OpenAI.",
    };
  }
};
