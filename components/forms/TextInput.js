import {TextInput as MaterialTextInput} from "@react-native-material/core";
import {Platform} from "react-native";


export default function TextInput(props) {
  return (
    <MaterialTextInput
      inputStyle={Platform.OS === "web" && {outline: "none"}}
      variant={"filled"}
      {...props}
    />
  )
}
