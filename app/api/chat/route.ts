import { NextResponse } from "next/server"
import Groq from "groq-sdk"

export const runtime = "edge"

export async function POST(req: Request) {
  const { messages } = await req.json()

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: "GROQ_API_KEY is not set" }, { status: 500 })
  }

  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  })

  try {
    const stream = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages,
      temperature: 0.5,
      max_tokens: 1024,
      top_p: 1,
      stream: true,
      stop: null,
    })

    return new Response(stream.toReadableStream(), {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
      },
    })
  } catch (error) {
    console.error("Error from Groq API:", error)
    return NextResponse.json({ error: "Failed to fetch response from Groq" }, { status: 500 })
  }
}
