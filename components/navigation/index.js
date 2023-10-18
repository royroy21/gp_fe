import {DarkTheme, DefaultTheme, NavigationContainer} from "@react-navigation/native";
import Routes from "./Routes";
import BottomNavigation from "./Bottom";
import {useState} from "react";
import useUserStore from "../../store/user";
import {Dimensions, Platform} from "react-native";
import audioPlayerStore from "../../store/audioPlayer";
import AudioPlayer from "../audio/AudioPlayer";
import {smallScreenWidth} from "../../settings";

export default function Navigation() {
  const { object } = useUserStore();
  const { tracks: audioTracks } = audioPlayerStore();
  const user = object || {};
  const theme = user.theme === "light" ? DefaultTheme : DarkTheme;
  const [currentRoute, setCurrentRoute] = useState("DefaultScreen");
  const isWeb = Boolean(Platform.OS === "web");
  const windowWidth = Dimensions.get('window').width;
  const isSmallScreen = windowWidth < smallScreenWidth;
  function onStateChange(state) {
    setCurrentRoute(state.routes[state.routes.length - 1].name);
  }
  const BottomNavigationProps = {
    currentRoute: currentRoute,
    navigationTheme: theme,
  };
  return (
    <NavigationContainer
      onStateChange={onStateChange}
      theme={theme}
    >
      <Routes
        user={user}
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
