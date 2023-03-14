import EmailPassword from "./EmailPassword";
import {StyleSheet, View} from "react-native";
import useJWTStore from "../../store/jwt";

export default function SignUpForm({ navigation }) {
  const { create } = useJWTStore();
  return (
    <View style={styles.container}>
      <EmailPassword
        action={create}
        navigation={navigation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  }
});
