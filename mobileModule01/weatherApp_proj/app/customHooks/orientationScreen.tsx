import { useEffect, useState } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';

const useOrientation = () => {
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    ScreenOrientation.unlockAsync();

    const getInitialOrientation = async () => {
      const orientation = await ScreenOrientation.getOrientationAsync();
      if (
        orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
        orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT
      ) {
        setIsLandscape(true);
      } else {
        setIsLandscape(false);
      }
    };

    getInitialOrientation();

    const subscription = ScreenOrientation.addOrientationChangeListener((event) => {
      const orientation = event.orientationInfo.orientation;
      if (
        orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
        orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT
      ) {
        setIsLandscape(true);
      } else {
        setIsLandscape(false);
      }
    });

    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, []);

  return isLandscape;
};

export default useOrientation;
