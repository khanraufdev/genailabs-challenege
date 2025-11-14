import { LabControls } from "./lab/lab-controls";

export const Lab = () => {
  return (
    <>
      <div className="space-y-1">
        <h1 className="text-lg font-medium">LLM Lab</h1>
        <p className="text-muted-foreground text-sm">
          Compare two models with shared prompt and parameter ranges.
        </p>
      </div>
      <LabControls />
    </>
  );
};
