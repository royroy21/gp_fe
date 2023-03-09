import {Image, Modal, StyleSheet, View} from "react-native";

function LoadingModal({isLoading}) {
  return (
    <Modal
      animationType={"none"}
      transparent={true}
      visible={isLoading}
    >
      <View style={styles.container}>
        <Image style={styles.image} source={require("../../assets/squaresWave.gif")} />
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#000000",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.7,
  },
  image: {
    borderRadius: 5,
  },
});

export default LoadingModal;
