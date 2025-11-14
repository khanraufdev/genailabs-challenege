"use client";

import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { useRunState } from "@/hooks/use-run-state";
import { useSaveChat } from "@/hooks/use-save-chat";
import {
  isGlobalError,
  mapDuplexError,
  type ServerErrorPayload,
} from "@/lib/error-map";
import type { Metrics } from "@/lib/metrics";
import { OPENROUTER__MODELS } from "@/utils/constants";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";
import { toast } from "sonner";
import { ModelOutputPanel } from "./model-output-panel";
import { ModelPicker } from "./model-picker";
import { ParamsPanel } from "./params";

type Params = { temperature: number; topP: number };

type DuplexStart = {
  a: { model: string; params: Partial<Params> };
  b: { model: string; params: Partial<Params> };
};

type DuplexEvent =
  | { type: "data-start"; data: DuplexStart }
  | { type: "data-a-delta"; data: { text: string } }
  | { type: "data-b-delta"; data: { text: string } }
  | { type: "data-a-error"; data: ServerErrorPayload }
  | { type: "data-b-error"; data: ServerErrorPayload }
  | { type: "data-a-final"; data: { text: string; metrics: Metrics } }
  | { type: "data-b-final"; data: { text: string; metrics: Metrics } };

export const LabControls = () => {
  const [modelA, setModelA] = useState<string>("");
  const [modelB, setModelB] = useState<string>("");
  const [prompt, setPrompt] = useState("");
  const [paramsA, setParamsA] = useState<Params>({ temperature: 0.7, topP: 1 });
  const [paramsB, setParamsB] = useState<Params>({ temperature: 0.7, topP: 1 });
  const {
    run,
    dispatch: dispatchRunState,
    reset: resetRunState,
  } = useRunState();

  const resetChatSaved = useSaveChat({
    run,
    prompt,
    modelA,
    modelB,
    paramsA,
    paramsB,
  });

  const resetRun = () => {
    resetRunState();
    resetChatSaved();
  };

  const { status, sendMessage } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chats/duplex" }),
    onData: (part: { type: string; data?: unknown }) => {
      const t = part.type as DuplexEvent["type"];
      switch (t) {
        case "data-a-delta":
          dispatchRunState({
            type: "A_DELTA",
            text: (part as Extract<DuplexEvent, { type: "data-a-delta" }>).data
              .text,
          });
          break;
        case "data-b-delta":
          dispatchRunState({
            type: "B_DELTA",
            text: (part as Extract<DuplexEvent, { type: "data-b-delta" }>).data
              .text,
          });
          break;
        case "data-a-final":
          dispatchRunState({
            type: "A_FINAL",
            text: (part as Extract<DuplexEvent, { type: "data-a-final" }>).data
              .text,
            metrics: (part as Extract<DuplexEvent, { type: "data-a-final" }>)
              .data.metrics,
          });
          break;
        case "data-b-final":
          dispatchRunState({
            type: "B_FINAL",
            text: (part as Extract<DuplexEvent, { type: "data-b-final" }>).data
              .text,
            metrics: (part as Extract<DuplexEvent, { type: "data-b-final" }>)
              .data.metrics,
          });
          break;
        case "data-a-error":
          {
            const payload = (
              part as Extract<DuplexEvent, { type: "data-a-error" }>
            ).data;
            const fr = mapDuplexError(payload, modelA);
            if (isGlobalError(payload)) {
              toast.error(fr.title, { description: fr.message });
            }
            dispatchRunState({ type: "A_ERROR", payload, message: fr.message });
          }
          break;
        case "data-b-error":
          {
            const payload = (
              part as Extract<DuplexEvent, { type: "data-b-error" }>
            ).data;
            if (isGlobalError(payload)) {
              const fr = mapDuplexError(payload, modelB);
              toast.error(fr.title, { description: fr.message });
            }
            const fr = mapDuplexError(payload, modelB);
            dispatchRunState({ type: "B_ERROR", payload, message: fr.message });
          }
          break;
      }
    },
  });

  const hasAnyOutput =
    run.a.streamText.length > 0 ||
    run.b.streamText.length > 0 ||
    run.a.finalText.length > 0 ||
    run.b.finalText.length > 0 ||
    !!run.a.error ||
    !!run.b.error;
  const validModels = new Set<string>(Object.values(OPENROUTER__MODELS));
  const invalidModelA = modelA && !validModels.has(modelA);
  const invalidModelB = modelB && !validModels.has(modelB);
  const isBusy = status !== "ready";

  return (
    <div className="space-y-4">
      <section className="space-y-3 rounded-lg border p-3">
        <ModelPicker
          disabled={isBusy}
          valueA={modelA}
          valueB={modelB}
          onChangeA={setModelA}
          onChangeB={setModelB}
        />
        <div className="grid gap-3 md:grid-cols-2">
          <ParamsPanel
            disabled={isBusy}
            label="Parameters (Model A)"
            value={paramsA}
            onChange={setParamsA}
          />
          <ParamsPanel
            disabled={isBusy}
            label="Parameters (Model B)"
            value={paramsB}
            onChange={setParamsB}
          />
        </div>
        {(invalidModelA || invalidModelB) && (
          <div className="text-xs text-red-500">
            Selected model is not available. Please choose a different one.
          </div>
        )}
        <PromptInput
          className="sticky bottom-2 z-10 p-2 sm:static"
          onSubmit={(msg) => {
            setPrompt(msg.text);
            if (
              !msg.text.trim() ||
              !modelA ||
              !modelB ||
              invalidModelA ||
              invalidModelB
            )
              return;
            resetRun();
            sendMessage(
              { text: msg.text },
              {
                body: {
                  modelA,
                  paramsA,
                  modelB,
                  paramsB,
                },
              }
            );
          }}
        >
          <PromptInputBody>
            <PromptInputTextarea
              placeholder="Enter a single prompt to test across both models..."
              value={prompt}
              onChange={(e) => setPrompt(e.currentTarget.value)}
            />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputSubmit
              status={status}
              disabled={
                status !== "ready" || !prompt.trim() || !modelA || !modelB
              }
            />
          </PromptInputFooter>
        </PromptInput>
      </section>

      <section className="grid gap-3 rounded-lg border p-3">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="grid gap-2">
            <h3 className="text-sm font-medium">Model A</h3>
            <ModelOutputPanel
              status={status}
              run={run.a}
              hasAnyOutput={hasAnyOutput}
              loaderVariant="shimmer"
            />
          </div>
          <div className="grid gap-2">
            <h3 className="text-sm font-medium">Model B</h3>
            <ModelOutputPanel
              status={status}
              run={run.b}
              hasAnyOutput={hasAnyOutput}
              loaderVariant="shimmer"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
