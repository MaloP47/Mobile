import { Text, StyleSheet, View } from 'react-native'
import React from 'react'

interface CurrentlyProps {
  searchText?: string;
}

export default function Today({ searchText }: CurrentlyProps) {
	return (
		<View style={styles.container}>
			<Text style={styles.screenTitle}>
				Today{searchText ? '\n' + searchText : ''}
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
