import {Modal, StyleSheet, View} from "react-native";
import LoadingContent from "./LoadingContent";

function LoadingModal({isLoading}) {
  return (
    <Modal
      animationType={"none"}
      transparent={true}
      visible={isLoading}
    >
      <View style={styles.container}>
        <LoadingContent />
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoadingModal;
