import {Image, Pressable, StyleSheet, View} from "react-native";
import {Text} from "@react-native-material/core";
import BottomNavigation from "./Bottom";

const WITH_TITLE_IMAGE = false;

const titleArray = [
  "ƓƖƓƤƖƓ",
  "𝙜̳̎𝙞̳̎𝙜̳̎𝙥̳̎𝙞̳̎𝙜̳̎",
]

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
        {WITH_TITLE_IMAGE && !isSmallScreen ? (
          <Image
            source={require("../../assets/default_gigpig.jpeg")} // or use an external URL
            style={{
              width: 65,
              height: 30,
              borderRadius: 10,
              marginRight: 5,
              marginLeft: route.name === "DefaultScreen" ? 48: 0,
            }}
          />
        ) : (
          <View
            style={{
              marginLeft: route.name === "DefaultScreen" ? 48: 0,
            }}
          >
            {!(isWeb && isSmallScreen) ? (<Text style={titleStyles.gigPigText}>{titleArray[0]}</Text>) : null}
          </View>
        )}
      </Pressable>
      {isWeb && !doNotShowBottomOnTheseRoutes.includes(route.name) && (
        <BottomNavigation
          {...BottomNavigationProps}
          isWeb={isWeb}
        />
      )}
      <Text style={titleStyles.text}>{"| " + title}</Text>
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
    // fontWeight: "bold",
  },
  text: {
    color: "grey",
    fontSize: 18,
    marginLeft: 20,
  },
});

export default Title;
