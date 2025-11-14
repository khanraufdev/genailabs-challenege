import { queryClient } from "@/utils/query-client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { createChat } from "./methods";
import { Chat } from "@/generated/prisma/client";

export const useCreateChat = () => {
  return useMutation<Chat, Error, Parameters<typeof createChat>[0]>({
    mutationFn: (chat: Parameters<typeof createChat>[0]) => createChat(chat),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
    onError: (error) => {
      toast.error("Failed to create chat");
    },
  });
};
