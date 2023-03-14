import {StyleSheet, View} from "react-native";
import {Chip, IconButton} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

function DisplayGenres({genres, removeGenre=null, containerStyle={}}) {
  return (
    <View style={{...genresStyles.container, ...containerStyle}}>
      {genres.map((genre, key) => (
        <Chip
          key={key}
          label={genre.genre}
          style={genresStyles.chip}
          trailing={
            removeGenre ? (
              <IconButton
                onPress={() => removeGenre(genres, genre.id)}
                icon={
                  <Icon
                    name="trash-can-outline"
                    size={25}
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

const genresStyles = StyleSheet.create({
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
