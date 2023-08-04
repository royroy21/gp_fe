import {StyleSheet, TouchableOpacity, View} from "react-native";
import {Icon, useTheme} from "@react-native-material/core";
import {useNavigation} from "@react-navigation/native";
import {useEffect, useState} from "react";
import unreadMessagesStore from "../../store/unreadMessages";

function BottomNavigation({currentRoute, navigationTheme, isWeb}) {
  /*
  NOTE: For web this navigation is located inside the top navigation bar.
   */
  const {unreadMessages} = unreadMessagesStore();
  const noNewMessagesIcon = "message";
  const unReadMessagesIcon = "message-badge";
  const [messageIcon, setMessageIcon] = useState(noNewMessagesIcon);
  useEffect(() => {
    unreadMessages.length ? setMessageIcon(unReadMessagesIcon) : setMessageIcon(noNewMessagesIcon);
  }, [unreadMessages.length])

  const navigation = useNavigation();
  const theme = useTheme()
  function iconStyle(navigateTo, focused) {
    if (navigateTo === "RoomsScreen" && unreadMessages.length) {
      return {
        size: 25,
        color: focused ? theme.palette.primary.main : theme.palette.secondary.main,
      }
    }
    return {
      size: 25,
      color: focused ? theme.palette.primary.main : "lightgrey",
    }
  }
  const navigationItems = [
    {name: "pig", navigateTo: "DefaultScreen"},
    {name: "music", navigateTo: "MusicScreen"},
    {name: messageIcon, navigateTo: "RoomsScreen"},
  ]

  const containerStyle = isWeb ? styles.containerWeb : styles.container;
  const buttonStyle = isWeb ? {paddingLeft: 50, ...styles.button} : styles.button;
  return (
    <View style={{backgroundColor: navigationTheme.colors.card, ...containerStyle}}>
      {navigationItems.map((item) => (
        <TouchableOpacity
          style={buttonStyle}
          key={item.name}
          onPress={() => navigation.navigate(item.navigateTo)}
        >
          <Icon
            key={item.name}
            name={item.name}
            {...iconStyle(item.navigateTo, item.navigateTo === currentRoute)}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 45,
    display: "flex",
    flexDirection: "row",
  },
  containerWeb: {
    display: "flex",
    flexDirection: "row",
    width: 200,
  },
  button: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  }
});

export default BottomNavigation;
