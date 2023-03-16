import {StyleSheet, View} from "react-native";
import {Chip, IconButton, useTheme} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

function DisplayGenres({genres, removeGenre=null, containerStyle={}}) {
  const theme = useTheme();
  return (
    <View style={{...styles.container, ...containerStyle}}>
      {genres.map((genre, key) => (
        <Chip
          key={key}
          label={genre.genre}
          style={styles.chip}
          labelStyle={{
            color: theme.palette.primary.main,
          }}
          trailing={
            removeGenre ? (
              <IconButton
                onPress={() => removeGenre(genres, genre.id)}
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

export default DisplayGenres;
