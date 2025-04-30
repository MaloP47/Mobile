import * as React from "react";
import { router, useRootNavigationState, useSegments } from 'expo-router';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const initialState = {
	uid: "",
	createdAt: "",
	displayName: "",
	lastLoginAt: "",
	photoURL: "",
	providerId: "",
	email: "",
};

interface User {
	uid: string;
	createdAt: string;
	displayName: string;
	lastLoginAt: string;
	photoURL: string;
	providerId: string;
	email: string;
}

interface ContextInterface {
	user: User | null;
	signIn: React.Dispatch<React.SetStateAction<User>>; 
	signOut: () => void;
}

const contextInitialState: ContextInterface = {
	user: initialState,
	signIn: () => {},
	signOut: () => {},
};

const AuthContext = React.createContext(contextInitialState);

export function useAuth():ContextInterface {
	const context = React.useContext<ContextInterface>(AuthContext);

	if (context === undefined) {
		throw new Error("useAuth must be used with a provider")
	}

	return context;
}

function useProtectedRoute(user: User) {
	const segments = useSegments();
	const navigationState = useRootNavigationState();

	const [hasNavigated, setHasNavigated] = React.useState(false);

	React.useEffect(() => {
		
		if (!navigationState.key || hasNavigated) return;

		const inAuthGroup = segments[0] === "(auth)";

		if (!user && !inAuthGroup) {
			router.replace("/(auth)/signIn");
			setHasNavigated(true);
		} else if (user.uid && inAuthGroup) {
			router.replace("/(tabs)/profile");
			setHasNavigated(true);
		}

	}, [user.uid, segments, navigationState, hasNavigated])
}

export function AuthProvider({children}: React.PropsWithChildren):JSX.Element {

	const [user, setUser] = React.useState<User>(initialState);

	useProtectedRoute(user);

	React.useEffect(() => {
		const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
			if (user) {
				const dataWeCareAbout: User = {
					uid: user.providerData[0].uid,
					displayName: user.providerData[0].displayName ?? "",
					photoURL: user.providerData[0].photoURL ?? "",
					providerId: user.providerData[0].providerId,
					createdAt: user.metadata.creationTime!,
					lastLoginAt: user.metadata.lastSignInTime!,
					email: user.providerData[0].email!,
				};
				console.log(user);
				setUser(dataWeCareAbout);
				router.replace("/(tabs)/profile");
			} else {
				console.log("user is not authenticated");
				router.replace("/(auth)/signIn");
			}
		});
		return () => unsubscribeAuth();
	}, [])

	return (
		<AuthContext.Provider
			value={{
				user,
				signIn: setUser,
				signOut() {
					setUser(initialState);
					signOut(auth);
				},
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
