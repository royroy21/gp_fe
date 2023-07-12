import {StyleSheet} from "react-native";
import {ListItem, Text, useTheme} from "@react-native-material/core";
import DisplayGenres from "./DisplayGenres";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import dateFormat from "dateformat";
import useUserStore from "../../store/user";
import CustomScrollViewWithTwoButtons from "../views/CustomScrollViewWithTwoButtons";
import Errors from "../forms/Errors";
import LoadingModal from "../loading/LoadingModal";
import React, {useState} from "react";
import newMessage from "../message/newMessage";
import useJWTStore from "../../store/jwt";

function GigDetail({route, navigation}) {
  const { gig } = route.params;
  const { object: user } = useUserStore();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const {object: jwt} = useJWTStore();
  if (!jwt) {
    navigation.navigate("DefaultScreen");
  }
  const accessToken = JSON.parse(jwt).access;

  const navigateToOwner = () => {
    navigation.navigate("OtherUser", {user: gig.user});
  }
  const edit = () => {
    navigation.navigate("EditGig", {gig: gig});
  }
  const respond = () => {
    const newMessageArguments = {
      navigation: navigation,
      parameters: "?type=gig&gig_id=" + gig.id,
      accessToken: accessToken,
      setLoading: setLoading,
      setError: setError,
    }
    newMessage(newMessageArguments);
  }
  const isGigOwner = user && user.id === gig.user.id;

  const parsedError = error || {};
  return (
    <>
      {(parsedError.detail) && <Errors errorMessages={parsedError.detail} />}
      <LoadingModal isLoading={loading} />
      <CustomScrollViewWithTwoButtons
        actionButtonTitle={isGigOwner ? "edit" : "respond"}
        actionButtonOnPress={isGigOwner ? edit : respond}
        backButtonTitle={"go back"}
        backButtonOnPress={navigation.goBack}
      >
        <ListItem
          title={
            <Text style={{color: theme.palette.primary.main}}>
              {gig.title}
            </Text>
          }
        />
        {gig.description ? <Text style={styles.description}>{gig.description}</Text> : null}
        <DisplayGenres genres={gig.genres} containerStyle={{marginBottom: 5}} />
        <ListItem
          title={<Text>{gig.location}</Text>}
          trailing={<Icon name="warehouse" size={25} color={theme.palette.secondary.main}/>}
        />
        <ListItem
          title={<Text>{`${gig.country.country} (${gig.country.code})`}</Text>}
          trailing={<Icon name="island" size={25} color={theme.palette.secondary.main}/>}
        />
        {gig.has_spare_ticket ? (
          <ListItem
            title={<Text>{"Has spare ticket"}</Text>}
            trailing={gig.has_spare_ticket ? <Icon name="thumb-up-outline" size={25} color={theme.palette.secondary.main}/> : null}
          />
        ) : null}
        <ListItem
          title={<Text>{`${dateFormat(gig.start_date, "fullDate")}`}</Text>}
          trailing={<Icon name="calendar" size={25} color={theme.palette.secondary.main}/>}
        />
        <ListItem
          title={<Text>{`posted by: ${gig.user.username}`}</Text>}
          onPress={navigateToOwner}
          trailing={
            <Icon
              name={"account"}
              size={25}
              color={theme.palette.secondary.main}
              onPress={navigateToOwner}
            />
          }
        />
      </CustomScrollViewWithTwoButtons>
    </>
  )
}

const styles = StyleSheet.create({
  description: {
    margin: 10,
    fontSize: 14,
  },
})

export default GigDetail;
