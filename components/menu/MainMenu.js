import {Dimensions, Modal, StyleSheet, Text, View} from "react-native";
import {Button, IconButton, ListItem, useTheme} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useNavigation} from "@react-navigation/native";
import {UserContext} from "../context/user";
import {useContext} from "react";

export default function MainMenu({showMainMenu, setMainMenu}) {
  const theme = useTheme()
  const navigation = useNavigation();

  const windowHeight = Dimensions.get('window').height;
  const windowWidth = Dimensions.get('window').width;

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
      <View style={{
        backgroundColor: theme.palette.background.main,
        borderWidth: 1,
        borderColor: "gray",
        borderStyle: "solid",
        marginTop: Math.round(windowHeight * 0.50),
        width: Math.round(windowWidth * 0.75),
        ...styles.container,
      }}>
        <View>
          <View>
            <ListItem
              title={<Text>{"Profile"}</Text>}
              trailing={
                <IconButton
                  onPress={() => {}}
                  icon={
                    <Icon
                      name={"headphones"}
                      size={25}
                    />
                  }
                />
              }
            />
            <ListItem
              title={<Text>{"Radio"}</Text>}
              trailing={
                <IconButton
                  onPress={() => {}}
                  icon={
                    <Icon
                      name={"radio"}
                      size={25}
                    />
                  }
                />
              }
            />
            <ListItem
              title={<Text>{"Settings"}</Text>}
              trailing={
                <IconButton
                  onPress={() => {}}
                  icon={
                    <Icon
                      name={"application-cog"}
                      size={25}
                    />
                  }
                />
              }
            />
            <ListItem
              title={<Text>{"Log out"}</Text>}
              trailing={
                <IconButton
                  onPress={logOut}
                  icon={
                    <Icon
                      name={"logout"}
                      size={25}
                    />
                  }
                />
              }
            />
          </View>
          <View style={styles.closeButtonContainer}>
            <Button
              style={styles.closeButton}
              title={"close"}
              onPress={() => setMainMenu(!showMainMenu)}
            />
          </View>
        </View>
    </View>
    </ Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    alignSelf: "center",
    justifyContent: "center",
    marginRight: 50,
    marginLeft: 50,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    elevation: 5
  },
  logOutButton: {
    margin: 5,
  },
  closeButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    width: "50%",
    marginTop: 20,
  },
});
