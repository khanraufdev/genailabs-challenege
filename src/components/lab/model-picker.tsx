"use client";

import { useMemo } from "react";
import { OPENROUTER__MODELS } from "@/utils/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader } from "@/components/ai-elements/loader";

type ModelPickerProps = {
  valueA?: string;
  valueB?: string;
  onChangeA: (model: string) => void;
  onChangeB: (model: string) => void;
  disabled?: boolean;
};

export const ModelPicker = ({
  valueA,
  valueB,
  onChangeA,
  onChangeB,
  disabled = false,
}: ModelPickerProps) => {
  const options = useMemo(
    () =>
      Object.entries(OPENROUTER__MODELS).map(([k, v]) => ({
        id: v,
        label: k,
      })),
    []
  );

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="grid gap-1.5">
        <Label className="text-xs">Model A</Label>
        <Select value={valueA} onValueChange={onChangeA} disabled={disabled}>
          <SelectTrigger className="h-8" disabled={disabled}>
            <div className="flex items-center gap-2">
              {disabled ? <Loader size={12} /> : null}
              <SelectValue placeholder="Select model A" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt.id} value={opt.id}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-1.5">
        <Label className="text-xs">Model B</Label>
        <Select value={valueB} onValueChange={onChangeB} disabled={disabled}>
          <SelectTrigger className="h-8" disabled={disabled}>
            <div className="flex items-center gap-2">
              {disabled ? <Loader size={12} /> : null}
              <SelectValue placeholder="Select model B" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt.id} value={opt.id}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};


