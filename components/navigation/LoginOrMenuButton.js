import {Button, Icon, IconButton} from "@react-native-material/core";
import {StyleSheet} from "react-native";

function LoginOrMenuButton(navigation, user, mainMenu, setMainMenu) {
  return (
    user.id ? (
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
    )
  )
}

const styles = StyleSheet.create({
  loginButton: {
    marginRight: 10,
  },
});


export default LoginOrMenuButton;
