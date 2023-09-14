import React from 'react';
import {StyleSheet, Text} from "react-native";
import {IconButton, ListItem} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import {useNavigation} from "@react-navigation/native";
import CenteredModalWithOneButton from "../centeredModal/CenteredModalWithOneButton";
import EditRoomMembership from "./EditRoomMembership";

const RoomOptionsModal = ({room, user, showOptions, setOptions, theme}) => {
  const navigation = useNavigation();
  const isRoomOwner = user.id === room.user.id;
  return (
    <CenteredModalWithOneButton showModal={showOptions} setModal={setOptions}>
      {room.gig ? (
        <>
          <Text style={{...styles.title, color: theme.palette.primary.main}}>
            {"In response to gig: " + room.gig.title}
          </Text>
          <ListItem
            title={<Text>{"Go to Gig"}</Text>}
            onPress={() => {
              navigation.navigate("GigDetail", {gig: room.gig});
              setOptions(!showOptions);
            }}
            trailing={
              <IconButton
                onPress={() => {
                  navigation.navigate("GigDetail", {gig: room.gig});
                  setOptions(!showOptions);
                }}
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
          onPress={() => {
            navigation.navigate("OtherUser", {user: member});
            setOptions(!showOptions);
          }}
          trailing={
            <IconButton
              onPress={() => {
                navigation.navigate("OtherUser", {user: member});
                setOptions(!showOptions);
              }}
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
    </CenteredModalWithOneButton>
  );
};

const styles = StyleSheet.create({
  title: {
    marginLeft: 15,
  },
})

export default RoomOptionsModal;
