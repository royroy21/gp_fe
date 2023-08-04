import LoginForm from "../loginSignUp/Login";
import SignupForm from "../loginSignUp/SignUp";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {useState} from "react";
import MainMenu from "../menu/MainMenu";
import LoginOrMenuButton from "./LoginOrMenuButton";
import {StatusBar, View, TouchableOpacity, StyleSheet} from "react-native";
import BottomNavigation from "./Bottom";
import {Text} from "@react-native-material/core";

function Title({navigation, initialRouteName, BottomNavigationProps, isWeb}){
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate(initialRouteName)}>
        <Text style={styles.text}>{"GIGPIG"}</Text>
      </TouchableOpacity>
      {isWeb && (
        <BottomNavigation
          {...BottomNavigationProps}
          isWeb={isWeb}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
  },
});

function TopNavigation({user, screens, initialRouteName, BottomNavigationProps, theme, isWeb}) {
  const Stack = createNativeStackNavigator();
  const [mainMenu, setMainMenu] = useState(false);
  return (
    <>
      <MainMenu
        showMainMenu={mainMenu}
        setMainMenu={setMainMenu}
      />
      {user.theme === "dark" ? (<StatusBar barStyle="light-content" />) : null}
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{animation: "none"}}
      >
        {screens.map(options => (
          <Stack.Screen
            key={options.key}
            name={options.name}
            component={options.component}
            options={({ navigation, route }) =>
              ({
                headerTitle: () => (
                  <Title
                    navigation={navigation}
                    initialRouteName={initialRouteName}
                    BottomNavigationProps={BottomNavigationProps}
                    isWeb={isWeb}
                  />
                ),
                title: options.title || "GIGPIG",
                headerRight: () => LoginOrMenuButton(navigation, user, mainMenu, setMainMenu),
              })
            }
          />
        ))}
        <Stack.Screen
          name="LoginScreen"
          component={LoginForm}
          options={{ title: "Login"}}
        />
        <Stack.Screen
          name="SignUpScreen"
          component={SignupForm}
          options={{ title: "Sign up"}}
        />
      </Stack.Navigator>
    </>
  )
}

export default TopNavigation;
