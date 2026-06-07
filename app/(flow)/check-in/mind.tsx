import { CheckInStep } from "@/components/CheckInStep";

export default function MindStep() {
  return (
    <CheckInStep
      step={1}
      dimensionKey="mind_score"
      label="Mind"
      question="How are your thoughts today?"
      low="Worried. Racing thoughts. Foggy brain. Cluttered. Distracted."
      high="Focused. Thinking clearly."
      nextRoute="/check-in/body"
    />
  );
}
