import {Text} from "@react-native-material/core";
import {StyleSheet, View} from "react-native";

export default function Errors({errorMessages}) {
    if (typeof errorMessages === "string") {
      return <Text style={styles.error}>{errorMessages}</Text>
    } else {
      // Assume errorMessages here is an array.
      return (
        <View>
          {errorMessages.map((errorMessage, counter) => (
            <Text key={counter} style={styles.error}>{errorMessage}</Text>
          ))}
        </View>
      )
    }
}

const styles = StyleSheet.create({
  error: {
    color: "red",
  }
});
