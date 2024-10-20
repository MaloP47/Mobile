import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
	apiKey: 'AIzaSyCAklJR99GhTrNyaI6n94kFNReJKGGjgk0',
	authDomain: 'diaryapp-bed48.firebaseapp.com',
	projectId: 'diaryapp-bed48',
	storageBucket: 'diaryapp-bed48.appspot.com',
	messagingSenderId: '642405610689',
	appId: '1:642405610689:web:648b79e1c094d35c955040'
};

const app = initializeApp(firebaseConfig);

// const auth = initializeAuth(app, {
// 	persistence: getReactNativePersistence(getReactNativePersistence)
// });

const auth = initializeAuth(app, {
	persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { auth };
