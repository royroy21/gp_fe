import {StyleSheet} from "react-native";
import {useEffect} from "react";
import LoadingModal from "../loading/LoadingModal";
import {ListItem, Text, useTheme} from "@react-native-material/core";
import DisplayGenres from "./DisplayGenres";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import dateFormat from "dateformat";
import useGigStore from "../../store/gig";
import Errors from "../forms/Errors";
import useUserStore from "../../store/user";
import CustomScrollViewWithTwoButtons from "../views/CustomScrollViewWithTwoButtons";

function Detail({ gig, user, navigation, theme }) {
  const navigateToOwner = () => {
    navigation.navigate("OtherUser", {id: gig.user.id});
  }
  const edit = () => {
    navigation.navigate("EditGig", {gig: gig});
  }
  const respond = () => {
    console.log("RESPOND TO GIG BUTTON ACTIVATED");
  }
  const isGigOwner = user && user.id === gig.user.id;
  return (
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
        title={<Text>{`location: ${gig.location}`}</Text>}
        trailing={<Icon name="warehouse" size={25} color={theme.palette.secondary.main}/>}
      />
      <ListItem
        title={<Text>{`country: ${gig.country.country} (${gig.country.code})`}</Text>}
        trailing={<Icon name="island" size={25} color={theme.palette.secondary.main}/>}
      />
      {gig.has_spare_ticket ? (
        <ListItem
          title={<Text>{"Has spare ticket"}</Text>}
          trailing={gig.has_spare_ticket ? <Icon name="thumb-up-outline" size={25} color={theme.palette.secondary.main}/> : null}
        />
      ) : null}
      <ListItem
        title={<Text>{`start date: ${dateFormat(gig.start_date, "fullDate")}`}</Text>}
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
  )
}

const styles = StyleSheet.create({
  description: {
    margin: 10,
    fontSize: 14,
  },
})

function GigDetail({route, navigation}) {
  const { id } = route.params;
  const { object: user } = useUserStore();
  const theme = useTheme();
  const { object, loading, error, get } = useGigStore();
  useEffect(() => {get(id)}, [])
  const parsedError = error || {};
  return (
    <>
      <LoadingModal isLoading={loading} />
      {!loading && object ? (
        <Detail
          user={user}
          gig={object}
          navigation={navigation}
          theme={theme}
        />
      ) : null}
      {(parsedError.detail) && <Errors errorMessages={parsedError.detail} />}
      {(parsedError.unExpectedError) && <Errors errorMessages={parsedError.unExpectedError} />}
    </>
  )
}

export default GigDetail;
