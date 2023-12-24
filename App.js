import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useMemo, useReducer } from "react";
import { Alert } from "react-native";
import { Onboarding } from "./screens/Onboarding";
import { Profile } from "./screens/Profile";
import SplashScreen from "./screens/SplashScreen";
import { Home } from "./screens/Home";
import { StatusBar } from "expo-status-bar";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { AuthContext } from "./contexts/AuthContext";

const Stack = createNativeStackNavigator();

export default function App({ navigation }) {
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "onboard":
          return {
            ...prevState,
            isLoading: false,
            isOnboardingCompleted: action.isOnboardingCompleted,
          };
      }
    },
    {
      isLoading: true,
      isOnboardingCompleted: false,
    }
  );

  useEffect(() => {
    (async () => {
      let profileData = [];
      try {
        const getProfile = await AsyncStorage.getItem("profile");
        if (getProfile !== null) {
          profileData = getProfile;
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (Object.keys(profileData).length != 0) {
          dispatch({ type: "onboard", isOnboardingCompleted: true });
        } else {
          dispatch({ type: "onboard", isOnboardingCompleted: false });
        }
      }
    })();
  }, []);

  const authContext = useMemo(
    () => ({
      onboard: async (data) => {
        try {
          const jsonValue = JSON.stringify(data);
          await AsyncStorage.setItem("profile", jsonValue);
        } catch (e) {
          console.error(e);
        }

        dispatch({ type: "onboard", isOnboardingCompleted: true });
      },
      update: async (data) => {
        try {
          const jsonValue = JSON.stringify(data);
          await AsyncStorage.setItem("profile", jsonValue);
        } catch (e) {
          console.error(e);
        }

        Alert.alert("Success", "Successfully saved changes!");
      },
      logout: async () => {
        try {
          await AsyncStorage.clear();
        } catch (e) {
          console.error(e);
        }

        dispatch({ type: "onboard", isOnboardingCompleted: false });
      },
    }),
    []
  );

  if (state.isLoading) {
    return <SplashScreen />;
  }

  return (
    <AuthContext.Provider value={authContext}>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Stack.Navigator>
          {state.isOnboardingCompleted ? (
            <>
              <Stack.Screen
                name="Home"
                component={Home}
                options={{ headerShown: false }}
              />
              <Stack.Screen name="Profile" component={Profile} />
            </>
          ) : (
            <Stack.Screen
              name="Onboarding"
              component={Onboarding}
              options={{ headerShown: false }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
