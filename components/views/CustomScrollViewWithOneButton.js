import {ScrollView, StyleSheet, View} from "react-native";
import {Button, Text} from "@react-native-material/core";

function CustomScrollViewWithOneButton(props) {
  const {
    children,
    buttonTitle=null,
    buttonOnPress=null,
    bottomMessage=null,
  } = props;
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ScrollView keyboardShouldPersistTaps={"always"}>
          {children}
        </ScrollView>
      </View>
      <View style={styles.buttonsContainer}>
        {buttonTitle && buttonOnPress ? (
          <Button
            title={buttonTitle}
            onPress={buttonOnPress}
            style={styles.button}
          />
        ) : null}
        {bottomMessage ? (
          <Text style={styles.bottomMessage}>{bottomMessage}</Text>
        ) : null}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    height: "100%",
  },
  content: {
    // marginTop: 10,
    height: "90%",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginTop: 10,
    marginLeft: "auto",
    marginRight: "auto",
  },
  button: {
    minWidth: 110,
  },
  bottomMessage: {
    color: "grey",
  },
})

export default CustomScrollViewWithOneButton;
