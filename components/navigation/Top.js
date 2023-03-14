import LoginForm from "../loginSignUp/Login";
import SignupForm from "../loginSignUp/SignUp";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {useState} from "react";
import MainMenu from "../menu/MainMenu";
import LoginOrMenuButton from "./LoginOrMenuButton";
import useUserStore from "../../store/user";

function TopNavigation({screenOptions, initialRouteName}) {
  const { object: user } = useUserStore();
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
                title: options.title || "GIGPIG",
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
