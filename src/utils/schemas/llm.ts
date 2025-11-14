import z from "zod";

export const TEMPRATURE_MIN = 0;
export const TEMPRATURE_MAX = 2;
export const TEMPRATURE_DEFAULT = 0.7;
export const TOP_P_MIN = 0;
export const TOP_P_MAX = 1;
export const TOP_P_DEFAULT = 1;

export const TEMPRATURE_SCHEMA = z
  .number()
  .min(TEMPRATURE_MIN)
  .max(TEMPRATURE_MAX)
  .optional()
  .default(TEMPRATURE_DEFAULT);

export const TOP_P_SCHEMA = z
  .number()
  .min(TOP_P_MIN)
  .max(TOP_P_MAX)
  .optional()
  .default(TOP_P_DEFAULT);

export const LLM_PARAMS_SCHEMA = z.object({
  temperature: TEMPRATURE_SCHEMA,
  topP: TOP_P_SCHEMA,
});
