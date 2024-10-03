import { Text, StyleSheet, View } from 'react-native'
import React, { Component } from 'react'

export default class Weekly extends Component {
	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.screenTitle}>Weekly</Text>
			</View>
	)
  }
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center"
	},
	screenTitle: {
	  fontSize: 32,
	},
});