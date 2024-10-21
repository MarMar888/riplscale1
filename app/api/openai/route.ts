import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const prompt = formData.get('prompt') as string;

    if (!prompt) {
        return NextResponse.json({ error: 'Prompt is required.' }, { status: 400 });
    }

    try {
        const openAIResponse = await fetch('https://api.openai.com/v1/completions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'text-davinci-003',  // Adjust the model if needed
                prompt: prompt,
                max_tokens: 150,
                temperature: 0.7,
            }),
        });

        const result = await openAIResponse.json();

        if (!openAIResponse.ok) {
            console.error("Error calling OpenAI API:", result);
            return NextResponse.json({ error: 'Failed to generate project details.' }, { status: 500 });
        }

        return NextResponse.json({ success: true, data: result.choices?.[0]?.text.trim() });
    } catch (error) {
        console.error("Error calling OpenAI API:", error);
        return NextResponse.json({ error: 'An error occurred while calling OpenAI.' }, { status: 500 });
    }
}
