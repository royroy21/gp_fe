import React from 'react';
import {Text} from "react-native";
import {IconButton, ListItem, useTheme} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import LogOut from "../loginSignUp/LogOut";
import CenteredModalWithOneButton from "../centeredModal/CenteredModalWithOneButton";

const MainMenu = ({ showMainMenu, setMainMenu, navigation }) => {
  const theme = useTheme()
  return (
    <CenteredModalWithOneButton showModal={showMainMenu} setModal={setMainMenu}>
      <ListItem
        title={<Text>{"Profile"}</Text>}
        onPress={() => {
          navigation.push("ProfilePage");
          setMainMenu(!showMainMenu);
        }}
        trailing={
          <IconButton
            onPress={() => {
              navigation.push("ProfilePage");
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
        title={<Text>{"My Gigs"}</Text>}
        onPress={() => {
          navigation.push("MyGigs");
          setMainMenu(!showMainMenu);
        }}
        trailing={
          <IconButton
            onPress={() => {
              navigation.push("MyGigs");
              setMainMenu(!showMainMenu);
            }}
            icon={
              <Icon
                color={theme.palette.secondary.main}
                name={"music"}
                size={25}
              />
            }
          />
        }
      />
      <ListItem
        title={<Text style={{ color: "grey" }}>{"Radio"}</Text>}
        onPress={() => {}}
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
        onPress={() => {
          navigation.push("Settings");
          setMainMenu(!showMainMenu);
        }}
        trailing={
          <IconButton
            onPress={() => {
              navigation.push("Settings");
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
      <LogOut
        navigation={navigation}
        setMainMenu={setMainMenu}
        theme={theme}
      />
    </CenteredModalWithOneButton>
  );
};

export default MainMenu;
