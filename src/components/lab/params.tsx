"use client";

import {
  TEMPRATURE_MIN,
  TEMPRATURE_MAX,
  TEMPRATURE_DEFAULT,
  TOP_P_MIN,
  TOP_P_MAX,
  TOP_P_DEFAULT,
} from "@/utils/schemas/llm";

type Params = {
  temperature: number;
  topP: number;
};

type ParamsPanelProps = {
  label: string;
  value: Params;
  onChange: (next: Params) => void;
  disabled?: boolean;
};

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

export const ParamsPanel = ({ label, value, onChange, disabled = false }: ParamsPanelProps) => {
  return (
    <fieldset className="grid gap-2 rounded-md border p-3">
      <legend className="px-1 text-xs font-medium leading-none">{label}</legend>
      <div className="grid grid-cols-2 gap-3">
        <label className="grid gap-1.5">
          <span className="text-xs">Temperature</span>
          <input
            aria-label={`${label} Temperature`}
            type="number"
            min={TEMPRATURE_MIN}
            max={TEMPRATURE_MAX}
            step={0.1}
            className="h-8 rounded-md border px-2 text-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={disabled}
            value={value.temperature}
            onChange={(e) =>
              onChange({
                ...value,
                temperature: clamp(
                  Number(e.currentTarget.value),
                  TEMPRATURE_MIN,
                  TEMPRATURE_MAX
                ),
              })
            }
            onBlur={() =>
              onChange({
                ...value,
                temperature:
                  Number.isFinite(value.temperature) && value.temperature !== 0
                    ? clamp(value.temperature, TEMPRATURE_MIN, TEMPRATURE_MAX)
                    : TEMPRATURE_DEFAULT,
              })
            }
          />
          <span className="text-[11px] text-muted-foreground">
            {TEMPRATURE_MIN}-{TEMPRATURE_MAX} · default {TEMPRATURE_DEFAULT}
          </span>
        </label>
        <label className="grid gap-1.5">
          <span className="text-xs">Top P</span>
          <input
            aria-label={`${label} Top P`}
            type="number"
            min={TOP_P_MIN}
            max={TOP_P_MAX}
            step={0.05}
            className="h-8 rounded-md border px-2 text-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={disabled}
            value={value.topP}
            onChange={(e) =>
              onChange({
                ...value,
                topP: clamp(Number(e.currentTarget.value), TOP_P_MIN, TOP_P_MAX),
              })
            }
            onBlur={() =>
              onChange({
                ...value,
                topP:
                  Number.isFinite(value.topP) && value.topP !== 0
                    ? clamp(value.topP, TOP_P_MIN, TOP_P_MAX)
                    : TOP_P_DEFAULT,
              })
            }
          />
          <span className="text-[11px] text-muted-foreground">
            {TOP_P_MIN}-{TOP_P_MAX} · default {TOP_P_DEFAULT}
          </span>
        </label>
      </div>
    </fieldset>
  );
};


