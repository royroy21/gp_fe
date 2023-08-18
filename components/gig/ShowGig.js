import {Pressable, StyleSheet, View} from "react-native";
import {Chip, Surface, Text} from "@react-native-material/core";
import dateFormat from "dateformat";
import {Component} from "react";
import Image from "../Image/Image";

class ShowGig extends Component {
  constructor(props) {
      super(props);
  }

  getDescription(gig) {
    if (gig.description.length > 100) {
      return `${gig.description.substring(0, 100)}...`
    } else {
      return gig.description
    }
  }

  shouldComponentUpdate() {
     return false;
  }

  render() {
    const { gig, windowWidth, theme, navigation } = this.props;
    const navigateToGigDetail = () => {
      navigation.navigate("GigDetail", {gig: gig});
    }
    return (
      <Surface elevation={2} category="medium" style={{padding: 5, margin: 5}}>
        <Pressable onPress={navigateToGigDetail}>
          <View style={styles.container}>
            <Image
              imageUri={gig.image}
              thumbnailUri={gig.thumbnail}
              withModalViewOnPress={false}
              containerStyle={styles.image}
            />
            <View style={{
              width: windowWidth / 1.6,
              ...styles.dataContainer}
            }>
              <Text style={{color: theme.palette.primary.main}}>
                {`${gig.title}`}
              </Text>
              {gig.description ? (
                <Text style={styles.description}>{this.getDescription(gig)}</Text>
              ) : null}
              <Text style={styles.location}>
                {`${gig.location} (${gig.country.country})`}
              </Text>
            </View>
          </View>
          <View style={{flexDirection: "row", flexWrap: "wrap"}}>
            <Chip
              key={"user"}
              label={gig.user.username}
              style={styles.chip}
            />
            {gig.user.distance_from_user ? (
              <Chip
                key={"distance_from_user"}
                label={`last seen ${gig.user.distance_from_user} from you`}
                style={styles.chip}
              />
            ) : null}
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
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  dataContainer: {
    alignSelf: "flex-start",
    paddingLeft: 5,
    marginBottom: 5,
  },
  image: {
    margin: 5,
  },
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
