import { z } from "zod";
import type { AIResult, AuditReport } from "./types";
import { PublicError } from "./security";
import { aiEvidence, type AITask } from "./ai-evidence";
const resultSchema = z
  .object({
    headline: z.string().max(240),
    explanation: z.string().max(3000),
    items: z
      .array(
        z
          .object({ label: z.string().max(160), value: z.string().max(2000) })
          .strict(),
      )
      .max(12),
  })
  .strict();
export const aiProvider = () => {
  if (process.env.SEO_AI_PROVIDER === "gemini" && process.env.SEO_GEMINI_FREE_TIER_CONFIRMED === "true" && process.env.GEMINI_API_KEY && /^(gemini-[a-z0-9.-]+)$/.test(process.env.GEMINI_MODEL || "")) return "Google Gemini";
  if (process.env.SEO_AI_PROVIDER === "gemini") return "Not connected";
  // Paid providers require a separate explicit opt-in. There is no automatic fallback.
  if (process.env.SEO_ALLOW_PAID_AI === "true" && process.env.OPENAI_API_KEY && process.env.OPENAI_MODEL) return "OpenAI";
  return "Not connected";
};
export const aiConfigured = () => aiProvider() !== "Not connected";
export async function generateAI(
  report: AuditReport,
  task: AITask,
  issueId?: string,
  fields?: Record<string, string>,
): Promise<AIResult> {
  if (!aiConfigured())
    throw new PublicError(
      "AI suggestions are not configured on this deployment. The measured audit and practical fixes remain available.",
      503,
    );
  const { instructions, input } = aiEvidence(report, task, issueId, fields);
  if (aiProvider() === "Google Gemini") return generateGemini(instructions, input);
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    signal: AbortSignal.timeout(40000),
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL,
      store: false,
      max_output_tokens: 2600,
      instructions,
      input,
      text: {
        format: {
          type: "json_schema",
          name: "seo_guidance",
          strict: true,
          schema: {
            type: "object",
            properties: {
              headline: { type: "string" },
              explanation: { type: "string" },
              items: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    label: { type: "string" },
                    value: { type: "string" },
                  },
                  required: ["label", "value"],
                  additionalProperties: false,
                },
              },
            },
            required: ["headline", "explanation", "items"],
            additionalProperties: false,
          },
        },
      },
    }),
  });
  if (!response.ok)
    throw new PublicError(
      "The AI provider could not complete this request. Check its credentials, model availability or usage limit.",
      502,
    );
  const data = await response.json();
  if (data.status !== "completed")
    throw new PublicError(
      "The AI response was incomplete. Please try again.",
      502,
    );
  const text = (data.output || [])
    .flatMap(
      (o: { content?: { type: string; text?: string }[] }) => o.content || [],
    )
    .filter((c: { type: string }) => c.type === "output_text")
    .map((c: { text: string }) => c.text)
    .join("");
  try {
    const result = resultSchema.parse(JSON.parse(text));
    return {
      ...result,
      source: `OpenAI · ${process.env.OPENAI_MODEL} · AI suggestion, review before use`,
    };
  } catch {
    throw new PublicError(
      "The AI provider did not return a valid recommendation. Please try again.",
      502,
    );
  }
}

async function generateGemini(instructions: string, input: string): Promise<AIResult> {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL}:generateContent`, {
    method: "POST", signal: AbortSignal.timeout(40000),
    headers: { "x-goog-api-key": process.env.GEMINI_API_KEY!, "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: instructions }] },
      contents: [{ role: "user", parts: [{ text: input }] }],
      generationConfig: { maxOutputTokens: 4000, responseMimeType: "application/json", responseSchema: {
        type: "OBJECT", properties: { headline: { type: "STRING" }, explanation: { type: "STRING" }, items: { type: "ARRAY", items: { type: "OBJECT", properties: { label: { type: "STRING" }, value: { type: "STRING" } }, required: ["label", "value"] } } }, required: ["headline", "explanation", "items"]
      } }
    }),
  });
  if (!response.ok) throw new PublicError(response.status === 429 ? "Gemini free quota reached. Try later or use the manual review prompt. No paid fallback was used." : "Gemini could not complete the request. Check the API key, enabled model and free-tier availability.", response.status === 429 ? 429 : 502);
  const data = await response.json();
  const candidate = data.candidates?.[0];
  if (candidate?.finishReason !== "STOP") throw new PublicError("Gemini returned an incomplete or blocked response. No AI assessment was saved.", 502);
  try {
    const result = resultSchema.parse(JSON.parse((candidate.content?.parts || []).filter((p: {thought?: boolean}) => !p.thought).map((p: {text?: string}) => p.text || "").join("")));
    return { ...result, source: `Google Gemini · ${process.env.GEMINI_MODEL} · AI suggestion, review before use` };
  } catch { throw new PublicError("Gemini did not return a valid recommendation. No AI assessment was saved.", 502); }
}
