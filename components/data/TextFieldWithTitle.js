import {StyleSheet, View} from "react-native";
import {Text} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

function TextFieldWithTitle(props) {
  const {
    title,
    text,
    theme,
    trailingIconName=null,
    style={},
  } = props;
  return (
    <View style={{...styles.container, ...style}}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{text}</Text>
        {trailingIconName ? (
          <Icon
            name={trailingIconName}
            size={25}
            color={theme.palette.secondary.main}
            style={styles.trailingIcon}
          />
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
