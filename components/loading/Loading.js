import {StyleSheet, View} from "react-native";
import LoadingContent from "./LoadingContent";

function Loading({isLoading, positionTop=false}) {
  const style = positionTop ? styles.containerTop : styles.containerBottom;
  return (
    isLoading ? (
      <View style={style}>
        <LoadingContent />
      </View>
    ) : null
  )
}

const styles = StyleSheet.create({
  containerTop: {
    width: "100%",
    alignItems: "center",
    position: "absolute",
    top: 0,
  },
  containerBottom: {
    width: "100%",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
  },
});

export default Loading;
