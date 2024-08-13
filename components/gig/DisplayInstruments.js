import {StyleSheet, View} from "react-native";
import {Chip, IconButton, useTheme} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

function DisplayInstruments({instruments, removeInstrument=null, containerStyle={}}) {
  const theme = useTheme();
  return (
    instruments.length ? (
      <View style={{...styles.container, ...containerStyle}}>
        {instruments.map((instrument, key) => (
          <Chip
            key={key}
            label={instrument.instrument}
            style={styles.chip}
            labelStyle={{
              color: theme.palette.primary.main,
            }}
            trailing={
              removeInstrument ? (
                <IconButton
                  onPress={() => removeInstrument(instruments, instrument.id)}
                  icon={
                    <Icon
                      name={"trash-can-outline"}
                      size={25}
                      color={theme.palette.secondary.main}
                    />
                  }
                />
              ) : null
            }
          />
        ))}
      </View>
    ) : null
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
})

export default DisplayInstruments;
