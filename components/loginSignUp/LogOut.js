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
import useMyGigsStore from "../../store/myGigs";
import {BACKEND_ENDPOINTS} from "../../settings";
import useUsersStore from "../../store/users";
import useAlbumStore from "../../store/album";
import useAlbumsStore from "../../store/albums";
import useTrackStore from "../../store/track";

function LogOut({navigation, setMainMenu, theme}) {
  const [loading, setLoading] = useState(false);

  // TODO - remember to add extra clear stores here.
  // maybe find a better way to do this?
  const clearAlbum = useAlbumStore((state) => state.clear);
  const clearAlbums = useAlbumsStore((state) => state.clear);
  const clearCountries = useCountriesStore((state) => state.clear);
  const clearCountry = useCountryStore((state) => state.clear);
  const clearGenres = useGenresStore((state) => state.clear);
  const clearGig = useGigStore((state) => state.clear);
  const clearGigs = useGigsStore((state) => state.clear);
  const getGigs = useGigsStore((state) => state.get);
  const clearMyGigs = useMyGigsStore((state) => state.clear);
  const clearJWT = useJWTStore((state) => state.clear);
  const clearOtherUser = useOtherUserStore((state) => state.clear);
  const clearPreviousMessages = usePreviousMessagesStore((state) => state.clear);
  const clearRooms = useRoomsStore((state) => state.clear);
  const clearTracks = useTrackStore((state) => state.clear);
  const clearUnreadMessages = unreadMessagesStore((state) => state.clear);
  const clearUser = useUserStore((state) => state.clear);
  const clearUsers = useUsersStore((state) => state.clear);
  const getUsers = useUsersStore((state) => state.get);

  const logOut = async () => {
    setLoading(true);
    await AsyncStorage.clear();
    clearAlbum();
    clearAlbums();
    clearCountries();
    clearCountry();
    clearGenres();
    clearGig();
    clearGigs();
    clearMyGigs();
    clearJWT();
    clearOtherUser();
    clearPreviousMessages();
    clearRooms();
    clearTracks();
    clearUnreadMessages();
    clearUser();
    clearUsers();
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
