import {NavigationContainer} from "@react-navigation/native";
import Home from "./Home";
import BottomNavigation from "./Bottom";
import {useState} from "react";

export default function Navigation() {
  const [currentRoute, setCurrentRoute] = useState("DefaultScreen");
  function onStateChange(state) {
    setCurrentRoute(state.routes[state.routes.length - 1].name);
  }
  return (
    <NavigationContainer onStateChange={onStateChange} >
      <Home />
      <BottomNavigation currentRoute={currentRoute} />
    </NavigationContainer>
  )
}
