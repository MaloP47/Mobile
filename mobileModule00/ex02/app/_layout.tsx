import { Stack } from 'expo-router'
import React from 'react'

export const unstable_settings = {
	initialRouteName: "index",
};

const RootLayout = () => {
  return <Stack initialRouteName='index' />;
}
export default RootLayout;
