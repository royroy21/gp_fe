import {ListItem, Text, useTheme} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import CustomScrollViewWithOneButton from "../views/CustomScrollViewWithOneButton";
import {View} from "react-native";

function OtherUser({ route, navigation }) {
  const theme = useTheme();
  const { user } = route.params;

  return (
    <CustomScrollViewWithOneButton
      buttonTitle={"go back"}
      buttonOnPress={navigation.goBack}
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
      </CustomScrollViewWithOneButton>
  )
}

export default OtherUser;
