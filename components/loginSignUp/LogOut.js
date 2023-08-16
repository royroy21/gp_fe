import {IconButton, ListItem} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import useUserStore from "../../store/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useCountryStore from "../../store/country";
import useGenresStore from "../../store/genres";
import useGigStore from "../../store/gig";
import useJWTStore from "../../store/jwt";
import useCountriesStore from "../../store/countries";
import LoadingModal from "../loading/LoadingModal";
import React, {useState} from "react";
import useRoomsStore from "../../store/rooms";
import useGigsStore from "../../store/gigs";
import useOtherUserStore from "../../store/otherUser";
import usePreviousMessagesStore from "../../store/previousMessages";
import {closeAndDeleteOtherWebSockets} from "../message";
import unreadMessagesStore from "../../store/unreadMessages";
import {Text} from "react-native";

function LogOut({navigation, setMainMenu, theme}) {
  const [loading, setLoading] = useState(false);

  // TODO - remember to add extra clear stores here.
  // maybe find a better way to do this?
  const { clear: clearCountries } = useCountriesStore();
  const { clear: clearCountry } = useCountryStore();
  const { clear: clearGenres } = useGenresStore();
  const { clear: clearGig } = useGigStore();
  const { clear: clearGigs } = useGigsStore();
  const { clear: clearJWT } = useJWTStore();
  const { clear: clearOtherUser } = useOtherUserStore();
  const { clear: clearPreviousMessages } = usePreviousMessagesStore();
  const { clear: clearRooms } = useRoomsStore();
  const { clear: clearUnreadMessages } = unreadMessagesStore();
  const { clear: clearUser } = useUserStore();
  const logOut = async () => {
    setLoading(true);
    navigation.navigate("DefaultScreen");
    await AsyncStorage.clear();
    clearCountries();
    clearCountry();
    clearGenres();
    clearGig();
    clearGigs();
    clearJWT();
    clearOtherUser();
    clearPreviousMessages();
    clearRooms();
    clearUnreadMessages();
    clearUser();
    closeAndDeleteOtherWebSockets();
    setMainMenu(false);
    return () => {
      setLoading(false);
    }
  }
  return (
    <>
      <LoadingModal isLoading={loading}/>
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
