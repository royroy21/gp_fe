import {Pressable, StyleSheet, View} from "react-native";
import {Chip, Surface, Text} from "@react-native-material/core";
import dateFormat from "dateformat";

function ShowGig({ gig, theme, navigation }) {
  function getDescription(gig) {
    if (gig.description.length > 100) {
      return `${gig.description.substring(0, 100)}...`
    } else {
      return gig.description
    }
  }

  return (
    <Surface elevation={2} category="medium" style={{padding: 5, margin: 5}}>
      <Pressable
        onPress={() => {
          navigation.navigate("GigDetail", {id: gig.id});
        }}
      >
        <Text style={{color: theme.palette.primary.main}}>
          {`${gig.title}`}
        </Text>
        {gig.description ? <Text style={styles.description}>{getDescription(gig)}</Text> : null}
        <Text style={styles.location}>
          {`${gig.location} (${gig.country.country})`}
        </Text>
        <View style={{flexDirection: "row", flexWrap: "wrap"}}>
          <Chip
            key={"date"}
            label={dateFormat(gig.start_date, "fullDate")}
            style={styles.chip}
          />
          {gig.has_spare_ticket ? (
            <Chip
              key={"has_spare_ticket"}
              label={"Spare ticket"}
              style={styles.chip}
            />
          ) : null}
          {gig.genres.map((genre, key) => (
            <Chip
              key={key}
              label={genre.genre}
              style={styles.chip}
            />
          ))}
        </View>
      </Pressable>
    </Surface>
  )
}


const styles = StyleSheet.create({
  chip: {
    margin: 2,
  },
  description: {
    fontSize: 14,
  },
  location: {
    marginTop: 5,
    fontSize: 14,
  },
});

export default ShowGig;
