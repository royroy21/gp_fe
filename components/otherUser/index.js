import {ListItem, Text, useTheme} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import {useEffect} from "react";
import LoadingModal from "../loading/LoadingModal";
import Errors from "../forms/Errors";
import useOtherUserStore from "../../store/otherUser";
import CustomScrollViewWithOneButton from "../views/CustomScrollViewWithOneButton";
import {View} from "react-native";

function OtherUser({ route, navigation }) {
  const theme = useTheme();
  const { get, object, loading, error } = useOtherUserStore();

  useEffect(() => {
    get(route.params.id);
  }, [])

  const parsedError = error || {};
  return (
    <CustomScrollViewWithOneButton
      buttonTitle={"go back"}
      buttonOnPress={navigation.goBack}
    >
      <LoadingModal isLoading={loading} />
      {(parsedError.detail) && <Errors errorMessages={parsedError.detail} />}
      {(parsedError.unExpectedError) && <Errors errorMessages={parsedError.unExpectedError} />}
      {object ? (
        <View>
          <ListItem
            title={<Text>{object.username}</Text>}
            trailing={
              <Icon
                name={"account"}
                size={25}
                color={theme.palette.secondary.main}
              />
            }
          />
          <ListItem
            title={object.distance_from_user ? (
              <Text>{`last seen ${object.distance_from_user} away from you`}</Text>
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
      ) : null}
      </CustomScrollViewWithOneButton>
  )
}

export default OtherUser;
