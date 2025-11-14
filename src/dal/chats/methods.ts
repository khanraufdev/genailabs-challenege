import { Chat } from "@/generated/prisma/client";

type GetChats = Pick<Chat, "id" | "prompt" | "modelA" | "modelB"> & {
  createdAt: string;
};
export const getChats = async (): Promise<GetChats[]> => {
  const response = await fetch("/api/chats");
  if (!response.ok) {
    throw new Error("Failed to fetch chats");
  }
  const data = await response.json().catch(() => null);
  if (!data) {
    return [];
  }
  return data as GetChats[];
};

type CreateChat = Omit<Chat, "id" | "userId" | "createdAt" | "updatedAt">;
export const createChat = async (chat: CreateChat): Promise<Chat> => {
  const response = await fetch("/api/chats", {
    method: "POST",
    body: JSON.stringify(chat),
  });
  if (!response.ok) {
    throw new Error("Failed to create chat");
  }
  return (await response.json()) as Chat;
};

export const getChatById = async (id: string): Promise<Chat> => {
  const response = await fetch(`/api/chats/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch chat");
  }
  return (await response.json()) as Chat;
};
