import {DarkTheme, DefaultTheme, NavigationContainer} from "@react-navigation/native";
import Routes from "./Routes";
import BottomNavigation from "./Bottom";
import {useState} from "react";
import useUserStore from "../../store/user";

export default function Navigation() {
  const { object } = useUserStore();
  const user = object || {};
  const theme = user.theme === "light" ? DefaultTheme : DarkTheme;
  const [currentRoute, setCurrentRoute] = useState("DefaultScreen");
  function onStateChange(state) {
    setCurrentRoute(state.routes[state.routes.length - 1].name);
  }

  return (
    <NavigationContainer
      onStateChange={onStateChange}
      theme={theme}
    >
      <Routes user={user} />
      <BottomNavigation
        currentRoute={currentRoute}
        navigationTheme={theme}
      />
    </NavigationContainer>
  )
}
