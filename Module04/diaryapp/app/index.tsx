// import { Text, View } from "react-native";

// export default function Index() {
//   return (
//     <View
//       style={{
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <Text>Edit app/index.tsx to edit this screen.</Text>
//     </View>
//   );
// }

// import { StyleSheet, Text, View, TouchableOpacity} from "react-native";
// import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
// import app from "../firebaseConfig.js";

// export default function App() {
//     function signUp() {
//         const auth = getAuth(app);

//         createUserWithEmailAndPassword(
//             auth,
//             "jane.doe@example.com",
//             "SuperSecretPassword!"
//         )
//             .then((res) => console.log(res))
//             .catch((err) => console.log(err));
            
//     }

//     return (
//         <View style={styles.container}>
//             <Text style={styles.text}>Check For Firebase Integration!</Text>

//                 <TouchableOpacity style={styles.button_container} onPress={signUp}>
//                 <Text style={styles.button_text}>SignUp</Text>
//             </TouchableOpacity>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: "center",
//         marginTop: 48,
//     },
//     text: {
//         fontWeight:"bold",
//         textAlign:"center",
//         fontSize:24,
//     },
//     button_text: {
//         textAlign:"center",
//         fontSize:24,
//         color:"#1976d2"
//     },
//     button_container: {
//         borderRadius: 15,
//         flexDirection: "row",
//         margin: 16,
//         padding:24,
//         justifyContent:"center",
//         backgroundColor:"#e6e6e6"
//     },
// });

import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import app from '../firebaseConfig.js';

export default function App() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

      const auth = getAuth(app);
      const subscriber = onAuthStateChanged(auth, onAuthStateChanged);
  
      return subscriber; // unsubscribe on unmount
    }, []);
  
    if (initializing) return null;
  
    if (!user) {
      return (
        <View>
          <Text>Login</Text>
        </View>
      );
    }
  
    return (
      <View>
        <Text>Welcome {user.email}</Text>
      </View>
    );
  }

  if (initializing) return null;

  if (!user) {
    return (
      <View>
        <Text>Login</Text>
      </View>
    );
  }

  return (
    <View>
      <Text>Welcome {user.email}</Text>
    </View>
  );
}
