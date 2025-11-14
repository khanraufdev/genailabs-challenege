/**
 * Available free models from OpenRouter API.
 * Maps model identifiers to their corresponding API endpoint strings.
 *
 * @constant
 * @type {Record<string, string>}
 */
export const OPENROUTER_AVAILABLE_FREE_MODELS = {
  "openai/gpt-oss-20b:free": "openai/gpt-oss-20b:free",
  "kwaipilot/kat-coder-pro:free": "kwaipilot/kat-coder-pro:free",
} as const;

export const OPENROUTER__MODELS = {
  "deepseek/deepseek-r1-0528-qwen3-8b": "deepseek/deepseek-r1-0528-qwen3-8b",
  "openai/gpt-oss-safeguard-20b": "openai/gpt-oss-safeguard-20b",
  "meta-llama/llama-3-8b-instruct": "meta-llama/llama-3-8b-instruct",
  "google/gemma-3-12b-it": "google/gemma-3-12b-it",
  "agentica-org/deepcoder-14b-preview": "agentica-org/deepcoder-14b-preview",
  "moonshotai/kimi-k2-thinking": "moonshotai/kimi-k2-thinking",
  "kwaipilot/kat-coder-pro:fake": "kwaipilot/kat-coder-pro:fake",
} as const;

export const SYSTEM_PROMPT =
  `You are a helpful assistant that specializes in various fields of knowledge.` as const;
