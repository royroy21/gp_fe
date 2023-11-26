import {Button, Icon, IconButton, Text} from "@react-native-material/core";
import {StyleSheet, View} from "react-native";

function LoginOrMenuButton(navigation, user, mainMenu, setMainMenu, isWeb, isSmallScreen) {
  return (
    <View style={styles.container}>
      {user && isWeb && !isSmallScreen && <Text style={styles.username}>{user.username}</Text>}
      {user.id ? (
      <IconButton
        icon={<Icon name="menu" size={30} />}
        onPress={() => setMainMenu(!mainMenu)}
      />
    ) : (
      <Button
        title={"login"}
        onPress={() => navigation.navigate("LoginScreen")}
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
