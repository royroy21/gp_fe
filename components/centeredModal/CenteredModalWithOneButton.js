import BaseCenteredModal from "./BaseCenteredModal";
import {StyleSheet, View} from "react-native";
import {Button} from "@react-native-material/core";

const CloseButton = ({showModal, setModal}) => {
  return (
    <View style={styles.container}>
      <Button
        style={styles.closeButton}
        title={"close"}
        onPress={() => setModal(!showModal)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 30,
  },
  closeButton: {
    width: 100,
  },
});

const CenteredModalWithOneButton = ({showModal, setModal, children, button=null}) => {
  return (
    <BaseCenteredModal
      showModal={showModal}
      setModal={setModal}
      buttons={button || <CloseButton showModal={showModal} setModal={setModal} />}
    >
      {children}
    </BaseCenteredModal>
  )
}

export default CenteredModalWithOneButton;
