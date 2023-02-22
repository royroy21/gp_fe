import {Text, View} from "react-native";
import {Chip, Surface, useTheme} from "@react-native-material/core";
import dateFormat from "dateformat";

function ShowGig({gig}) {
  const theme = useTheme()

  function getDescription(gig) {
    if (gig.description.length > 100) {
      return `${gig.description.substring(0, 100)}...`
    } else {
      return gig.description
    }
  }

  return (
    <Surface elevation={2} category="medium" style={{padding: 5, margin: 5}}>
      <Text style={{fontWeight: "bold", color: theme.palette.primary.main}}>
        {`${gig.title} ${gig.id}`}
      </Text>
      {gig.description ? <Text>{getDescription(gig)}</Text> : null}
      <Text>
        {`${gig.venue} ${gig.location} (${gig.country.country})`}
      </Text>
      <View style={{flexDirection: "row", flexWrap: "wrap"}}>
        <Chip
          key={"date"}
          label={dateFormat(gig.start_date, "fullDate")}
          style={{marginTop: 5, marginRight: 5}}
        />
        {gig.has_spare_ticket ? (
          <Chip
            key={"has_spare_ticket"}
            label={"Spare ticket"}
            style={{marginTop: 5, marginRight: 5}}
          />
        ) : null}
        {gig.genres.map((genre, key) => (
          <Chip
            key={key}
            label={genre.genre}
            style={{marginTop: 5, marginRight: 5}}
          />
        ))}
      </View>
    </Surface>
  )
}

export default ShowGig;
