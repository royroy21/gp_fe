import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {useCallback, useState} from "react";
import LoginOrMenuButton from "./LoginOrMenuButton";
import {StatusBar, View, StyleSheet, Pressable, ImageBackground} from "react-native";
import BottomNavigation from "./Bottom";
import {IconButton, Text} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import {Audio} from "expo-av";
import {useFocusEffect} from "@react-navigation/native";
import image from "../../assets/background.jpg";

function Title({title, navigation, route, initialRouteName, BottomNavigationProps, isWeb, isSmallScreen}){
  const [color, setColor] = useState("white");
  const doNotShowBottomOnTheseRoutes = [
    "LoginScreen", "SignUpScreen",
  ];

  const playOink = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../../assets/oink.mp3"),
    );
    sound.playAsync();
  }

  const playOinkOink = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../../assets/oink_oink.mp3"),
    );
    sound.playAsync();
  }

  const onPress = () => {
    if (color === "white") {
      playOink();
      setColor("red");
    } else {
      playOinkOink();
      setColor("white");
    }
  }

  useFocusEffect(
    useCallback(() => {
      setColor("white")
    }, [])
  );

  return (
    <View style={titleStyles.container}>
      <Pressable onPress={onPress} style={titleStyles.textContainer}>
        {!(isWeb && isSmallScreen) ? (<Text style={titleStyles.gigPigText} color={color}>{"GIGPIG"}</Text>) : null}
        <Text style={titleStyles.text}>{color === "red" ? "/oink" : `/${title}`}</Text>
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

function GoBackButton({navigation, route, isWeb}) {
  if (isWeb) {
    return null
  }
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

const titleStyles = StyleSheet.create({
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

function TopNavigation(props) {
  const {
    user,
    screens,
    initialRouteName,
    BottomNavigationProps,
    theme,
    isWeb,
    isSmallScreen,
  } = props;
  const Stack = createNativeStackNavigator();
  const [mainMenu, setMainMenu] = useState(false);
  const extraContainerStyle = isWeb && !isSmallScreen ? {
    borderWidth: 2,
    borderColor: "grey",
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 150,
    marginRight: 150,
    backgroundColor: "#000000",
  } : {}

  const image = require("../../assets/background.jpg");
  return (
    <View style={styles.outerContainer}>
      <ImageBackground source={image} resizeMode={"cover"} style={{flex: 1}}>
        <View  style={{...extraContainerStyle, ...styles.container}}>
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
                        isWeb={isWeb}
                      />
                    ),
                    headerBackVisible: false,
                    headerTitle: () => (
                      <Title
                        title={options.title}
                        navigation={navigation}
                        route={route}
                        initialRouteName={initialRouteName}
                        BottomNavigationProps={BottomNavigationProps}
                        isWeb={isWeb}
                        isSmallScreen={isSmallScreen}
                      />
                    ),
                    headerRight: () => {
                      return (
                        <LoginOrMenuButton
                          user={user}
                          mainMenu={mainMenu}
                          setMainMenu={setMainMenu}
                          isWeb={isWeb}
                          isSmallScreen={isSmallScreen}
                          navigation={navigation}
                          route={route}
                        />
                      )
                    },
                  })
                }
              />
            ))}
          </Stack.Navigator>
        </View>
      </ImageBackground>
    </View>
  )
}

export default TopNavigation;

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#000000",
  },
  container: {
    flex: 1,
    zIndex: 3,
  },
});
