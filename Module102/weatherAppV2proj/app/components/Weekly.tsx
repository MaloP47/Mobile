import { Text, StyleSheet, View } from 'react-native'
import React from 'react'

interface CurrentlyProps {
  searchText?: string;
}

export default function Weekly({ searchText }: CurrentlyProps) {
	return (
		<View style={styles.container}>
			<Text style={styles.screenTitle}>
				Weekly{searchText ? '\n' + searchText : ''}
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center"
	},
	screenTitle: {
	  fontSize: 32,
	  textAlign: 'center',
	},
});
