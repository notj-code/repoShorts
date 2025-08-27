// src/utils/ai.ts
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // .env.local
})

export async function generateSummary(repoDescription: string) {
  const prompt = `
You are an expert software engineer. Summarize the following GitHub repository description
into 1-2 concise, clear sentences in English that highlight the key features and purpose of the project:

"${repoDescription}"
`

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 100,
  })

  return response.choices[0].message?.content?.trim() || repoDescription
}
