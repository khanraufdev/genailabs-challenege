"use client";

import { Card } from "@/components/ui/card";
import { useChat } from "@/dal/chats/queries";
import { use } from "react";

const formatModelName = (modelId: string) => {
  const parts = modelId.split("/");
  return parts[parts.length - 1].split(":")[0];
};

export const ChatDetail = ({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) => {
  const { chatId } = use(params);
  const { data: chat, isPending, error } = useChat(chatId);

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-sm text-muted-foreground">Loading chat...</div>
      </div>
    );
  }

  if (error || !chat) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-sm text-destructive">
          Failed to load chat. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-2">
          <h2 className="text-sm font-medium text-muted-foreground">Prompt</h2>
          <p className="text-base">{chat.prompt}</p>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Model A</h3>
            <div className="space-y-1 text-sm">
              <p className="text-muted-foreground">
                <span className="font-medium">Model:</span>{" "}
                {formatModelName(chat.modelA)}
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium">Temperature:</span>{" "}
                {chat.temperatureA}
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium">Top P:</span> {chat.topPA}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Response</h4>
            {chat.errorA ? (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {chat.errorA}
              </div>
            ) : chat.responseA ? (
              <div className="text-sm whitespace-pre-wrap bg-muted p-4 rounded-md">
                {chat.responseA}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                No response available
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Model B</h3>
            <div className="space-y-1 text-sm">
              <p className="text-muted-foreground">
                <span className="font-medium">Model:</span>{" "}
                {formatModelName(chat.modelB)}
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium">Temperature:</span>{" "}
                {chat.temperatureB}
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium">Top P:</span> {chat.topPB}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Response</h4>
            {chat.errorB ? (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {chat.errorB}
              </div>
            ) : chat.responseB ? (
              <div className="text-sm whitespace-pre-wrap bg-muted p-4 rounded-md">
                {chat.responseB}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                No response available
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
