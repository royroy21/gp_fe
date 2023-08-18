import {Pressable, StyleSheet, View} from "react-native";
import {Chip, Surface, Text} from "@react-native-material/core";
import {Component} from "react";
import Image from "../Image/Image";

class ShowUser extends Component {
  constructor(props) {
      super(props);
  }

  getBio(user) {
    if (user.bio.length > 100) {
      return `${user.bio.substring(0, 100)}...`
    } else {
      return user.bio
    }
  }

  shouldComponentUpdate() {
     return false;
  }

  render() {
    const { user, windowWidth, theme, navigation } = this.props;
    const navigateToUser = () => {
      navigation.navigate("OtherUser", {user: user});
    }
    return (
      <Surface elevation={2} category="medium" style={{padding: 5, margin: 5}}>
        <Pressable onPress={navigateToUser}>
          <View style={styles.container}>
            <Image
              imageUri={user.image}
              thumbnailUri={user.thumbnail}
              withModalViewOnPress={false}
              containerStyle={styles.image}
            />
            <View style={{
              width: windowWidth / 1.6,
              ...styles.dataContainer}
            }>
              <Text style={{color: theme.palette.primary.main}}>
                {`${user.username}`}
              </Text>
              {user.bio ? <Text style={styles.bio}>{this.getBio(user)}</Text> : null}
              <Text style={styles.country}>
                {user.country ? user.country.country : "unknown"}
              </Text>
            </View>
          </View>
          <View style={{flexDirection: "row", flexWrap: "wrap"}}>
            {user.distance_from_user ? (
              <Chip
                key={"distance_from_user"}
                label={`last seen ${user.distance_from_user} from you`}
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
