import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { getChats, getChatById } from "./methods";

type GetChats = Awaited<ReturnType<typeof getChats>>;
export const useChats = (
  options?: Omit<UseQueryOptions<GetChats, Error>, "queryKey" | "queryFn">
) => {
  return useQuery<GetChats, Error>({
    queryKey: ["chats"],
    queryFn: async () => await getChats(),
    ...(options ?? {}),
  });
};

type GetChat = Awaited<ReturnType<typeof getChatById>>;
export const useChat = (
  id: string,
  options?: Omit<UseQueryOptions<GetChat, Error>, "queryKey" | "queryFn">
) => {
  return useQuery<GetChat, Error>({
    queryKey: ["chats", id],
    queryFn: async () => await getChatById(id),
    ...(options ?? {}),
  });
};
