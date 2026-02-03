import { google } from '@ai-sdk/google';
import { generateText } from 'ai'; // 👈 Kita pake generateText biar pasti jalan

export const runtime = 'edge';

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    console.log("🔵 Request masuk:", prompt.substring(0, 20) + "...");

    // Pake generateText (Non-Streaming)
    const { text } = await generateText({
      model: google('gemini-2.5-flash'),
      system: `You are an expert Laravel to Next.js Converter. 
               Convert the Input PHP Code into Next.js Server Action (TypeScript).
               Output ONLY the code. No markdown.`,
      prompt: prompt,
    });

    console.log("🟢 Sukses generate!");
    
    // Kirim balik sebagai JSON biasa
    return Response.json({ result: text });

  } catch (error) {
    console.error("🔴 Error Server:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}