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

  shouldComponentUpdate() {
     return false;
  }

  render() {
    const { room, theme, navigation } = this.props;
    const navigateToRoom = () => {
      navigation.navigate("Room", {room: room});
    }
    return (
      <Surface elevation={2} category="medium" style={{padding: 5, margin: 5}}>
        <Pressable onPress={navigateToRoom}>
          <View style={styles.container}>
            <View style={styles.data}>
              <Text style={{color: theme.palette.primary.main}}>
                {`${room.title} (${room.id}) `}
              </Text>
              <Text>
                {this.formatLastMessage(room.last_message)}
              </Text>
            </View>
            <Text style={styles.timestamp}>
              {dateFormat(room.timestamp, "mediumDate")}
            </Text>
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
  data: {
    alignSelf: "flex-start",
    width: "78%",
  },
  timestamp: {
    color: "grey",
    fontSize: 13,
    alignSelf: "flex-end",
  },
});

export default RoomDetail;
