import { useCreateChat } from "@/dal/chats/mutations";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import type { RunState } from "./use-run-state";

type Params = { temperature: number; topP: number };

type UseSaveChatParams = {
  run: RunState;
  prompt: string;
  modelA: string;
  modelB: string;
  paramsA: Params;
  paramsB: Params;
};

export const useSaveChat = ({
  run,
  prompt,
  modelA,
  modelB,
  paramsA,
  paramsB,
}: UseSaveChatParams) => {
  const chatSavedRef = useRef(false);
  const { mutate: createChat } = useCreateChat();

  useEffect(() => {
    const bothComplete =
      (run.a.finalText || run.a.error) && (run.b.finalText || run.b.error);

    if (bothComplete && !chatSavedRef.current && prompt && modelA && modelB) {
      chatSavedRef.current = true;
      createChat(
        {
          prompt,
          modelA,
          temperatureA: paramsA.temperature,
          topPA: paramsA.topP,
          modelB,
          temperatureB: paramsB.temperature,
          topPB: paramsB.topP,
          responseA: run.a.finalText || null,
          metricsA: run.a.metrics || null,
          errorA: run.a.error || null,
          responseB: run.b.finalText || null,
          metricsB: run.b.metrics || null,
          errorB: run.b.error || null,
        },
        {
          onError: () => {
            toast.error("Failed to create chat");
          },
        }
      );
    }
  }, [
    run.a.finalText,
    run.a.error,
    run.b.finalText,
    run.b.error,
    run.a.metrics,
    run.b.metrics,
    prompt,
    modelA,
    modelB,
    paramsA.temperature,
    paramsA.topP,
    paramsB.temperature,
    paramsB.topP,
    createChat,
  ]);

  const resetChatSaved = () => {
    chatSavedRef.current = false;
  };

  return resetChatSaved;
};

