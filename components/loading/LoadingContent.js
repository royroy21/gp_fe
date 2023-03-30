import {Image, StyleSheet, View} from "react-native";

function LoadingContent() {
  return (
    <View style={styles.content}>
      <Image source={require("../../assets/squaresWave.gif")}/>
    </View>
  )
}

const styles = StyleSheet.create({
  content: {
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoadingContent;
