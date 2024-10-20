// app/api/openai/route.js (or route.ts if you're using TypeScript)

import { NextResponse } from "next/server"; // Use this for the app directory structure
import { callOpenAIAction } from "@/app/actions"; // Ensure this import is correct

export async function POST(request) {
    const formData = await request.formData(); // Extract form data from the request

    // Call your OpenAI action
    const result = await callOpenAIAction(formData);

    if (result.success) {
        return NextResponse.json(result); // Return the successful result
    } else {
        return NextResponse.json({ error: result.error || "An error occurred" }, { status: 400 });
    }
}
