import {Button, Icon, IconButton} from "@react-native-material/core";

function LoginOrMenuButton(navigation, user, mainMenu, setMainMenu) {
  return (
    user ? (
      <IconButton
        icon={<Icon name="menu" size={30} />}
        onPress={() => setMainMenu(!mainMenu)}
      />
    ) : (
      <Button
        title={"login"}
        onPress={() => navigation.navigate("LoginScreen")}
      />
    )
  )
}

export default LoginOrMenuButton;
