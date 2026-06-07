import { CheckInStep } from "@/components/CheckInStep";

export default function HeartStep() {
  return (
    <CheckInStep
      step={3}
      dimensionKey="heart_score"
      label="Heart"
      question="How emotionally connected do you feel?"
      low="numb · closed off"
      high="open · connected"
      nextRoute="/emotion/primary"
    />
  );
}
