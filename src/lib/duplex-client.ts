export type DuplexEvent =
  | { type: "start"; a: unknown; b: unknown }
  | { type: "a:delta"; value: string }
  | { type: "b:delta"; value: string }
  | { type: "a:error"; message: string }
  | { type: "b:error"; message: string }
  | { type: "a:final"; value: string; metrics: unknown }
  | { type: "b:final"; value: string; metrics: unknown };

export const readDuplexStream = async (
  res: Response,
  onEvent: (e: DuplexEvent) => void
) => {
  if (!res.body) throw new Error("No stream");
  const reader = res.body
    .pipeThrough(new TextDecoderStream())
    .getReader();
  let buffer = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += value;
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";
    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const json = line.slice(5).trim();
      if (!json) continue;
      try {
        const evt = JSON.parse(json) as DuplexEvent;
        onEvent(evt);
      } catch {}
    }
  }
};


