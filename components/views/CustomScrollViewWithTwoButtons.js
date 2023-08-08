import {ScrollView, StyleSheet, View} from "react-native";
import {Button} from "@react-native-material/core";

function CustomScrollViewWithTwoButtons(props) {
  const {
    children,
    actionButtonTitle,
    actionButtonOnPress,
    backButtonTitle,
    backButtonOnPress,
  } = props;
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ScrollView>
          {children}
        </ScrollView>
      </View>
      <View style={styles.buttonsContainer}>
        <Button
          title={backButtonTitle}
          onPress={backButtonOnPress}
          style={styles.closeButton}
        />
        <Button
          title={actionButtonTitle}
          onPress={actionButtonOnPress}
          style={styles.submitButton}
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
    marginTop: 10,
    height: "90%",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "70%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  backButton: {
    minWidth: 110,
  },
  submitButton: {
    minWidth: 110,
  },
})

export default CustomScrollViewWithTwoButtons;
