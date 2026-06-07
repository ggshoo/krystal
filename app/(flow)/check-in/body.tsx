import { Text } from "react-native";

import { CheckInStep } from "@/components/CheckInStep";

export default function BodyStep() {
  return (
    <CheckInStep
      step={2}
      dimensionKey="body_score"
      label="Body"
      question={
        <>
          How does your{" "}
          <Text className="font-semibold text-ink">body</Text> feel right now?
        </>
      }
      low="Fatigued. In pain. Tense. Stiff. Heavy."
      high="Relaxed. Strong. Alive."
      nextRoute="/check-in/heart"
    />
  );
}
