"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";


export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = createClient();
  const origin = headers().get("origin");

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link.",
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = createClient();

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
  const supabase = createClient();
  const origin = headers().get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
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
  const supabase = createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};


export const callOpenAIAction = async (formData: FormData) => {
  // Access the specific fields from the formData object
  const className = formData.get("ClassName")?.toString() || ''; // Ensure this matches the name used in your form
  const gradeLevel = formData.get("GradeLevel")?.toString() || '';
  const clos = formData.get("clos")?.toString() || '';

  // Create an array of prompts (for example, 20 variations)
  const prompts = Array.from({ length: 20 }, (_, index) =>
    `Request ${index + 1}: Class Name: ${className}, Grade Level: ${gradeLevel}, Objective: ${clos}`
  );

  const responses: string[] = []; // Define responses as an array of strings

  try {
    for (const prompt of prompts) {
      const completionConfig = {
        model: 'gpt-4',
        prompt: prompt,
        max_tokens: 256,
        temperature: 0,
        stream: false,
      };

      const response = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(completionConfig),
      });

      const result = await response.json();

      if (response.ok) {
        responses.push(result.choices?.[0]?.text ?? "No response");
      } else {
        console.error("Error calling OpenAI API", result);
        responses.push(`Error: ${result.message || "OpenAI error occurred."}`);
      }
    }

    return {
      success: true,
      data: responses, // Return the array of responses
    };
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return {
      success: false,
      error: "An error occurred while calling OpenAI.",
    };
  }
};


