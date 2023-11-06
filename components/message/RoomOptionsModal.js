import React from 'react';
import {StyleSheet, ScrollView, Text} from "react-native";
import {IconButton, ListItem} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import {useNavigation} from "@react-navigation/native";
import CenteredModalWithOneButton from "../centeredModal/CenteredModalWithOneButton";
import EditRoomMembership from "./EditRoomMembership";
import useGigStore from "../../store/gig";
import useOtherUserStore from "../../store/otherUser";

const RoomOptionsModal = ({room, user, showOptions, setOptions, theme}) => {
  const navigation = useNavigation();

  const getIsRoomOwner = () => {
    if (!room || ! user) {
      return false
    }
    return user.id === room.user.id
  }
  const isRoomOwner = getIsRoomOwner();

  const { store: storeOtherUser } = useOtherUserStore();

  const {
    store: storeGig,
  } = useGigStore();

  const onListItemPress = (member) => {
    if (user.id === member.id) {
      navigation.navigate("ProfilePage")
    } else {
      storeOtherUser(member);
      navigation.push("OtherUser", {id: member.id});
    }
    setOptions(!showOptions);
  }

  const navigateToGig = (gig) => {
    storeGig(gig);
    navigation.push("GigDetail", {id: room.gig.id});
    setOptions(!showOptions);
  }

  if (!room) {
    return null
  }

  return (
    <CenteredModalWithOneButton showModal={showOptions} setModal={setOptions}>
      <ScrollView style={styles.container}>
      {room.gig ? (
        <>
          <Text style={{...styles.title, color: theme.palette.primary.main}}>
            {"In response to gig: " + room.gig.title}
          </Text>
          <ListItem
            title={<Text>{"Go to Gig"}</Text>}
            onPress={() => navigateToGig(room.gig)}
            trailing={
              <IconButton
                onPress={() => navigateToGig(room.gig)}
                icon={
                  <Icon
                    color={theme.palette.secondary.main}
                    name={"music"}
                    size={25}
                  />
                }
              />
            }
          />
        </>
      ) : null}
      <Text style={{...styles.title, color: theme.palette.primary.main}}>
        {"members"}
      </Text>
      {room.members.length && room.members.map((member, index) => (
        <ListItem
          key={index}
          title={<Text>{member.username}</Text>}
          secondaryText={member.id === room.user.id ? (<Text>{"owner"}</Text>) : null}
          onPress={() => onListItemPress(member)}
          trailing={
            <IconButton
              onPress={() => onListItemPress(member)}
              icon={
                <Icon
                  color={theme.palette.secondary.main}
                  name={"account"}
                  size={25}
                />
              }
            />
          }
        />
      ))}
      {isRoomOwner ? (
        <EditRoomMembership
          room={room}
          navigation={navigation}
          theme={theme}
        />
      ) : null}
      </ScrollView>
    </CenteredModalWithOneButton>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "50%",
  },
  title: {
    marginLeft: 15,
  },
})

export default RoomOptionsModal;
