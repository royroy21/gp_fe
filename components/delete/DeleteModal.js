import CenteredModalWithTwoButton from "../centeredModal/CenteredModalWithTwoButtons";
import {Button, Text, useTheme} from "@react-native-material/core";
import {StyleSheet, View} from "react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import Errors from "../forms/Errors";

function DeleteModal({ showModal, setModal, action, error }) {
  const theme = useTheme();

  const parsedErrors = error || {};
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
        <View style={styles.textAndErrorsContainer}>
          {error ? (
            Object.entries(parsedErrors).map(([key, value]) => {
              return <Errors key={key} errorMessages={value} />
            })
          ) : (
            <Text style={styles.message}>{"Are you sure?"}</Text>
          )}
        </View>
        <Icon
          name={"pig"}
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
    borderRadius: 5,
    width: 300,
    marginLeft: "auto",
    marginRight: "auto",
  },
  textAndErrorsContainer: {
    flexDirection: "column",
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
