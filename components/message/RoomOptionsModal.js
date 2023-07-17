import React from 'react';
import {StyleSheet, Text} from "react-native";
import {IconButton, ListItem} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import {useNavigation} from "@react-navigation/native";
import CenteredModalWithOneButton from "../centeredModal/CenteredModalWithOneButton";

const RoomOptionsModal = ({room, showOptions, setOptions, theme}) => {
  const navigation = useNavigation();
  return (
    <CenteredModalWithOneButton showModal={showOptions} setModal={setOptions}>
      {room.gig ? (
        <>
          <Text style={{...styles.title, color: theme.palette.primary.main}}>
            {"In response to gig: " + room.gig.title}
          </Text>
          <ListItem
            title={<Text>{"Go to Gig"}</Text>}
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
    </CenteredModalWithOneButton>
  );
};

const styles = StyleSheet.create({
  title: {
    marginLeft: 15,
  },
})

export default RoomOptionsModal;
