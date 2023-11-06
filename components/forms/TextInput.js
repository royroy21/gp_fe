import {TextInput as MaterialTextInput} from "@react-native-material/core";
import {Platform} from "react-native";

function TextInput(props) {
  const isWeb = Boolean(Platform.OS === "web");
  const { multiline } = props;

  const inputStyle = isWeb ? {outline: "none"} : {};
  if (multiline && isWeb) {
    inputStyle.paddingTop = 30;
    inputStyle.height = 100;
  }
  return (
    <MaterialTextInput
      inputStyle={inputStyle}
      variant={"filled"}
      autoCapitalize={"none"}
      {...props}
    />
  )
}

export default TextInput;
