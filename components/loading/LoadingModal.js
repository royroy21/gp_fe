import {Modal, StyleSheet, View} from "react-native";
import {DEBUG} from "../../settings";
import LoadingContent from "./LoadingContent";
import {Text} from "@react-native-material/core";

function LoadingModal({ isLoading, debugMessage=null }) {
  return (
    <Modal
      animationType={"none"}
      transparent={true}
      visible={isLoading}
    >
      <View style={styles.container}>
        <LoadingContent />
        {DEBUG && debugMessage && <Text style={{color: "red"}}>{debugMessage}</Text>}
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
