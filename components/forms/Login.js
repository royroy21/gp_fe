import {Dimensions, View, StyleSheet} from "react-native";
import { useForm, Controller }   from "react-hook-form";
import {Button, Text, Switch} from "@react-native-material/core";
import {useAsyncStorage} from "@react-native-async-storage/async-storage";
import client from "../../APIClient";
import {useEffect, useState} from "react";
import Errors from "./Errors";
import TextInput from "./TextInput";

export default function LoginForm({ navigation }) {
  const { getItem, setItem } = useAsyncStorage("jwt");
  const [jwt, setJWT] = useState(null);
  const [error, setError] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = data => {
    setError({})
    const params = {
      resource: "token",
      data: data,
      successCallback: setJWT,
      errorCallback: setError,
    };
    client.post(params);
  }

  const onSuccess = () => {
    if (!jwt) {
      return
    }
    setItem(JSON.stringify(jwt));
    setJWT(null)
    navigation.navigate("DefaultScreen")
  }

  useEffect(onSuccess, [jwt]);

  return (
    <View style={styles.container}>
      {(error.detail) && <Errors errorMessages={error.detail} />}
      {(error.unExpectedError) && <Errors errorMessages={error.unExpectedError} />}
      <Controller
        control={control}
        rules={{
         // required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label={"email"}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="email"
      />
      {error.email && <Errors errorMessages={error.email} />}
      {errors.firstName && <Text>This is required.</Text>}
      <Controller
        control={control}
        rules={{
         // required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label={"password"}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry={!showPassword}
            trailing={
              <Switch
                value={showPassword}
                onValueChange={() => setShowPassword(!showPassword)}
              />
            }
          />
        )}
        name="password"
      />
      {error.password && <Errors errorMessages={error.password} />}
      <Button title="submit" onPress={handleSubmit(onSubmit)} />
    </View>
  );
}

const windowWidth = Dimensions.get('window').width;

// Different percent used here based upon screen size.
const containerPadding = windowWidth < 500 ? (windowWidth * 20)/100 : (windowWidth * 40)/100;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: containerPadding,
    paddingRight: containerPadding,
    justifyContent: "center",  // Center content vertically.
  }
});
