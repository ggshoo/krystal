import { Text } from "react-native";

import { CheckInStep } from "@/components/CheckInStep";

export default function HeartStep() {
  return (
    <CheckInStep
      step={3}
      dimensionKey="heart_score"
      label="Heart"
      question={
        <>
          How{" "}
          <Text className="font-semibold text-ink">emotionally</Text>{" "}
          connected do you feel?
        </>
      }
      low="Numb. Closed off. Disconnected."
      high="Open. Connected. Warm."
      nextRoute="/emotion/primary"
    />
  );
}
