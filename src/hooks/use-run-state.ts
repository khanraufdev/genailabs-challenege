import type { ServerErrorPayload } from "@/lib/error-map";
import type { Metrics } from "@/lib/metrics";
import { useReducer } from "react";

export type ModelRun = {
  streamText: string;
  finalText: string;
  metrics: Metrics | null;
  error?: string;
  rawError?: ServerErrorPayload;
};

export type RunState = { a: ModelRun; b: ModelRun };

export type Action =
  | { type: "RESET" }
  | { type: "A_DELTA"; text: string }
  | { type: "B_DELTA"; text: string }
  | { type: "A_FINAL"; text: string; metrics: Metrics }
  | { type: "B_FINAL"; text: string; metrics: Metrics }
  | { type: "A_ERROR"; payload: ServerErrorPayload; message: string }
  | { type: "B_ERROR"; payload: ServerErrorPayload; message: string };

const initialRun: ModelRun = {
  streamText: "",
  finalText: "",
  metrics: null,
};

const initialState: RunState = { a: { ...initialRun }, b: { ...initialRun } };

const reducer = (state: RunState, action: Action): RunState => {
  switch (action.type) {
    case "RESET":
      return { a: { ...initialRun }, b: { ...initialRun } };
    case "A_DELTA":
      return {
        ...state,
        a: { ...state.a, streamText: state.a.streamText + action.text },
      };
    case "B_DELTA":
      return {
        ...state,
        b: { ...state.b, streamText: state.b.streamText + action.text },
      };
    case "A_FINAL":
      return {
        ...state,
        a: {
          ...state.a,
          finalText: action.text,
          metrics: action.metrics,
          streamText: "",
        },
      };
    case "B_FINAL":
      return {
        ...state,
        b: {
          ...state.b,
          finalText: action.text,
          metrics: action.metrics,
          streamText: "",
        },
      };
    case "A_ERROR":
      return {
        ...state,
        a: { ...state.a, error: action.message, rawError: action.payload },
      };
    case "B_ERROR":
      return {
        ...state,
        b: { ...state.b, error: action.message, rawError: action.payload },
      };
    default:
      return state;
  }
};

export const useRunState = () => {
  const [run, dispatch] = useReducer(reducer, initialState);

  const reset = () => {
    dispatch({ type: "RESET" });
  };

  return { run, dispatch, reset };
};

