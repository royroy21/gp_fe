import {View, StyleSheet} from "react-native";
import { useForm, Controller }   from "react-hook-form";
import {Button, Switch} from "@react-native-material/core";
import {useState} from "react";
import Errors from "../forms/Errors";
import TextInput from "../forms/TextInput";
import {formContainerPadding} from "../../helpers/padding";
import LoadingModal from "../loading/LoadingModal";
import useUserStore from "../../store/user";
import useJWTStore from "../../store/jwt";
import useLastRouteStore from "../../store/lastRoute";

export default function EmailPassword({ action, navigation, children }) {
  const {
    loading,
    error,
  } = useJWTStore();

  const { object: lastRoute } = useLastRouteStore();

  const {
    me,
    loading: loadingUser,
    error: errorUser,
  } = useUserStore();

  const [showPassword, setShowPassword] = useState(false);
  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    await action(data, onSuccess);
  }

  const onSuccess = async () => {
    await me();
    if (lastRoute) {
      if (lastRoute.params) {
        navigation.push(lastRoute.name, lastRoute.params);
      } else {
        navigation.navigate(lastRoute.name);
      }
    } else {
      navigation.navigate("DefaultScreen");
    }
    return () => {
      setShowPassword(false);
    };
  }

  const parsedError = error || {};
  const parsedGetUserError = errorUser || {};
  return (
    <View style={styles.container}>
      <LoadingModal isLoading={loading || loadingUser} debugMessage={"from @EmailPassword"}/>
      {(parsedError.detail) && <Errors errorMessages={parsedError.detail} />}
      {(parsedError.unExpectedError) && <Errors errorMessages={parsedError.unExpectedError} />}
      {(parsedGetUserError.detail) && <Errors errorMessages={parsedGetUserError.detail} />}
      {(parsedGetUserError.unExpectedError) && <Errors errorMessages={parsedGetUserError.unExpectedError} />}
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
      <View style={styles.children} >
        { children }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: formContainerPadding,
    paddingRight: formContainerPadding,
  },
  children: {
    marginTop: 40,
  },
});
