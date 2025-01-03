import {Pressable, StyleSheet, View} from "react-native";
import {Chip, Surface, Text} from "@react-native-material/core";
import dateFormat from "dateformat";
import {Component} from "react";
import Image from "../Image/Image";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

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
    const { gig, storeGig, user, windowWidth, theme, navigation } = this.props;
    const isGigOwner = user && user.id === gig.user.id;
    const navigateToGigDetail = () => {
      storeGig(gig);
      navigation.push("GigDetail", {id: gig.id});
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
                {gig.location}
              </Text>
            </View>
          </View>
          <View style={{flexDirection: "row", flexWrap: "wrap"}}>
            {gig.is_favorite ? (
              <Chip
                key={"is_favorite"}
                label={
                  <Icon
                    name={"star"}
                    size={20}
                    color={"orange"}
                  />
                }
                style={styles.chip}
              />
            ) : null}
            {isGigOwner && gig.replies ? (
              <Chip
                key={"replies"}
                label={
                  <Text style={styles.repliesText}>
                    {gig.replies === 1 ? "1 reply" : `${gig.replies} replies`}
                  </Text>
                }
                style={styles.chip}
              />
            ) : null}
            {!isGigOwner ? (
              <Chip
                key={"user"}
                label={gig.user.username}
                style={styles.chip}
              />
            ) : null}
            <Chip
              key={"country"}
              label={gig.country.country}
              style={styles.chip}
            />
            {gig.location ? (
              <Chip
                key={"location"}
                label={gig.location}
                style={styles.chip}
              />
            ) : null}
            {!isGigOwner && gig.user.distance_from_user ? (
              <Chip
                key={"distance_from_user"}
                label={`last seen ${gig.user.distance_from_user} from you`}
                style={styles.chip}
              />
            ) : null}
            {gig.is_past_gig ? (
              <Chip
                key={"is_past_gig"}
                label={
                  <Text style={styles.isPastGigText}>
                    {`${dateFormat(gig.start_date, "fullDate")} - date has passed`}
                  </Text>
                }
                style={styles.isPastGigChip}
              />
            ) : (
              <Chip
                key={"date"}
                label={dateFormat(gig.start_date, "fullDate")}
                style={styles.chip}
              />
            )}
            {gig.looking_for_gigpig ? (
              <Chip
                key={"looking_for_gigpig"}
                label={"Looking for a GigPig"}
                style={styles.chip}
              />
            ) : null}
            {gig.is_free_gig ? (
              <Chip
                key={"is_free_gig"}
                label={"Is free Gig"}
                style={styles.chip}
              />
            ) : null}
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
  repliesText: {
    color: "yellow",
    fontSize: 14,
  },
  chip: {
    margin: 2,
  },
  isPastGigText: {
    color: "red",
    fontSize: 14,
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
