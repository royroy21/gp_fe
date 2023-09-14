import {Button, IconButton, ListItem, TextInput} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import {Dimensions, ScrollView, StyleSheet, Text, View} from "react-native";
import React, {useCallback, useState} from "react";
import {useFocusEffect} from "@react-navigation/native";
import useUsersStore from "../../store/users";
import {BACKEND_ENDPOINTS} from "../../settings";
import Image from "../Image/Image";
import CenteredModalWithTwoButtons from "../centeredModal/CenteredModalWithTwoButtons";
import useRoomStore from "../../store/room";
import LoadingModal from "../loading/LoadingModal";

function ShowUser({user, onSelect, isSelected, theme}) {
  const onPress = () => {onSelect(user)}
  return (
    <View style={showUserStyles.container}>
      <ListItem
        title={user.username}
        onPress={onPress}
        leadingMode={"icon"}
        leading={
          <Image
            imageUri={user.image}
            smallerThumbnail={true}
            thumbnailUri={user.thumbnail}
            containerStyle={showUserStyles.image}
            thumbnailStyle={showUserStyles.thumbnailStyle}
          />
        }
        trailing={isSelected ? (
          <Icon
            name={"thumb-up-outline"}
            size={25}
            color={theme.palette.secondary.main}
          />
        ) : null}

      />
    </View>
  )
}

const showUserStyles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 10,
  },
  image: {
    marginRight: 10,
  },
  thumbnailStyle: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
})

function AddUsersModal(props) {
  const {
    showModal,
    setModal,
    room,
    users,
    initialSearchUsers,
    searchUsers,
    navigation,
    theme,
  } = props;

  const windowHeight = Dimensions.get("window").height;
  const [selectedUsers, setSelectedUsers] = useState(room.members);
  const onUserSelect = (selectedUser) => {
    if (selectedUsers.map(user => user.id).includes(selectedUser.id)) {
      // Remove user
      setSelectedUsers(prevState => {
        return prevState.filter(user => user.id !== selectedUser.id);
      });
    } else {
      // Add user
      setSelectedUsers(prevState => {
        return [selectedUser, ...prevState]
      });
    }
  }

  useFocusEffect(
    useCallback(() => {
      // Populate users array.
      initialSearchUsers()
    }, [])
  );

  const {patch, loading} = useRoomStore();

  const onSuccess = (json) => {
    navigation.navigate("Room", {room: json, openOptions: true});
  }

  const addUsersAction = async () => {
    await patch(room.id, {members: selectedUsers}, onSuccess);
    setModal(!showModal)
  };

  return (
    <CenteredModalWithTwoButtons
      showModal={showModal}
      setModal={setModal}
      actionButton={
        <Button
          style={modalStyles.button}
          title={"update"}
          onPress={addUsersAction}
        />
      }
    >
      <LoadingModal isLoading={loading} />
      <TextInput
        variant={"outlined"}
        trailing={
          <IconButton
            icon={
              <Icon
                name={"magnify"}
                size={25}
                color={theme.palette.secondary.main}
              />
            }
          />
        }
        onChangeText={(text) => {
          searchUsers(text + "*")
        }}
      />
      {users ? (
        <ScrollView
          keyboardShouldPersistTaps={"always"}
          style={{height: windowHeight / 4}}
        >
          {users.results.map(item => (
            <ShowUser
              key={item.id}
              user={item}
              onSelect={onUserSelect}
              isSelected={selectedUsers.map(user => user.id).includes(item.id)}
              theme={theme}
            />
          ))}
        </ScrollView>
      ) : null}
    </CenteredModalWithTwoButtons>
  )
}

const modalStyles = StyleSheet.create({
  button: {
    width: 100,
  },
})

function EditRoomMembership({ room, navigation, theme }) {
  const [showModal, setModal] = useState(false);
  const {
    object: users,
    get: get,
  } = useUsersStore();
  const initialSearchUsers = async () => {
    await get(
      BACKEND_ENDPOINTS.searchUsers + "?search=*:*&is_favorite=true",
      [],
      true
    );
  }
  const searchUsers = async (query) => {
    await get(
      BACKEND_ENDPOINTS.searchUsers + "?search_using_wildcard=" + query + "&is_favorite=true",
      [],
      true
    );
  }
  return (
    <>
      <ListItem
        title={<Text>{"Edit Room membership?"}</Text>}
        onPress={() => {
          setModal(true);
        }}
        trailing={
          <IconButton
            onPress={() => {
              setModal(true);
            }}
            icon={
              <Icon
                color={theme.palette.secondary.main}
                name={"account-multiple-plus"}
                size={25}
              />
            }
          />
        }
      />
      <AddUsersModal
        showModal={showModal}
        setModal={setModal}
        room={room}
        users={users}
        initialSearchUsers={initialSearchUsers}
        searchUsers={searchUsers}
        navigation={navigation}
        theme={theme}
      />
    </>
  )
}

export default EditRoomMembership;
