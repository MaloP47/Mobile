import { Stack } from 'expo-router'
import React from 'react'

export const unstable_settings = {
	initialRouteName: "exOne",
};

const RootLayout = () => {
  return <Stack initialRouteName='exOne' screenOptions={{ headerShown: false}} />;
}
export default RootLayout;
