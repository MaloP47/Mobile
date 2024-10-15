export default function stringToTime(dateString: string, offSet: number) {
	const date = new Date(dateString);

	date.setHours(date.getHours() + offSet);

	const hours = date.getHours() % 24;
	const minutes = date.getMinutes();

	const formattedHours = hours.toString().padStart(2, '0');
	const formattedMinutes = minutes.toString().padStart(2, '0');

	return `${formattedHours}:${formattedMinutes}`;
};
