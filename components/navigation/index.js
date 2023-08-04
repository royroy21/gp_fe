import {DarkTheme, DefaultTheme, NavigationContainer} from "@react-navigation/native";
import Routes from "./Routes";
import BottomNavigation from "./Bottom";
import {useState} from "react";
import useUserStore from "../../store/user";
import {Platform} from "react-native";

export default function Navigation() {
  const { object } = useUserStore();
  const user = object || {};
  const theme = user.theme === "light" ? DefaultTheme : DarkTheme;
  const [currentRoute, setCurrentRoute] = useState("DefaultScreen");
  const isWeb = Boolean(Platform.OS === "web");
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
      />
      {!isWeb ? (
        <BottomNavigation
          {...BottomNavigationProps}
          isWeb={isWeb}
        />
      ) : null}
    </NavigationContainer>
  )
}
