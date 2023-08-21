import {Image, Platform, StyleSheet, View} from "react-native";
import {Text} from "@react-native-material/core";

function LoadingContent() {
  const isWeb = Boolean(Platform.OS === "web");
  return (
    <View style={styles.content}>
      {isWeb ? (
        <View style={styles.webContainer}>
          <Text style={styles.webText}>{"LOADING"}</Text>
        </View>
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
  webContainer: {
    backgroundColor: "grey",
  },
  webText: {
    fontSize: 20,
  }
});

export default LoadingContent;
