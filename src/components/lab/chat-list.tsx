"use client";

import { useChats } from "@/dal/chats/queries";
import { cn } from "@/lib/utils";
import Link from "next/link";

const formatModelName = (modelId: string) => {
  const parts = modelId.split("/");
  return parts[parts.length - 1].split(":")[0];
};

export const ChatList = () => {
  const { data: chats = [], isPending } = useChats();

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
        No chats yet
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 py-2">
      {chats.map((chat) => {
        return (
          <Link
            key={chat.id}
            href={`/lab/${chat.id}`}
            className={cn(
              "flex flex-col gap-1 rounded-md px-3 py-2 text-left text-sm transition-colors",
              "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <div className="font-medium leading-tight line-clamp-2">
              {chat.prompt.slice(0, 50)}
              {chat.prompt.length > 50 && "..."}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="truncate">
                {formatModelName(chat.modelA)} vs {formatModelName(chat.modelB)}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
