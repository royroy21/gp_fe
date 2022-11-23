import {View, StyleSheet} from "react-native";
import { useForm, Controller }   from "react-hook-form";
import {Button, Text, Switch} from "@react-native-material/core";
import AsyncStorage, {useAsyncStorage} from "@react-native-async-storage/async-storage";
import client from "../../APIClient";
import {useEffect, useState} from "react";
import Errors from "./Errors";
import TextInput from "./TextInput";
import {formContainerPadding} from "../../helpers/padding";

export default function EmailPassword({ navigation, targetResource }) {
  const { setItem: setJWTToAsyncStorage } = useAsyncStorage("jwt");
  const [jwt, setJWT] = useState(null);
  const [error, setError] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    // isMounted stops this:  Can't perform a React state update on an unmounted component.
    // https://bobbyhadz.com/blog/react-cant-perform-react-state-update-on-unmounted-component
    let isMounted = true;

    setError({})
    const params = {
      resource: targetResource,
      data: data,
      successCallback: setJWT,
      errorCallback: setError,
    };
    if (isMounted) {
      await client.post(params);
    }
    return () => {
      isMounted = false;
    };
  }

  const onSuccess = async () => {
    if (!jwt) {
      return
    }
    await AsyncStorage.clear();
    await setJWTToAsyncStorage(JSON.stringify(jwt));
    setJWT(null);
    navigation.push("DefaultScreen");
  }

  useEffect(() => {onSuccess()}, [jwt]);

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
      <Button title={"submit"} onPress={handleSubmit(onSubmit)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: formContainerPadding,
    paddingRight: formContainerPadding,
  }
});
