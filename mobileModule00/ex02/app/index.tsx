import { View, Text, StyleSheet } from 'react-native';
import { useState } from 'react';
import calcButton from './components/calcButton';
import CalcButton from './components/calcButton';

export default function index() {

	const [input, setInput] = useState('');

	const handleClick = (buttonValue) => {
		console.log("button pressed :" + buttonValue);
	};

	return (
		<View className='flex-1 justify-center items-center bg-white'>
			<View>
				<Text>Result:0</Text>
			</View>
			<View>
				<Text>{input}</Text>
			</View>
			<View>
				<CalcButton title='0' onPress={handleClick} />
				<CalcButton title='00' onPress={handleClick} />
				<CalcButton title='1' onPress={handleClick} />
				<CalcButton title='2' onPress={handleClick} />
				<CalcButton title='3' onPress={handleClick} />
				<CalcButton title='4' onPress={handleClick} />
				<CalcButton title='5' onPress={handleClick} />
				<CalcButton title='6' onPress={handleClick} />
				<CalcButton title='7' onPress={handleClick} />
				<CalcButton title='8' onPress={handleClick} />
				<CalcButton title='9' onPress={handleClick} />
				<CalcButton title='.' onPress={handleClick} />
				<CalcButton title='blank' onPress={handleClick} />


				<CalcButton title='C' onPress={handleClick} type='clear' />
				<CalcButton title='AC' onPress={handleClick} type='clear'/>

				<CalcButton title='+' onPress={handleClick} type='operator' />
				<CalcButton title='-' onPress={handleClick} type='operator' />
				<CalcButton title='*' onPress={handleClick} type='operator' />
				<CalcButton title='/' onPress={handleClick} type='operator' />

				<CalcButton title='=' onPress={handleClick} type='equal' />

			</View>
			
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
	  flex: 1,
	  backgroundColor: '#fff',
	  justifyContent: 'center',
	},
	display: {
	  flex: 1,
	  backgroundColor: '#000',
	  justifyContent: 'flex-end',
	  alignItems: 'flex-end',
	  padding: 20,
	},
	displayText: {
	  fontSize: 48,
	  color: '#fff',
	},
	buttonsContainer: {
	  flex: 2,
	  flexDirection: 'row',
	  flexWrap: 'wrap',
	  padding: 10,
	  backgroundColor: '#d3d3d3',
	},
  });
