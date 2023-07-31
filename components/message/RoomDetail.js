import {Component} from "react";
import {Surface, Text} from "@react-native-material/core";
import {Pressable, StyleSheet, View} from "react-native";
import dateFormat from "dateformat";

class RoomDetail extends Component {
  constructor(props) {
      super(props);
  }

  formatLastMessage(lastMessage) {
    if (lastMessage.length > 100) {
      return `${lastMessage.substring(0, 100)}...`
    } else {
      return lastMessage
    }
  }

  render() {
    const { room, theme, navigation, unReadMessagesCount } = this.props;
    const navigateToRoom = () => {
      navigation.navigate("Room", {room: room});
    }
    return (
      <Surface elevation={2} category="medium" style={styles.surface}>
        <Pressable onPress={navigateToRoom}>
          <View style={styles.container}>
            <View style={styles.message}>
              <Text style={{color: theme.palette.primary.main}}>
                {`${room.title} (${room.id}) `}
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
  message: {
    alignSelf: "flex-start",
    width: "78%",
  },
  metaData: {
    alignSelf: "flex-end",
    flexDirection: "column",
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
