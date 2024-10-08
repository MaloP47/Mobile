import handleGeoLocation from '../utils/handleGeolocation';

const checkGeo = async (firstTime: boolean) => {
  const location = await handleGeoLocation(firstTime)
  	if (location)
    	return true
	return false
};

export default checkGeo;
