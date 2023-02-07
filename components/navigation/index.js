import {NavigationContainer} from "@react-navigation/native";
import Routes from "./Routes";
import BottomNavigation from "./Bottom";
import {useState} from "react";

export default function Navigation() {
  const [currentRoute, setCurrentRoute] = useState("DefaultScreen");
  function onStateChange(state) {
    setCurrentRoute(state.routes[state.routes.length - 1].name);
  }
  return (
    <NavigationContainer onStateChange={onStateChange} >
      <Routes />
      <BottomNavigation currentRoute={currentRoute} />
    </NavigationContainer>
  )
}
