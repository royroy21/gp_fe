import {Component} from "react";
import {StyleSheet, View} from "react-native";
import {Text} from "@react-native-material/core";

function LocalUserMessage({message, theme}) {
  return (
    <View
      style={{
        ...styles.outerContainer,
        alignSelf: "flex-end",
      }}
    >
      <Text
        style={{
          ...styles.innerContainer,
          backgroundColor: theme.palette.primary.main,
          alignSelf: "flex-end",
          borderBottomRightRadius: 0,
        }}
      >
        {message.message}
      </Text>
    </View>
  )
}

function RemoteUserMessage({message, theme}) {
  return (
    <View style={styles.outerContainer}>
      <Text
        style={{
          ...styles.innerContainer,
          backgroundColor: "grey",
          borderBottomLeftRadius: 0,
        }}
      >
        <Text style={{color: theme.palette.secondary.main}}>
          {message.user.username + "\n"}
        </Text>
        {message.message}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  outerContainer: {
    alignItems: "baseline",
    width: "60%",
    margin: 10,
  },
  innerContainer: {
    borderRadius: 15,
    padding: 10,
  },
});

class MessageDetail extends Component {
  constructor(props) {
    super(props);
    this.isLocalUser = this.props.isLocalUser;
    this.theme = this.props.theme;
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
     this.isLocalUser ? (
       <LocalUserMessage message={this.props.message} theme={this.theme}/>
     ) : (
       <RemoteUserMessage message={this.props.message} theme={this.theme}/>
     )
    )
  }
}

export default MessageDetail;
