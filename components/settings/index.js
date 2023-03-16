import useUserStore from "../../store/user";
import {Button, ListItem, Text, useTheme} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import {useEffect} from "react";
import LoadingModal from "../loading/LoadingModal";
import {StyleSheet, View} from "react-native";
import Errors from "../forms/Errors";

function Settings({ navigation }) {
  const theme = useTheme();
  const { me, object, patch, loading, error } = useUserStore();

  useEffect(() => {
    me();
  }, [])

  const parsedError = error || {};
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <LoadingModal isLoading={loading} />
        {(parsedError.detail) && <Errors errorMessages={parsedError.detail} />}
        {(parsedError.unExpectedError) && <Errors errorMessages={parsedError.unExpectedError} />}
        <ListItem
          title={<Text>{`theme: ${object.theme}`}</Text>}
          trailing={
            <Icon
              name="theme-light-dark"
              size={25}
              color={theme.palette.secondary.main}
              onPress={() => {
                const data = {
                  theme: object.theme === "dark" ? "light" : "dark",
                }
                patch(object.id, data);
              }}
            />
          }
        />
        {parsedError.theme && <Errors errorMessages={parsedError.theme} />}
      </View>
      <View style={styles.buttonsContainer}>
        <Button
          title={"back"}
          onPress={() => {
            navigation.goBack()
          }}
          style={styles.closeButton}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    height: "100%",
  },
  content: {
    marginTop: 10,
    height: "80%",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginTop: 40,
    marginLeft: "auto",
    marginRight: "auto",
  },
})

export default Settings;
