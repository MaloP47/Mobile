import React, { useState } from "react";
import { ImageBackground, StyleSheet, View, Text } from "react-native";
import { Calendar } from "react-native-calendars";

export default function CalendarScreen() {
  const [selected, setSelected] = useState("");

  return (
    <ImageBackground
      source={require("@/assets/images/golden.png")}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text>Calendar</Text>
      </View>
      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={(day) => {
            setSelected(day.dateString);
          }}
        markedDates={{
          [selected]: {
            selected: true,
            disableTouchEvent: true,
            selectedColor: "orange",
          },
            }}
        />
      </View>
      <View style={styles.footer}></View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  calendarContainer: {
    flex: 1.75,
    backgroundColor: "red",
  },
  header: {
    flex: 0.5,
    backgroundColor: "blue",
    padding: 10,
  },
  footer: {
    flex: 2,
    backgroundColor: "green",
  },
});
