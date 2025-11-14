import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { TEMPRATURE_SCHEMA, TOP_P_SCHEMA } from "@/utils/schemas/llm";
import { prisma } from "@/lib/prisma";

const CreateChatSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  modelA: z.string().min(1, "Model A is required"),
  temperatureA: TEMPRATURE_SCHEMA,
  topPA: TOP_P_SCHEMA,
  modelB: z.string().min(1, "Model B is required"),
  temperatureB: TEMPRATURE_SCHEMA,
  topPB: TOP_P_SCHEMA,
  responseA: z.string().nullable().optional().default(""),
  metricsA: z.any().nullable().optional(),
  errorA: z.string().nullable().optional().default(""),
  responseB: z.string().nullable().optional().default(""),
  metricsB: z.any().nullable().optional(),
  errorB: z.string().nullable().optional().default(""),
});

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = CreateChatSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const chat = await prisma.chat.create({
      data: {
        userId: session.user.id,
        prompt: parsed.data.prompt,
        modelA: parsed.data.modelA,
        temperatureA: parsed.data.temperatureA,
        topPA: parsed.data.topPA,
        modelB: parsed.data.modelB,
        temperatureB: parsed.data.temperatureB,
        topPB: parsed.data.topPB,
        responseA: parsed.data.responseA,
        metricsA: parsed.data.metricsA ?? null,
        errorA: parsed.data.errorA,
        responseB: parsed.data.responseB,
        metricsB: parsed.data.metricsB ?? null,
        errorB: parsed.data.errorB,
      },
    });

    return NextResponse.json({ chat }, { status: 201 });
  } catch (error) {
    console.error("Failed to create chat:", error);
    return NextResponse.json(
      { error: "Failed to create chat" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const chats = await prisma.chat.findMany({
    where: {
      userId: session.user.id,
    },
    select: {
      id: true,
      prompt: true,
      modelA: true,
      modelB: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(chats);
}
