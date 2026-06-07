import { CheckInStep } from "@/components/CheckInStep";

export default function MindStep() {
  return (
    <CheckInStep
      step={1}
      dimensionKey="mind_score"
      label="Mind"
      question="How are your thoughts today?"
      low="worried · racing · foggy"
      high="focused · clear · present"
      nextRoute="/check-in/body"
    />
  );
}
