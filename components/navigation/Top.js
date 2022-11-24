import DefaultScreen from "../home/DefaultScreen";
import {Button, Icon, IconButton} from "@react-native-material/core";
import LoginForm from "../forms/Login";
import SignupForm from "../forms/SignUp";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {useContext, useState} from "react";
import {UserContext} from "../context/user";
import MainMenu from "../menu/MainMenu";

export default function TopNavigation() {
  const {user} = useContext(UserContext);
  const Stack = createNativeStackNavigator();
  const [mainMenu, setMainMenu] = useState(false);
  return (
    <>
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
    </>
  )
}
