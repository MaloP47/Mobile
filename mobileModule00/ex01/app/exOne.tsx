import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function exOne() {

	const OneRouter = useRouter();
	
	useEffect(() => {
		console.log("screen1: exOne loaded");
	  }, []);

	const handleClick = () => {
		OneRouter.push('/HelloWorld');
	  };

  return (
    <View className='flex-1 justify-center items-center bg-white'>
      <Text className='text-3xl bg-lime-800/75 rounded-lg'>A simple text</Text>
      <TouchableOpacity
	  	className='bg-white py-2 px-4 rounded-full shadow-2xl mt-2'
		style={styles.shadow}
	  	onPress={ handleClick }
		>
        <Text className='text-lime-800/50 rounded-full'>Click me</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
	shadow: {
		shadowColor: "#000000",
		shadowOffset: {
			width: 0,
			height: 18,
		},
		shadowOpacity:  0.25,
		shadowRadius: 20.00,
		elevation: 4,
	}
})