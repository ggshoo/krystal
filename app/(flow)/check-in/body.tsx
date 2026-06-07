import { CheckInStep } from "@/components/CheckInStep";

export default function BodyStep() {
  return (
    <CheckInStep
      step={2}
      dimensionKey="body_score"
      label="Body"
      question="How does your body feel right now?"
      low="fatigue · pain · tension"
      high="relaxed · alive · active"
      nextRoute="/check-in/heart"
    />
  );
}
