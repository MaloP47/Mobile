import axios from 'axios'

export const toHumanLoc = async (longitude: number, latitude: number) => {
	try {
		const response = await axios.get(
			`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
		);
		return response?.data;
	} catch (error) {
		console.log(error);
		return null;
	}
};
