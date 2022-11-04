import EmailPassword from "./EmailPassword";
import {StyleSheet, View} from "react-native";

export default function SignUpForm({ navigation }) {
  return (
    <View style={styles.container}>
      <EmailPassword navigation={navigation} targetResource={"user"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",  // Center content vertically.
  }
});
