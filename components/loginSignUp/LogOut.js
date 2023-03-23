import {IconButton} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import useUserStore from "../../store/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useCountryStore from "../../store/country";
import useGenresStore from "../../store/genres";
import useGigStore from "../../store/gig";
import useJWTStore from "../../store/jwt";
import useCountriesStore from "../../store/countries";
import LoadingModal from "../loading/LoadingModal";
import {useState} from "react";

function LogOut({navigation, setMainMenu, theme}) {
  const [loading, setLoading] = useState(false);

  // TODO - remember to add extra clear stores here.
  // maybe find a better way to do this?
  const { clear: clearCountries } = useCountriesStore();
  const { clear: clearCountry } = useCountryStore();
  const { clear: clearGenres } = useGenresStore();
  const { clear: clearGigs } = useGigStore();
  const { clear: clearJWT } = useJWTStore();
  const { clear: clearUser } = useUserStore();
  const logOut = async () => {
    setLoading(true);
    navigation.navigate("DefaultScreen");
    await AsyncStorage.clear();
    clearCountries();
    clearCountry();
    clearGenres();
    clearGigs();
    clearJWT();
    clearUser();
    setMainMenu(false);
    return () => {
      setLoading(false);
    }
  }
  return (
    <>
      <LoadingModal isLoading={loading}/>
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
    </>
  )
}

export default LogOut;
