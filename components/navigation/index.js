import {NavigationContainer} from "@react-navigation/native";
import DefaultScreen from "../home/DefaultScreen";
import {Button, Icon, IconButton} from "@react-native-material/core";
import LoginForm from "../forms/Login";
import SignupForm from "../forms/SignUp";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {useContext, useState} from "react";
import MainMenu from "../menu/MainMenu";
import {UserContext} from "../context/user";

export default function Navigation() {
  const [mainMenu, setMainMenu ] = useState(false);
  const Stack = createNativeStackNavigator();
  const {user} = useContext(UserContext);
  return (
    <NavigationContainer>
      <MainMenu
        showMainMenu={mainMenu}
        setMainMenu={setMainMenu}
      />
      <Stack.Navigator initialRouteName="DefaultScreen">
        <Stack.Screen
          name="DefaultScreen"
          component={DefaultScreen}
          options={({ navigation, route }) =>
            ({
              title: "",
              headerRight: () => (
                user ? (
                  <IconButton
                    icon={<Icon name="menu" size={30} />}
                    onPress={() => setMainMenu(!mainMenu)}
                  />
                ) : (
                  <Button
                    title={"login"}
                    onPress={() => navigation.navigate("LoginScreen")}
                  />
                )
              ),
            })
          }
        />
        <Stack.Screen
          name="LoginScreen"
          component={LoginForm}
          options={{ title: "Login" }}
        />
        <Stack.Screen
          name="SignUpScreen"
          component={SignupForm}
          options={{ title: "Sign up" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
