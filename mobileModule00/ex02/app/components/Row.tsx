import { StyleSheet, View } from "react-native";

const Row = ({ children }) => {
	return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
	container: {
		flex: 3,
		flexDirection: "row",
		height: 20,
	}
});

export default Row;
