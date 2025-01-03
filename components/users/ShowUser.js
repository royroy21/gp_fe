import {Pressable, StyleSheet, View} from "react-native";
import {Chip, Surface, Text} from "@react-native-material/core";
import {Component} from "react";
import Image from "../Image/Image";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

class ShowUser extends Component {
  constructor(props) {
      super(props);
  }

  shouldComponentUpdate() {
     return false;
  }

  bioLineLength = 60;

  getBio(user) {
    if (user.bio.length > this.bioLineLength) {
      return `${user.bio.substring(0, this.bioLineLength)}...`
    } else {
      return user.bio
    }
  }

  render() {
    const { user, storeOtherUser, windowWidth, theme, navigation } = this.props;
    const navigateToUser = () => {
      storeOtherUser(user);
      navigation.push("OtherUser", {id: user.id});
    }
    return (
      <Surface elevation={2} category="medium" style={{padding: 5, margin: 5}}>
        <Pressable onPress={navigateToUser}>
          <View style={styles.container}>
            <Image
              imageUri={user.image}
              smallerThumbnail={true}
              thumbnailUri={user.thumbnail}
              withModalViewOnPress={false}
              containerStyle={styles.image}
            />
            <View style={{
              width: windowWidth / 1.6,
              ...styles.dataContainer}
            }>
              <Text style={{color: theme.palette.primary.main}}>
                {user.username}
              </Text>
              {user.bio ? (
                <Text style={styles.bio}>{this.getBio(user)}</Text>
              ) : null}
            </View>
          </View>
          <View style={{flexDirection: "row", flexWrap: "wrap"}}>
            {user.is_favorite ? (
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
            {user.is_band ? (
              <Chip
                key={"is_band"}
                label={"Band"}
                style={styles.chip}
              />
            ) : null}
            {user.is_looking_for_musicians ? (
              <Chip
                key={"is_looking_for_musicians"}
                label={"Looking for musicians"}
                style={styles.chip}
              />
            ) : null}
            {user.is_musician ? (
              <Chip
                key={"is_musician"}
                label={"Musician"}
                style={styles.chip}
              />
            ) : null}
            {user.is_looking_for_band ? (
              <Chip
                key={"is_looking_for_band"}
                label={"Looking for band"}
                style={styles.chip}
              />
            ) : null}
            {user.country ? (
              <Chip
                key={"country"}
                label={user.country.country}
                style={styles.chip}
              />
            ) : null}
            {user.location ? (
              <Chip
                key={"location"}
                label={user.location}
                style={styles.chip}
              />
            ) : null}
            {user.distance_from_user ? (
              <Chip
                key={"distance_from_user"}
                label={`last seen ${user.distance_from_user} from you`}
                style={styles.chip}
              />
            ) : null}
            {user.number_of_active_gigs ? (
              <Chip
                key={"number_of_active_gigs"}
                label={`${user.number_of_active_gigs} active ${user.number_of_active_gigs === 1 ? "gig" : "gigs"}`}
                style={styles.chip}
              />
            ) : null}
            {user.genres.map((genre, key) => (
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
  bio: {
    fontSize: 14,
  },
  country: {
    marginTop: 5,
    fontSize: 14,
  },
});

export default ShowUser;
