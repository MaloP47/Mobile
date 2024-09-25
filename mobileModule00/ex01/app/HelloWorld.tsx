import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function exOne() {

	const HelloRouter = useRouter();

	useEffect(() => {
		console.log("screen2:  loaded");
	  }, []);

	const handleClick = () => {
		OneRouter.push('/HelloWorld');
	  };

  return (
    <View className='flex-1 justify-center items-center bg-white'>
      <Text className='text-3xl bg-lime-800/75 rounded-lg'>Hello World!</Text>
      <TouchableOpacity
	  	className='bg-white py-2 px-4 rounded-full shadow-2xl mt-2'
		style={styles.shadow}
	  	onPress={ () => HelloRouter.push('/exOne')}
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
