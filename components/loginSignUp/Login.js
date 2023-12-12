import EmailPassword from "./EmailPassword";
import {Button} from "@react-native-material/core";
import {StyleSheet, View} from "react-native";
import useJWTStore from "../../store/jwt";

export default function LoginForm({ navigation }) {
  const login = useJWTStore((state) => state.login);
  return (
    <View style={styles.container}>
      <EmailPassword action={login} navigation={navigation}>
        <Button
          title={"sign up"}
          uppercase={false}
          variant={"text"}
          onPress={() => navigation.push("SignUpScreen")}
        />
      </EmailPassword>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  }
});
