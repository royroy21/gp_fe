import {DarkTheme, DefaultTheme, NavigationContainer} from "@react-navigation/native";
import Routes, {screens} from "./Routes";
import BottomNavigation from "./Bottom";
import {useEffect, useState} from "react";
import useUserStore from "../../store/user";
import {Dimensions, Platform} from "react-native";
import audioPlayerStore from "../../store/audioPlayer";
import AudioPlayer from "../audio/AudioPlayer";
import {DOMAIN_NAME_WITH_PREFIX, smallScreenWidth} from "../../settings";
import * as Linking from 'expo-linking';
import useJWTStore from "../../store/jwt";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useLastRouteStore from "../../store/lastRoute";

const prefix = Linking.createURL('/');

const getLinkingConfigScreens = () => {
  const linkingConfigScreens = {};
  screens.forEach(screen => {
    linkingConfigScreens[screen.name] = screen.linking;
  })
  return linkingConfigScreens;
}

const linkingConfigScreens = getLinkingConfigScreens();

export default function Navigation() {
  const { object: user, me } = useUserStore();
  const { store: storeLastRoute } = useLastRouteStore();
  const { object: jwt, setExisting } = useJWTStore()
  const { tracks: audioTracks } = audioPlayerStore();
  const theme = user && user.theme === "light" ? DefaultTheme : DarkTheme;
  const [currentRouteName, setCurrentRouteName] = useState("DefaultScreen");
  const isWeb = Boolean(Platform.OS === "web");
  const windowWidth = Dimensions.get('window').width;
  const isSmallScreen = windowWidth < smallScreenWidth;

  const getUserAndSetJWT = async () => {
    if (!user) {
      const unparsedJWT  = await AsyncStorage.getItem("jwt");
      if (!unparsedJWT) {
        // TODO - remove this??
        // navigation.navigate("LoginScreen");
        return null;
      }
      setExisting(unparsedJWT);
      await me();
    }
    if (!jwt) {
      const unparsedJWT  = await AsyncStorage.getItem("jwt");
      setExisting(unparsedJWT);
    }
  }
  useEffect(() => {getUserAndSetJWT()}, []);

  const BottomNavigationProps = {
    currentRouteName: currentRouteName,
    navigationTheme: theme,
  };

  const LinkingConfig = {
    screens: linkingConfigScreens,
  };

  const linking = {
    prefixes: [prefix, DOMAIN_NAME_WITH_PREFIX],
    config: LinkingConfig,
  };

  function onStateChange(state) {
    setCurrentRouteName(state.routes[state.routes.length - 1].name);
    storeLastRoute(state.routes[state.routes.length - 2]);
  }

  return (
    <NavigationContainer
      linking={linking}
      onStateChange={onStateChange}
      theme={theme}
    >
      <Routes
        user={user || {}}
        BottomNavigationProps={BottomNavigationProps}
        theme={theme}
        isWeb={isWeb}
        isSmallScreen={isSmallScreen}
      />
      {audioTracks ? (
        <AudioPlayer isWeb={isWeb} isSmallScreen={isSmallScreen} />
      ) : null}
      {!isWeb ? (
        <BottomNavigation
          {...BottomNavigationProps}
          isWeb={isWeb}
        />
      ) : null}
    </NavigationContainer>
  )
}
