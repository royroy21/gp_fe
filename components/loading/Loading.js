import {Image, StyleSheet, View} from "react-native";

function Loading({isLoading}) {
  return (
    isLoading ? (
      <View style={styles.container}>
        <Image style={styles.image} source={require("../../assets/squaresWave.gif")} />
      </View>
    ) : null
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  image: {
    borderRadius: 5,
  },
});

export default Loading;
