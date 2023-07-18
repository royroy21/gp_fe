import BaseCenteredModal from "./BaseCenteredModal";
import {StyleSheet, View} from "react-native";
import {Button} from "@react-native-material/core";

const Buttons = ({showModal, setModal, actionButton, otherButton=null}) => {
  return (
    <View style={styles.container}>
      {actionButton}
      {otherButton || (
        <Button
          style={styles.button}
          title={"close"}
          onPress={() => setModal(!showModal)}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  button: {
    width: 100,
  },
});

const CenteredModalWithTwoButton = (props) => {
  const {
    showModal,
    setModal,
    children,
    actionButton,
    otherButton=null,
  } = props;
  return (
    <BaseCenteredModal
      showModal={showModal}
      setModal={setModal}
      buttons={
        <Buttons
          showModal={showModal}
          setModal={setModal}
          actionButton={actionButton}
          otherButton={otherButton}
        />
      }
    >
      {children}
    </BaseCenteredModal>
  )
}

export default CenteredModalWithTwoButton;