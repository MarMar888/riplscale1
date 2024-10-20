// pages/api/openai.js

import { NextApiRequest, NextApiResponse } from "next";
import { callOpenAIAction } from "@/app/actions"; // Adjust the import based on your file structure

export default async function handler(req, res) {
    if (req.method === "POST") {
        const formData = req.body; // Use `req.body` to access the submitted data

        // Call your OpenAI action
        const result = await callOpenAIAction(formData);

        if (result.success) {
            return res.status(200).json(result); // Return the successful result
        } else {
            return res.status(400).json({ error: result.error || "An error occurred" });
        }
    } else {
        // Handle any other HTTP method
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
