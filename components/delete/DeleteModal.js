import CenteredModalWithTwoButton from "../centeredModal/CenteredModalWithTwoButtons";
import {Button, Text, useTheme} from "@react-native-material/core";
import {StyleSheet, View} from "react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

function DeleteModal({ showModal, setModal, action }) {
  const theme = useTheme();
  return (
    <CenteredModalWithTwoButton
      showModal={showModal}
      setModal={setModal}
      forceWidth50Percent={false}
      actionButton={
        <Button
          style={styles.button}
          title={"delete"}
          onPress={action}
        />
      }
    >
      <View style={styles.container}>
        <Text style={styles.message}>{"Are you sure?"}</Text>
        <Icon
          name={"emoticon-frown"}
          size={25}
          color={theme.palette.secondary.main}
        />
      </View>
    </CenteredModalWithTwoButton>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "grey",
    borderRadius: 5,
    width: "55%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  button: {
    width: 100,
    backgroundColor: "red",
  },
  message: {
    textAlign: "center",
  },
})

export default DeleteModal;
