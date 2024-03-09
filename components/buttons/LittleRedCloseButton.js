import {View} from "react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

function LittleRedCloseButton({ action, style }) {
  return (
    <View style={style}>
      <Icon
        name={"close-box"}
        color={"red"}
        size={30}
        onPress={action}
      />
    </View>
  )
}

export default LittleRedCloseButton;
