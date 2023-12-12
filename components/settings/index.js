import useUserStore from "../../store/user";
import {ListItem, Text, useTheme} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import LoadingModal from "../loading/LoadingModal";
import Errors from "../forms/Errors";
import CustomScrollViewWithOneButton from "../views/CustomScrollViewWithOneButton";
import PleaseLoginMessage from "../loginSignUp/PleaseLoginMessage";
import React from "react";
import {ALLOW_LIGHT_THEME_OPTION} from "../../settings";

function Settings({ navigation }) {
  const theme = useTheme();

  const user = useUserStore((state) => state.object);
  const patch = useUserStore((state) => state.patch);
  const loading = useUserStore((state) => state.loading);
  const error = useUserStore((state) => state.error);

  const themeOnPress = () => {
    const data = {
      theme: user.theme === "dark" ? "light" : "dark",
    }
    patch(user.id, data);
  }

  const getPreferredUnits = () => {
    if (user.preferred_units) {
      return user.preferred_units;
    } else {
      return user.units;
    }
  }

  const MILES = "miles";
  const KM = "kilometers";
  const setPreferredUnits = () => {
    if (user.units && !user.preferred_units) {
      return user.units === MILES ? KM : MILES;
    } else if (user.preferred_units) {
      return user.preferred_units === MILES ? KM : MILES;
    }
  }

  const preferredUnitsOnPress = () => {
    const data = {
      preferred_units: setPreferredUnits(user),
    }
    patch(user.id, data);
  }

  const subscribeToEmailOnPress = () => {
    const data = {
      subscribed_to_emails: !user.subscribed_to_emails,
    }
    patch(user.id, data);
  }

  if (!user) {
    return (
      <PleaseLoginMessage theme={theme} />
    )
  }

  const parsedError = error || {};
  return (
    <CustomScrollViewWithOneButton>
      <LoadingModal isLoading={loading} />
      {(parsedError.detail) && <Errors errorMessages={parsedError.detail} />}
      {(parsedError.unExpectedError) && <Errors errorMessages={parsedError.unExpectedError} />}
      {ALLOW_LIGHT_THEME_OPTION ? (
        <ListItem
          title={<Text>{`theme: ${user.theme}`}</Text>}
          onPress={themeOnPress}
          trailing={
            <Icon
              name="theme-light-dark"
              size={25}
              color={user.theme === "light" ? theme.palette.secondary.main : "grey"}
              onPress={themeOnPress}
            />
          }
        />
      ) : null}
      {parsedError.theme && <Errors errorMessages={parsedError.theme} />}
      <ListItem
        title={<Text>{`your preferred units are ${getPreferredUnits()}`}</Text>}
        onPress={preferredUnitsOnPress}
        trailing={
          <Icon
            name="road"
            size={25}
            color={getPreferredUnits() === MILES ? theme.palette.secondary.main : "grey"}
            onPress={preferredUnitsOnPress}
          />
        }
      />
      {parsedError.preferred_units && <Errors errorMessages={parsedError.preferred_units} />}
      <ListItem
        title={<Text>{"subscribe to email?"}</Text>}
        onPress={subscribeToEmailOnPress}
        trailing={
          <Icon
            name={"email"}
            size={25}
            color={user.subscribed_to_emails ? theme.palette.secondary.main : "grey"}
            onPress={subscribeToEmailOnPress}
          />
        }
      />
      {parsedError.subscribed_to_emails && <Errors errorMessages={parsedError.subscribed_to_emails} />}
    </CustomScrollViewWithOneButton>
  )
}

export default Settings;
