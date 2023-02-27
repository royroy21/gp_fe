import LoginForm from "../forms/Login";
import SignupForm from "../forms/SignUp";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {useContext, useState} from "react";
import {UserContext} from "../context/user";
import MainMenu from "../menu/MainMenu";
import LoginOrMenuButton from "./LoginOrMenuButton";

function TopNavigation({screenOptions, initialRouteName}) {
  const {user} = useContext(UserContext);
  const Stack = createNativeStackNavigator();
  const [mainMenu, setMainMenu] = useState(false);
  return (
    <>
      <MainMenu
        showMainMenu={mainMenu}
        setMainMenu={setMainMenu}
      />
      <Stack.Navigator initialRouteName={initialRouteName}>
        {screenOptions.map(options => (
          <Stack.Screen
            key={options.key}
            name={options.name}
            component={options.component}
            options={({ navigation, route }) =>
              ({
                title: "GIGPIG",
                headerRight: () => LoginOrMenuButton(navigation, user, mainMenu, setMainMenu),
              })
            }
          />
        ))}
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

export default TopNavigation;
