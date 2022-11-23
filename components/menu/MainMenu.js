import {Modal, StyleSheet, View} from "react-native";
import {Button, Icon, IconButton} from "@react-native-material/core";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useNavigation} from "@react-navigation/native";
import {UserContext} from "../context/user";
import {useContext} from "react";

export default function MainMenu({showMainMenu, setMainMenu}) {
  const navigation = useNavigation();

  const { setUser } = useContext(UserContext);
  const logOut = async () => {
    await AsyncStorage.clear();
    setUser(null);
    setMainMenu(false);
    navigation.navigate("DefaultScreen");
  }

  return (
    <Modal
      animationType={"slide"}
      transparent={true}
      visible={showMainMenu}
      onRequestClose={() => {
        setMainMenu(false)
      }}
    >
      <View style={styles.mainMenu}>
        <IconButton
          style={styles.closeButton}
          icon={<Icon name="close" size={30} />}
          onPress={() => setMainMenu(!showMainMenu)}
        />
          <View>
            <Button
              title={"Log out"}
              onPress={logOut}
            />
          </View>
      </View>
    </ Modal>
  )
}

const styles = StyleSheet.create({
  closeButton: {
    marginLeft: "80%",
  },
  mainMenu: {
    width: "75%",
    marginLeft: "25%",
    height: "100%",
    backgroundColor: "white",
    paddingLeft: 10,
    paddingRight: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    elevation: 5
  }
});
