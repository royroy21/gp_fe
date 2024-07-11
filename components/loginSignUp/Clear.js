import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingModal from "../loading/LoadingModal";
import React, {useEffect, useState} from "react";
import {closeAndDeleteOtherWebSockets} from "../message";
import clearAll from "../../store/clearAll";
import PleaseLoginMessage from "./PleaseLoginMessage";
import {useTheme} from "@react-native-material/core";

function Clear({ navigation }) {
  // Used in emergencies to clear all local data then re-direct to the home page.

  const theme = useTheme()
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const clear = async () => {
      setLoading(true);
      await AsyncStorage.clear();
      clearAll();
      closeAndDeleteOtherWebSockets();
      setLoading(false);
      navigation.push("DefaultScreen");
    };
    clear();
  }, []);

  return (
    <>
      <LoadingModal isLoading={loading} debugMessage={"from @Clear"}/>
      <PleaseLoginMessage theme={theme} />
    </>
  )
}

export default Clear;
