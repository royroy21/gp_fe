import {StyleSheet, View} from "react-native";
import {Text} from "@react-native-material/core";

function TextFieldWithTitle(props) {
  const {
    title,
    text,
    trailing=null,
    style={},
  } = props;
  return (
    <View style={{...styles.container, ...style}}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{text}</Text>
        {trailing ? (
          trailing
        ) : null}
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
    fontSize: 16,
    width: "90%",
  },
  trailingIcon: {
    marginLeft: "auto",
  },
})

export default TextFieldWithTitle;
