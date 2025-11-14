import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
} from "@/components/ai-elements/conversation";
import { Loader } from "@/components/ai-elements/loader";
import { Shimmer } from "@/components/ai-elements/shimmer";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import { MetricsBadges } from "./metrics-badges";
import type { Metrics } from "@/lib/metrics";
import type { ServerErrorPayload } from "@/lib/error-map";

type RunShape = {
  streamText: string;
  finalText: string;
  metrics: Metrics | null;
  error?: string;
  rawError?: ServerErrorPayload;
};

type Props = {
  status: string;
  run: RunShape;
  hasAnyOutput: boolean;
  loaderVariant: "spinner" | "shimmer";
};

export const ModelOutputPanel = ({
  status,
  run,
  hasAnyOutput,
  loaderVariant,
}: Props) => {
  const isPending = status === "submitted" || status === "streaming";
  const waitingForFirstToken =
    isPending && run.streamText.length === 0 && !run.finalText && !run.error;
  const showLoader = status === "streaming" && run.streamText.length > 0;
  const textValue = run.streamText || run.finalText;

  return (
    <Conversation className="rounded-md border h-[60vh] flex flex-col">
      <ConversationContent className="gap-4 p-4 h-full flex-1 overflow-y-auto">
        {waitingForFirstToken ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {loaderVariant === "spinner" ? (
              <>
                <Loader />
                {status === "submitted" ? "Preparing…" : "Streaming…"}
              </>
            ) : (
              <Shimmer className="h-4 w-28">
                {status === "submitted" ? "Preparing…" : "Streaming…"}
              </Shimmer>
            )}
          </div>
        ) : showLoader ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {loaderVariant === "spinner" ? (
              <>
                <Loader />
                Preparing…
              </>
            ) : (
              <Shimmer className="h-4 w-24">Streaming…</Shimmer>
            )}
          </div>
        ) : !hasAnyOutput ? (
          <ConversationEmptyState
            title="No output yet"
            description="Configure and run to see responses here."
          />
        ) : (
          <Message from="assistant">
            <MessageContent>
              <MessageResponse className="text-sm">{textValue}</MessageResponse>
              {run.error ? (
                <div className="text-xs text-red-500">
                  {run.error}
                  {run.rawError ? (
                    <details className="mt-1">
                      <summary className="cursor-pointer text-[11px] underline">
                        details
                      </summary>
                      <pre className="mt-1 whitespace-pre-wrap wrap-break-word text-[11px] text-muted-foreground">
                        {JSON.stringify(run.rawError, null, 2)}
                      </pre>
                    </details>
                  ) : null}
                </div>
              ) : null}
              {run.metrics ? (
                <MetricsBadges
                  metrics={[{ label: "overall", value: run.metrics.overall ?? "—" }]}
                />
              ) : null}
            </MessageContent>
          </Message>
        )}
      </ConversationContent>
    </Conversation>
  );
};


