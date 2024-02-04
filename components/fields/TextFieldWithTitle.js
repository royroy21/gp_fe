import {StyleSheet, View} from "react-native";
import {Text} from "@react-native-material/core";

function TextFieldWithTitle(props) {
  const {
    title,
    text=null,
    trailing=null,
    redText=false,
    style={},
  } = props;
  return (
    <View style={{...styles.container, ...style}}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.textContainer}>
        {text ? <Text style={{"color": redText ? "red" : undefined, ...styles.text}}>{text}</Text>: null}
        {trailing ? trailing : null}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 12,
    paddingRight: 12,
    margin: 5,
    width: "98%",
  },
  title: {
    fontSize: 12,
    color: "gray",
  },
  textContainer: {
    flexDirection: "row"
  },
  text: {
    color: "white",
    fontSize: 16,
    width: "90%",
  },
  trailingIcon: {
    marginLeft: "auto",
  },
})

export default TextFieldWithTitle;
