import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  convertToModelMessages,
  type UIMessage,
} from "ai";
import z from "zod";
import { TEMPRATURE_SCHEMA, TOP_P_SCHEMA } from "@/utils/schemas/llm";
import { OPENROUTER__MODELS } from "@/utils/constants";
import { computeMetrics } from "@/lib/metrics";

const openrouter = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY });
export const maxDuration = 60;

const PARAMS = z
  .object({
    temperature: TEMPRATURE_SCHEMA.optional(),
    topP: TOP_P_SCHEMA.optional(),
  })
  .partial()
  .default({});

const BodySchema = z
  .object({
    prompt: z.string().optional(),
    messages: z.any().optional(),
    modelA: z.string(),
    paramsA: PARAMS.optional(),
    modelB: z.string(),
    paramsB: PARAMS.optional(),
    options: z
      .object({
        seed: z.number().optional(),
        maxTokens: z.number().optional(),
      })
      .optional(),
  })
  .refine(
    (v) =>
      (typeof v.prompt === "string" && v.prompt.trim().length > 0) ||
      (Array.isArray(v.messages) && v.messages.length > 0),
    { message: "Provide prompt or messages" }
  );

export async function POST(req: Request) {
  if (!process.env.OPENROUTER_API_KEY) {
    return new NextResponse("Missing OPENROUTER_API_KEY", { status: 500 });
  }

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "bad_request", message: "Invalid input" } },
      { status: 400 }
    );
  }
  const { prompt, messages, modelA, paramsA, modelB, paramsB } = parsed.data;

  const validModels = new Set<string>(Object.values(OPENROUTER__MODELS));
  if (!validModels.has(modelA) || !validModels.has(modelB)) {
    return NextResponse.json(
      { error: { code: "bad_model", message: "Invalid model" } },
      { status: 400 }
    );
  }

  const base = messages
    ? { messages: convertToModelMessages(messages as UIMessage[]) }
    : { prompt: String(prompt) };

  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      writer.write({
        type: "data-start",
        data: { a: { model: modelA, params: paramsA || {} }, b: { model: modelB, params: paramsB || {} } },
        transient: true,
      });

      let aText = "";
      let bText = "";

      const runA = async () => {
        try {
          const r = streamText({
            ...base,
            model: openrouter(modelA),
            temperature: paramsA?.temperature,
            topP: paramsA?.topP,
            onChunk: ({ chunk }) => {
              if (chunk.type === "text-delta") {
                aText += chunk.text;
                writer.write({ type: "data-a-delta", data: { text: chunk.text }, transient: true });
              }
            },
          });
          await r.text;
        } catch (err) {
          const anyErr = err as { message?: string; statusCode?: number; status?: number; data?: { code?: string }; code?: string } | undefined;
          writer.write({
            type: "data-a-error",
            data: {
              message: String(anyErr?.message || anyErr),
              status: Number(anyErr?.statusCode || anyErr?.status || 0),
              code: anyErr?.data?.code || anyErr?.code,
            },
            transient: true,
          });
        }
      };

      const runB = async () => {
        try {
          const r = streamText({
            ...base,
            model: openrouter(modelB),
            temperature: paramsB?.temperature,
            topP: paramsB?.topP,
            onChunk: ({ chunk }) => {
              if (chunk.type === "text-delta") {
                bText += chunk.text;
                writer.write({ type: "data-b-delta", data: { text: chunk.text }, transient: true });
              }
            },
          });
          await r.text;
        } catch (err) {
          const anyErr = err as { message?: string; statusCode?: number; status?: number; data?: { code?: string }; code?: string } | undefined;
          writer.write({
            type: "data-b-error",
            data: {
              message: String(anyErr?.message || anyErr),
              status: Number(anyErr?.statusCode || anyErr?.status || 0),
              code: anyErr?.data?.code || anyErr?.code,
            },
            transient: true,
          });
        }
      };

      await Promise.all([runA(), runB()]);

      const p = typeof prompt === "string" ? prompt : JSON.stringify(messages);
      writer.write({ type: "data-a-final", data: { text: aText, metrics: computeMetrics(p, aText) } });
      writer.write({ type: "data-b-final", data: { text: bText, metrics: computeMetrics(p, bText) } });
    },
  });

  return createUIMessageStreamResponse({ stream });
}


