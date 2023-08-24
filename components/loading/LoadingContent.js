import {Image, Platform, StyleSheet, View} from "react-native";

function LoadingContent() {
  const isWeb = Boolean(Platform.OS === "web");
  return (
    <View style={styles.content}>
      {isWeb ? (
        <img src={require("../../assets/squaresWave.gif")} alt={"LOADING"} />
      ) : (
        <Image source={require("../../assets/squaresWave.gif")}/>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  content: {
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  webText: {
    fontSize: 20,
  }
});

export default LoadingContent;
