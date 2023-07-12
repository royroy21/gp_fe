import {ListItem, Text, useTheme} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import CustomScrollViewWithTwoButtons from "../views/CustomScrollViewWithTwoButtons";
import {View} from "react-native";
import React, {useState} from "react";
import Errors from "../forms/Errors";
import LoadingModal from "../loading/LoadingModal";
import newMessage from "../message/newMessage";
import useJWTStore from "../../store/jwt";

function OtherUser({ route, navigation }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const {object: jwt} = useJWTStore();
  if (!jwt) {
    navigation.navigate("DefaultScreen");
  }
  const accessToken = JSON.parse(jwt).access;
  const theme = useTheme();
  const { user } = route.params;
  const directMessage = () => {
    const newMessageArguments = {
      navigation: navigation,
      parameters: "?type=direct&to_user_id=" + user.id,
      accessToken: accessToken,
      setLoading: setLoading,
      setError: setError,
    }
    newMessage(newMessageArguments);
  }

  const parsedError = error || {};
  return (
    <>
      {(parsedError.detail) && <Errors errorMessages={parsedError.detail} />}
      <LoadingModal isLoading={loading} />
      <CustomScrollViewWithTwoButtons
        actionButtonTitle={"message"}
        actionButtonOnPress={directMessage}
        backButtonTitle={"go back"}
        backButtonOnPress={navigation.goBack}
      >
        <View>
          <ListItem
            title={<Text>{user.username}</Text>}
            trailing={
              <Icon
                name={"account"}
                size={25}
                color={theme.palette.secondary.main}
              />
            }
          />
          <ListItem
            title={user.distance_from_user ? (
              <Text>{`last seen ${user.distance_from_user} from you`}</Text>
              ) : (
                <Text>{"last seen unknown"}</Text>
            )}
            trailing={
              <Icon
                name={"map"}
                size={25}
                color={theme.palette.secondary.main}
              />
            }
          />
        </View>
      </CustomScrollViewWithTwoButtons>
    </>
  )
}

export default OtherUser;
