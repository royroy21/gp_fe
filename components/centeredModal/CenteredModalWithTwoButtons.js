import BaseCenteredModal from "./BaseCenteredModal";
import {StyleSheet, View} from "react-native";
import {Button} from "@react-native-material/core";

const Buttons = ({showModal, setModal, actionButton, otherButton=null}) => {
  return (
    <View style={styles.container}>
      {otherButton || (
        <Button
          style={styles.button}
          title={"close"}
          onPress={() => setModal(!showModal)}
        />
      )}
      {actionButton}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 10,
    marginTop: 30,
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
    forceWidth50Percent=true,
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
          forceWidth50Percent={forceWidth50Percent}
        />
      }
    >
      {children}
    </BaseCenteredModal>
  )
}

export default CenteredModalWithTwoButton;
