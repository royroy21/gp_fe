import {Pressable, StyleSheet, View} from "react-native";
import {Icon, useTheme} from "@react-native-material/core";
import {useNavigation, useRoute} from "@react-navigation/native";
import {useEffect, useState} from "react";
import unreadMessagesStore from "../../store/unreadMessages";

function BottomNavigation({ currentRouteName, navigationTheme, isWeb }) {
  if (isWeb) {
    return (
      <InnerBottomNavigationIsWeb
        navigationTheme={navigationTheme}
        isWeb={isWeb}
      />
    )
  }

  return (
    <InnerBottomNavigation
      currentRouteName={currentRouteName}
      navigationTheme={navigationTheme}
      isWeb={isWeb}
    />
  )
}

function InnerBottomNavigationIsWeb({ navigationTheme, isWeb }) {
  // Defining route here as react native mobile doesn't
  // like useRoute defined outside navigator screens.
  const route = useRoute();
  return (
    <InnerBottomNavigation
      currentRouteName={route.name}
      navigationTheme={navigationTheme}
      isWeb={isWeb}
    />
  )
}

function InnerBottomNavigation({ currentRouteName, navigationTheme, isWeb }) {
  /*
  NOTE: For web this navigation is located inside the top navigation bar.
   */
  const navigation = useNavigation();
  const theme = useTheme()

  const {unreadMessages} = unreadMessagesStore();
  const noNewMessagesIcon = "message";
  const unReadMessagesIcon = "message-badge";
  const [messageIcon, setMessageIcon] = useState(noNewMessagesIcon);

  useEffect(() => {
    unreadMessages.length ? setMessageIcon(unReadMessagesIcon) : setMessageIcon(noNewMessagesIcon);
  }, [unreadMessages.length])

  function iconStyle(navigateTo, focused) {
    if (navigateTo === "RoomsScreen" && unreadMessages.length) {
      return {
        size: 25,
        color: focused ? theme.palette.primary.main : theme.palette.secondary.main,
      }
    }
    return {
      size: navigateTo === "UsersScreen" ? 30 : 25,
      color: focused ? theme.palette.primary.main : "lightgrey",
    }
  }
  const navigationItems = [
    {name: "pig", navigateTo: "DefaultScreen"},
    {name: "account-multiple", navigateTo: "UsersScreen"},
    {name: messageIcon, navigateTo: "RoomsScreen"},
  ]

  const containerStyle = isWeb ? styles.containerWeb : styles.container;
  const buttonStyle = isWeb ? {paddingLeft: 10, ...styles.button} : styles.button;
  return (
    <View style={{backgroundColor: navigationTheme.colors.card, ...containerStyle}}>
      {navigationItems.map((item) => (
        <Pressable
          style={buttonStyle}
          key={item.name}
          onPress={() => navigation.navigate(item.navigateTo)}
        >
          <Icon
            key={item.name}
            name={item.name}
            {...iconStyle(item.navigateTo, item.navigateTo === currentRouteName)}
          />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 45,
    display: "flex",
    flexDirection: "row",
    zIndex: 3,
  },
  containerWeb: {
    flexDirection: "row",
    alignSelf: "flex-start",
    width: 150,
  },
  button: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  }
});

export default BottomNavigation;
