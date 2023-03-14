import {StyleSheet, View} from "react-native";
import {Button} from "@react-native-material/core";

function AddGigButton({ navigation }) {
  return (
    <View style={styles.container}>
      <Button
        title={"+"}
        onPress={() => navigation.navigate("AddGig")}
        style={styles.addGigButton}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  addGigButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
  }
});

export default AddGigButton;
