import { Stack } from 'expo-router'
import React from 'react'

const RootLayout = () => {
  return (
	<Stack>
		<Stack.Screen name='ex00' options={{ headerShown: false}} />
	</Stack>
  )
}
export default RootLayout;
