import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {useState} from "react";
import MainMenu from "../menu/MainMenu";
import LoginOrMenuButton from "./LoginOrMenuButton";
import {StatusBar, View, StyleSheet, Pressable} from "react-native";
import BottomNavigation from "./Bottom";
import {IconButton, Text} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

function Title({title, navigation, initialRouteName, BottomNavigationProps, isWeb}){
  return (
    <View style={styles.container}>
      <Pressable onPress={() => navigation.navigate(initialRouteName)} style={styles.textContainer}>
        <Text style={styles.gigPigText}>{"GIGPIG"}</Text>
        <Text style={styles.text}>{`/${title}`}</Text>
      </Pressable>
      {isWeb && (
        <BottomNavigation
          {...BottomNavigationProps}
          isWeb={isWeb}
        />
      )}
    </View>
  )
}

function GoBackButton({navigation, route}) {
  return (
    route.name !== "DefaultScreen" ? (
      <IconButton
        onPress={navigation.goBack}
        icon={
          <Icon
            name={"chevron-left"}
            color={"grey"}
            size={30}
          />
        }
      />
    ) : null
  )
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    display: "flex",
    flexDirection: "row",
  },
  gigPigText: {
    fontSize: 20,
  },
  text: {
    color: "grey",
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
      {(!user || user.theme === "dark") ? (<StatusBar barStyle="light-content" />) : null}
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
                headerLeft: ()=> (
                  <GoBackButton
                    navigation={navigation}
                    route={route}
                  />
                ),
                headerBackVisible: false,
                headerTitle: () => (
                  <Title
                    title={options.title}
                    navigation={navigation}
                    initialRouteName={initialRouteName}
                    BottomNavigationProps={BottomNavigationProps}
                    isWeb={isWeb}
                  />
                ),
                headerRight: () => LoginOrMenuButton(navigation, user, mainMenu, setMainMenu),
              })
            }
          />
        ))}
      </Stack.Navigator>
    </>
  )
}

export default TopNavigation;
