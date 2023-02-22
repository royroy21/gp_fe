import {View, StyleSheet} from "react-native";
import { useForm, Controller }   from "react-hook-form";
import {Button, Switch} from "@react-native-material/core";
import AsyncStorage, {useAsyncStorage} from "@react-native-async-storage/async-storage";
import client from "../../APIClient";
import {useContext, useEffect, useState} from "react";
import Errors from "./Errors";
import TextInput from "./TextInput";
import {formContainerPadding} from "../../helpers/padding";
import Loading from "./Loading";
import {UserContext} from "../context/user";
import getUserFromBackend from "../../helpers/getUserFromBackend";

export default function EmailPassword({ navigation, targetResource, children }) {
  const { setUser } = useContext(UserContext);
  const { setItem: setJWTToAsyncStorage } = useAsyncStorage("jwt");
  const [jwt, setJWT] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
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

    setError(null)
    const params = {
      resource: targetResource,
      data: data,
      successCallback: setJWT,
      errorCallback: onError,
    };
    if (isMounted) {
      setLoading(true);
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
    await getUserFromBackend(jwt, setUser);
    navigation.navigate("DefaultScreen");
    return () => {
      setJWT(null);
      setError(null);
      setLoading(false);
      setShowPassword(false);
    };
  }

  const onError = (error) => {
    setLoading(false);
    setError(error);
  }

  useEffect(() => {onSuccess()}, [jwt]);

  const parsedError = error || {};
  return (
    <View style={styles.container}>
      <Loading isLoading={loading} />
      {(parsedError.detail) && <Errors errorMessages={parsedError.detail} />}
      {(parsedError.unExpectedError) && <Errors errorMessages={parsedError.unExpectedError} />}
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
      {parsedError.email && <Errors errorMessages={parsedError.email} />}
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
      {parsedError.password && <Errors errorMessages={parsedError.password} />}
      <Button title={"submit"} onPress={handleSubmit(onSubmit)} />
      { children }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: formContainerPadding,
    paddingRight: formContainerPadding,
  }
});
