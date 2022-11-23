import EmailPassword from "./EmailPassword";
import {StyleSheet, View} from "react-native";
import {BACKEND_ENDPOINTS} from "../../settings";

export default function SignUpForm({ navigation }) {
  return (
    <View style={styles.container}>
      <EmailPassword navigation={navigation} targetResource={BACKEND_ENDPOINTS.user} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",  // Center content vertically.
  }
});
