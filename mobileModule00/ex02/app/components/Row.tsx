import { StyleSheet, View } from "react-native";

import { ReactNode } from "react";

const Row = ({ children }: { children: ReactNode }) => {
	return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "row",
	}
});

export default Row;
