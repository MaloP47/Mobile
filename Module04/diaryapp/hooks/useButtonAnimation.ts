import { useRef, useEffect } from 'react';
import { Animated, TouchableOpacity } from 'react-native';

export const useButtonAnimation = () => {

	const scaleAnimation = useRef(new Animated.Value(1)).current;
	const colorAnimation = useRef(new Animated.Value(0)).current;
	const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
  
	useEffect(() => {
		Animated.loop(
			Animated.sequence([
		  		Animated.timing(scaleAnimation, {
					toValue: 1.1,
					duration: 300,
					useNativeDriver: true,
		  		}),
		  		Animated.timing(scaleAnimation, {
					toValue: 1,
					duration: 300,
					useNativeDriver: true,
		  		}),
			])
	  	).start();
		Animated.loop(
			Animated.sequence([
		  		Animated.timing(colorAnimation, {
					toValue: 1,
					duration: 800,
					useNativeDriver: false,
				}),
		  		Animated.timing(colorAnimation, {
					toValue: 0,
					duration: 800,
					useNativeDriver: false,
		  		}),
			])
		).start();
	}, [scaleAnimation, colorAnimation]);
  
	const backgroundColor = colorAnimation.interpolate({
		inputRange: [0, 1],
		outputRange: ['#FFD700', '#FFA500'],
	});

	return {
		AnimatedTouchableOpacity,
		backgroundColor,
		scaleAnimation
	};
}
