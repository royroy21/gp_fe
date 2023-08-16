import useUserStore from "../../store/user";
import {ListItem, Text, useTheme} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import LoadingModal from "../loading/LoadingModal";
import Errors from "../forms/Errors";
import CustomScrollViewWithOneButton from "../views/CustomScrollViewWithOneButton";

function Settings({ navigation }) {
  const theme = useTheme();
  const { object, patch, loading, error } = useUserStore();

  const themeOnPress = () => {
    const data = {
      theme: object.theme === "dark" ? "light" : "dark",
    }
    patch(object.id, data);
  }

  const getPreferredUnits = () => {
    if (object.preferred_units) {
      return object.preferred_units;
    } else {
      return object.units;
    }
  }

  const MILES = "miles";
  const KM = "kilometers";
  const setPreferredUnits = () => {
    if (object.units && !object.preferred_units) {
      return object.units === MILES ? KM : MILES;
    } else if (object.preferred_units) {
      return object.preferred_units === MILES ? KM : MILES;
    }
  }

  const preferredUnitsOnPress = () => {
    const data = {
      preferred_units: setPreferredUnits(object),
    }
    patch(object.id, data);
  }

  const subscribeToEmailOnPress = () => {
    const data = {
      subscribed_to_emails: !object.subscribed_to_emails,
    }
    patch(object.id, data);
  }

  const parsedError = error || {};
  return (
    <CustomScrollViewWithOneButton>
      <LoadingModal isLoading={loading} />
      {(parsedError.detail) && <Errors errorMessages={parsedError.detail} />}
      {(parsedError.unExpectedError) && <Errors errorMessages={parsedError.unExpectedError} />}
      <ListItem
        title={<Text>{`theme: ${object.theme}`}</Text>}
        onPress={themeOnPress}
        trailing={
          <Icon
            name="theme-light-dark"
            size={25}
            color={object.theme === "light" ? theme.palette.secondary.main : "grey"}
            onPress={themeOnPress}
          />
        }
      />
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
            color={object.subscribed_to_emails ? theme.palette.secondary.main : "grey"}
            onPress={subscribeToEmailOnPress}
          />
        }
      />
      {parsedError.subscribed_to_emails && <Errors errorMessages={parsedError.subscribed_to_emails} />}
    </CustomScrollViewWithOneButton>
  )
}

export default Settings;
