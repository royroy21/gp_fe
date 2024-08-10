import {View, StyleSheet, Platform, Dimensions} from "react-native";
import { useForm, Controller }   from "react-hook-form";
import {Button, Switch, Text, useTheme} from "@react-native-material/core";
import Errors from "../forms/Errors";
import TextInput from "../forms/TextInput";
import {formContainerPadding} from "../../helpers/padding";
import {BACKEND_ENDPOINTS, smallScreenWidth} from "../../settings";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import client from "../../APIClient";
import LoadingModal from "../loading/LoadingModal";
import {useState} from "react";

export default function ResetPasswordRequest({ action, navigation }) {
  const theme = useTheme();
  const isWeb = Boolean(Platform.OS === "web");
  const windowWidth = Dimensions.get('window').width;
  const isSmallScreen = windowWidth < smallScreenWidth;

  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { control, handleSubmit, clearErrors } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data) => {
    setError({});
    setLoading(true);
    const params = {
      resource: BACKEND_ENDPOINTS.resetPasswordRequest,
      data: data,
      successCallback: successCallback,
      errorCallback: errorCallback,
    }
    await client.post(params);
  }

  const successCallback = (json) => {
    setSuccess(true);
    setLoading(false);
  }

  const errorCallback = (json) => {
    setError(json);
    setLoading(false);
  }

  return (
    <View style={styles.outContainer}>
      <LoadingModal isLoading={ loading } debugMessage={"from @ResetPasswordRequest"} />
      <View style={isWeb && !isSmallScreen ? {...styles.container, paddingLeft: "35%", paddingRight: "35%"} : styles.container}>
        {success ? (
          <View style={styles.messageContainer}>
          <Text styles={styles.message}>{"Success! Please check your inbox."}</Text>
            <Icon
              name={"pig"}
              size={25}
              color={theme.palette.secondary.main}
            />
          </View>
          ) : (
            <>
              <View style={styles.messageContainer}>
                <Text styles={styles.message}>{"Reset password"}</Text>
                <Icon
                  name={"pig"}
                  size={25}
                  color={theme.palette.secondary.main}
                />
              </View>
              <Controller
                control={control}
                rules={{
                  // required: true,
                }}
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInput
                    label={"email"}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="email"
              />
              {(error.detail) && <Errors errorMessages={error.detail}/>}
              {(error.unExpectedError) && <Errors errorMessages={error.unExpectedError}/>}
              <Button title={"Reset password"} onPress={handleSubmit(onSubmit)}/>
            </>
          )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outContainer: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    paddingLeft: formContainerPadding,
    paddingRight: formContainerPadding,
  },
  messageContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
  },
  message: {
    color: "grey",
  },
});
