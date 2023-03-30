import {StyleSheet, View} from "react-native";
import LoadingContent from "./LoadingContent";

function Loading({isLoading}) {
  return (
    isLoading ? (
      <View style={styles.container}>
        <LoadingContent />
      </View>
    ) : null
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
  },
});

export default Loading;
