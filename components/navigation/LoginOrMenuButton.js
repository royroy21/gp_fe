import {Button, Icon, IconButton, Text} from "@react-native-material/core";
import {Pressable, StyleSheet, View} from "react-native";
import MainMenu from "../menu/MainMenu";
import {useState} from "react";

function UserNameButton({ username, navigation }) {
  const onPress = () => {
    navigation.push("ProfilePage")
  }
  return (
    <Pressable onPress={onPress}>
      <Text style={styles.username}>{username}</Text>
    </Pressable>
  )
}


function LoginOrMenuButton({ user, isWeb, isSmallScreen, navigation, route }) {
  const [mainMenu, setMainMenu] = useState(false);

  if (route.name === "LoginScreen") {
    return null;
  }

  return (
    <View style={styles.container}>
      <MainMenu
        showMainMenu={mainMenu}
        setMainMenu={setMainMenu}
        navigation={navigation}
      />
      {user && isWeb && !isSmallScreen && <UserNameButton username={user.username} navigation={navigation} />}
      {user ? (
      <IconButton
        icon={<Icon name="menu" size={30} />}
        onPress={() => setMainMenu(!mainMenu)}
      />
    ) : (
      <Button
        title={"login"}
        onPress={() => navigation.push("LoginScreen")}
        style={styles.loginButton}
      />
    )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  username: {
    marginTop: 16,
    marginRight: 15,
    color: "grey",
  },
  loginButton: {
    marginRight: 10,
  },
});


export default LoginOrMenuButton;
