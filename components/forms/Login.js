import EmailPassword from "./EmailPassword";
import {Button} from "@react-native-material/core";
import {StyleSheet, View} from "react-native";
import {BACKEND_ENDPOINTS} from "../../settings";

export default function LoginForm({ navigation }) {
  return (
    <View style={styles.container}>
      <EmailPassword navigation={navigation} targetResource={BACKEND_ENDPOINTS.token} />
      <Button
        title={"sign up"}
        uppercase={false}
        variant={"text"}
        onPress={() => navigation.navigate("SignUpScreen")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",  // Center content vertically.
  }
});
