import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
console.info("Habit Tracker server started");
const groqKey = Deno.env.get("GROQ_API_KEY");
Deno.serve(async (req) => {
  try {
    // Create Supabase client with authorization from request
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL"),
      Deno.env.get("SUPABASE_ANON_KEY"),
      {
        global: {
          headers: {
            Authorization: req.headers.get("Authorization"),
          },
        },
      }
    );
    const { transcription, userId, action } = await req.json();
    console.log(transcription);
    // Call Groq API for intent parsing
    const gptResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${groqKey}`,
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `You are a voice assistant for a habit tracker app. Parse the user's voice command and return ONLY a JSON object with:
- action: "add_habit", "add_task", "complete_habit", "complete_task", or "unknown"
- content: the habit/task name
- time: optional time in 24-hour format (HH:MM) if mentioned
- date: optional date in ISO format (YYYY-MM-DD) if mentioned
- if user says today, yesterday, etc... you need to parse the date in standard format as well. make it end at time 23:59

Return only the JSON object, no additional text or explanation starting { and ending }. NO OTHER TEXT!!!`,
            },
            {
              role: "user",
              content: transcription,
            },
          ],
          model: "compound-beta",
          temperature: 1,
          max_completion_tokens: 1024,
          top_p: 1,
          stream: false,
        }),
      }
    );
    if (!gptResponse.ok) {
      const errorText = await gptResponse.text();
      throw new Error(`Groq API Error: ${errorText}`);
    }
    const gptData = await gptResponse.json();
    const result = JSON.parse(gptData.choices[0].message.content);
    // Database interaction based on parsed intent
    let dbResult;
    switch (action) {
      case "add_habit":
        dbResult = await supabaseClient
          .from("habits")
          .insert({
            name: result.content,
            scheduled_time: result.time,
            scheduled_date: result.date,
            user_id: userId,
          })
          .select();
        break;
      case "add_task":
        dbResult = await supabaseClient
          .from("tasks")
          .insert({
            name: result.content,
            scheduled_time: result.time,
            scheduled_date: result.date,
            user_id: userId,
          })
          .select();
        break;
      case "complete_habit":
        dbResult = await supabaseClient
          .from("habits")
          .update({
            completed: true,
          })
          .eq("name", result.content)
          .select();
        break;
      case "complete_task":
        dbResult = await supabaseClient
          .from("tasks")
          .update({
            completed: true,
          })
          .eq("name", result.content)
          .select();
        break;
      default:
        throw new Error("Unrecognized action");
    }
    // Check for database errors
    if (dbResult.error) {
      throw dbResult.error;
    }
    return new Response(
      JSON.stringify({
        ...result,
        dbResult: dbResult.data,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          Connection: "keep-alive",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
});
