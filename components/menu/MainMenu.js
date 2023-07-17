import React from 'react';
import {Text} from "react-native";
import {IconButton, ListItem, useTheme} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import {useNavigation} from "@react-navigation/native";
import LogOut from "../loginSignUp/LogOut";
import CenteredModalWithOneButton from "../centeredModal/CenteredModalWithOneButton";

const MainMenu = ({showMainMenu, setMainMenu}) => {
  const theme = useTheme()
  const navigation = useNavigation();
  return (
    <CenteredModalWithOneButton showModal={showMainMenu} setModal={setMainMenu}>
      <ListItem
        title={<Text>{"Profile"}</Text>}
        trailing={
          <IconButton
            onPress={() => {
              navigation.navigate("ProfilePage");
              setMainMenu(!showMainMenu);
            }}
            icon={
              <Icon
                color={theme.palette.secondary.main}
                name={"account"}
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
                color={theme.palette.secondary.main}
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
            onPress={() => {
              navigation.navigate("Settings");
              setMainMenu(!showMainMenu);
            }}
            icon={
              <Icon
                color={theme.palette.secondary.main}
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
          <LogOut
            navigation={navigation}
            setMainMenu={setMainMenu}
            theme={theme}
          />
        }
      />
    </CenteredModalWithOneButton>
  );
};

export default MainMenu;
