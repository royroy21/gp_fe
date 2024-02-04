import {IconButton} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

function GoBackButton({navigation, route}) {
  return (
    route.name !== "DefaultScreen" ? (
      <IconButton
        onPress={navigation.goBack}
        icon={
          <Icon
            name={"chevron-left"}
            color={"grey"}
            size={30}
          />
        }
      />
    ) : null
  )
}

export default GoBackButton;
