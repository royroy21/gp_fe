import {IconButton, ListItem} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingModal from "../loading/LoadingModal";
import React, {useState} from "react";
import useGigsStore from "../../store/gigs";
import {closeAndDeleteOtherWebSockets} from "../message";
import {Text} from "react-native";
import {BACKEND_ENDPOINTS} from "../../settings";
import useUsersStore from "../../store/users";
import clearAll from "../../store/clearAll";

function LogOut({navigation, setMainMenu, theme}) {
  const [loading, setLoading] = useState(false);
  const getGigs = useGigsStore((state) => state.get);
  const getUsers = useUsersStore((state) => state.get);

  const logOut = async () => {
    setLoading(true);
    await AsyncStorage.clear();
    clearAll();
    closeAndDeleteOtherWebSockets();
    await getGigs(BACKEND_ENDPOINTS.gigs, [], true);
    await getUsers(BACKEND_ENDPOINTS.user, [], true);
    setMainMenu(false);
    navigation.push("DefaultScreen");
    setLoading(false);
  }

  return (
    <>
      <LoadingModal isLoading={loading} debugMessage={"from @LogOut"}/>
      <ListItem
        title={<Text>{"Log out"}</Text>}
        onPress={logOut}
        trailing={
          <IconButton
            onPress={logOut}
            icon={
              <Icon
                color={theme.palette.secondary.main}
                name={"logout"}
                size={25}
              />
            }
          />
        }
      />
    </>
  )
}

export default LogOut;
