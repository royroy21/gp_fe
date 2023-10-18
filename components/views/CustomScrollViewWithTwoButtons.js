import {ScrollView, StyleSheet, View} from "react-native";
import {Button} from "@react-native-material/core";

function CustomScrollViewWithTwoButtons(props) {
  const {
    children,
    actionButton1Title,
    actionButton1OnPress,
    actionButton2Title,
    actionButton2OnPress,
  } = props;
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ScrollView keyboardShouldPersistTaps={"always"}>
          {children}
        </ScrollView>
      </View>
      <View style={styles.buttonsContainer}>
        <Button
          title={actionButton1Title}
          onPress={actionButton1OnPress}
          style={styles.button}
        />
        <Button
          title={actionButton2Title}
          onPress={actionButton2OnPress}
          style={styles.button}
        />
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
    height: "90%",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "70%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  button: {
    minWidth: 110,
  },
})

export default CustomScrollViewWithTwoButtons;
