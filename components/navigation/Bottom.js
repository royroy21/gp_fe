import {StyleSheet, TouchableOpacity, View} from "react-native";
import {Icon, useTheme} from "@react-native-material/core";
import {useNavigation} from "@react-navigation/native";

function BottomNavigation({currentRoute, navigationTheme}) {
  const navigation = useNavigation();
  const theme = useTheme()
  function iconStyle(focused) {
    return {
      size: 25,
      color: focused ? theme.palette.primary.main : "lightgrey",
    }
  }
  const navigationItems = [
    {name: "pig", navigateTo: "DefaultScreen"},
    {name: "music", navigateTo: "MusicScreen"},
    {name: "message", navigateTo: "MessageScreen"},
  ]
  return (
    <View style={{backgroundColor: navigationTheme.colors.card, ...styles.container}}>
      {navigationItems.map((item) => (
        <TouchableOpacity
          style={styles.button}
          key={item.name}
          onPress={() => navigation.navigate(item.navigateTo)}
        >
          <Icon
            key={item.name}
            name={item.name}
            {...iconStyle(item.navigateTo === currentRoute)}
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
  button: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  }
});

export default BottomNavigation;
