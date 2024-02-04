import {Pressable, StyleSheet, View} from "react-native";
import {Text} from "@react-native-material/core";
import BottomNavigation from "./Bottom";

function Title({title, navigation, route, initialRouteName, BottomNavigationProps, isWeb, isSmallScreen}){
  const doNotShowBottomOnTheseRoutes = [
    "LoginScreen", "SignUpScreen",
  ];

  const onPress = () => {
    if (isWeb) {
      navigation.push("DefaultScreen");
    }
  }

  return (
    <View style={titleStyles.container}>
      <Pressable onPress={onPress} style={titleStyles.textContainer}>
        {!(isWeb && isSmallScreen) ? (<Text style={titleStyles.gigPigText}>{"GIGPIG"}</Text>) : null}
        <Text style={titleStyles.text}>{title}</Text>
      </Pressable>
      {isWeb && !doNotShowBottomOnTheseRoutes.includes(route.name) && (
        <BottomNavigation
          {...BottomNavigationProps}
          isWeb={isWeb}
        />
      )}
    </View>
  )
}

const titleStyles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    display: "flex",
    flexDirection: "row",
    userSelect: null,
  },
  gigPigText: {
    fontSize: 20,
  },
  text: {
    color: "grey",
    fontSize: 20,
  },
});

export default Title;
