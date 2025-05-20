import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { View, StyleSheet } from "react-native";

type FeelingType = "very sad" | "sad" | "neutral" | "happy" | "very happy";

interface FeelingEmoticonProps {
  feeling: FeelingType;
  size?: number;
  color?: string;
}

const feelingToEmoticon: Record<FeelingType, string> = {
  "very sad": "face-sad-cry",
  sad: "face-sad-tear",
  neutral: "face-meh",
  happy: "face-smile",
  "very happy": "grin-stars",
};

const feelingToColor: Record<FeelingType, string> = {
  "very sad": "red", // Red
  sad: "orange", // Light Red
  neutral: "yellow", // Yellow
  happy: "#90EE90", // Light Green
  "very happy": "#008000", // Green
};

export function FeelingEmoticon({
  feeling,
  size = 24,
  color,
}: FeelingEmoticonProps) {
  return (
    <View style={styles.container}>
      <FontAwesome6
        name={feelingToEmoticon[feeling]}
        size={size}
        color={color || feelingToColor[feeling]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
