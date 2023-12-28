import {View, StyleSheet, Platform, Dimensions} from "react-native";
import { useForm, Controller }   from "react-hook-form";
import {Button, Switch, Text, useTheme} from "@react-native-material/core";
import {useCallback, useState} from "react";
import Errors from "../forms/Errors";
import TextInput from "../forms/TextInput";
import {formContainerPadding} from "../../helpers/padding";
import LoadingModal from "../loading/LoadingModal";
import useUserStore from "../../store/user";
import useJWTStore from "../../store/jwt";
import useLastRouteStore from "../../store/lastRoute";
import {useFocusEffect} from "@react-navigation/native";
import {smallScreenWidth} from "../../settings";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import client from "../../APIClient";

export default function EmailPassword({ action, navigation, route, children, isSignUp=false }) {
  const theme = useTheme();
  const isWeb = Boolean(Platform.OS === "web");
  const windowWidth = Dimensions.get('window').width;
  const isSmallScreen = windowWidth < smallScreenWidth;

  const loading = useJWTStore((state) => state.loading);
  const error = useJWTStore((state) => state.error);

  const lastRoute = useLastRouteStore((state) => state.object);

  const me = useUserStore((state) => state.me);
  const loadingUser = useUserStore((state) => state.loading);
  const errorUser = useUserStore((state) => state.error);

  const [showPassword, setShowPassword] = useState(false);
  const { control, handleSubmit, clearErrors } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useFocusEffect(
    useCallback(() => {
      clearErrors();
    }, [])
  );

  const onSubmit = async (data) => {
    await action(data, onSuccess, client.post);
  }

  const onSuccess = async () => {
    await me();
    if (isSignUp) {
      return navigation.push("DefaultScreen");
    }

    if (lastRoute) {
      if (lastRoute.params) {
        navigation.push(lastRoute.name, lastRoute.params);
      } else {
        navigation.push(lastRoute.name);
      }
    } else {
      navigation.push("DefaultScreen");
    }
    return () => {
      setShowPassword(false);
    };
  }

  const parsedError = error || {};
  const parsedGetUserError = errorUser || {};
  return (
    <View style={isWeb && !isSmallScreen ? {...styles.container, paddingLeft: "35%", paddingRight: "35%"} : styles.container}>
      <View style={styles.welcome}>
        <Text styles={styles.welcomeMessage}>{"The GigPig welcomes you "}</Text>
        <Icon
          name={"pig"}
          size={25}
          color={theme.palette.secondary.main}
        />
      </View>
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
      <Button title={isSignUp ? "signup" : "login"} onPress={handleSubmit(onSubmit)} />
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
  welcome: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
  },
  welcomeMessage: {
    color: "grey",
  },
  children: {
    marginTop: 40,
  },
});
