import {ScrollView, StyleSheet, View} from "react-native";
import {Button} from "@react-native-material/core";

function CustomScrollViewWithOneButton(props) {
  const {
    children,
    buttonTitle,
    buttonOnPress,
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
    marginTop: 10,
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
})

export default CustomScrollViewWithOneButton;
