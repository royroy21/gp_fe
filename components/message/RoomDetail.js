import {Component} from "react";
import {Surface, Text} from "@react-native-material/core";
import {Pressable, StyleSheet, View} from "react-native";
import dateFormat from "dateformat";
import Image from "../Image/Image";

class RoomDetail extends Component {
  constructor(props) {
      super(props);
  }

  formatLastMessage(lastMessage) {
    if (lastMessage.length > 25) {
      return `${lastMessage.substring(0, 25)}...`
    } else {
      return lastMessage
    }
  }

  render() {
    const { room, windowWidth, theme, navigation, unReadMessagesCount } = this.props;
    const navigateToRoom = () => {
      navigation.navigate("Room", {room: room});
    }
    return (
      <Surface elevation={2} category="medium" style={styles.surface}>
        <Pressable onPress={navigateToRoom}>
          <View style={styles.container}>
            <Image
              imageUri={room.image}
              thumbnailUri={room.thumbnail}
              smallerThumbnail={true}
              withModalViewOnPress={false}
              containerStyle={styles.image}
              thumbnailStyle={styles.thumbnailStyle}
            />
            <View style={{
              width: windowWidth / 2,
              ...styles.message,
            }}
            >
              <Text style={{color: theme.palette.primary.main}}>
                {room.title}
              </Text>
              <Text>
                {this.formatLastMessage(room.last_message)}
              </Text>
            </View>
            <View style={styles.metaData}>
              {unReadMessagesCount ? (
                <View style={{...styles.unreadMessages, borderRadius: 25}}>
                  <Text style={{color: theme.palette.secondary.main}}>
                    {`${unReadMessagesCount} unread`}
                  </Text>
                </View>
              ) : null}
              <Text style={styles.timestamp}>
                {dateFormat(room.timestamp, "mediumDate")}
              </Text>
            </View>
          </View>
        </Pressable>
      </Surface>
    )
  }
}

const styles = StyleSheet.create({
  surface: {
    paddingTop: 5,
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 8,
    margin: 5,
  },
  container: {
    flexDirection: "row",
  },
  image: {
    margin: 5,
  },
  thumbnailStyle: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  message: {
    alignSelf: "flex-start",
    marginLeft: 5,
  },
  metaData: {
    alignSelf: "flex-end",
    flexDirection: "column",
    marginLeft: "auto",
  },
  timestamp: {
    color: "grey",
    fontSize: 13,
  },
  unreadMessages: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RoomDetail;
