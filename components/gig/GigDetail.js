import {Dimensions, ScrollView, StyleSheet, Text, View} from "react-native";
import {useContext, useEffect} from "react";
import LoadingModal from "../loading/LoadingModal";
import {Button, ListItem, useTheme} from "@react-native-material/core";
import DisplayGenres from "./DisplayGenres";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import dateFormat from "dateformat";
import useGigStore from "../../store/gig";
import Errors from "../forms/Errors";
import useUserStore from "../../store/user";

function Detail({ gig, user, navigation, theme, windowHeight }) {
  const isGigOwner = user && user.id === gig.user.id;
  return (
    <View style={detailStyles.container}>
      <View style={{height: Math.round(windowHeight * 0.75), ...detailStyles.dataContainer}}>
        <ScrollView>
          <ListItem
            title={
              <Text style={{color: theme.palette.primary.main, ...detailStyles.title}}>
                {gig.title}
              </Text>
            }
          />
          {gig.description ? <Text style={detailStyles.description}>{gig.description}</Text> : null}
          <DisplayGenres genres={gig.genres} containerStyle={{marginBottom: 5}} />
          <ListItem
            title={<Text>{`location: ${gig.location}`}</Text>}
            trailing={<Icon name="warehouse" size={25}/>}
          />
          <ListItem
            title={<Text>{`country: ${gig.country.country} (${gig.country.code})`}</Text>}
            trailing={<Icon name="island" size={25}/>}
          />
          {gig.has_spare_ticket ? (
            <ListItem
              title={<Text>{"Has spare ticket"}</Text>}
              trailing={gig.has_spare_ticket ? <Icon name="thumb-up-outline" size={25}/> : null}
            />
          ) : null}
          <ListItem
            title={<Text>{`start date: ${dateFormat(gig.start_date, "fullDate")}`}</Text>}
            trailing={<Icon name="calendar" size={25}/>}
          />
          <ListItem
            title={<Text>{`posted by: ${gig.user.username}`}</Text>}
            trailing={<Icon name="account" size={25}/>}
          />
        </ScrollView>
      </View>
      <View style={detailStyles.buttonsContainer}>
        {isGigOwner ? (
          <Button
            title={"EDIT"}
            onPress={() => navigation.navigate("EditGig", {gig: gig, windowHeight: windowHeight})}
            style={detailStyles.actionButton}
          />
        ) : (
          <Button
            title={"RESPOND"}
            onPress={() => console.log("RESPOND TO GIG BUTTON ACTIVATED")}
            style={detailStyles.actionButton}
          />
        )}
      </View>
    </View>
  )
}

const detailStyles = StyleSheet.create({
  container: {
    height: "100%",
  },
  dataContainer: {
    margin: 15,
  },
  editButton: {
    width: 100,
    marginTop: 15,
    marginRight: 15,
    alignSelf: "flex-end",
  },
  title: {
    fontSize: 16,
  },
  description: {
    margin: 10,
  },
  buttonsContainer: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    bottom: 15,
  },
  actionButton: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
})

function GigDetail({route, navigation}) {
  const { id } = route.params;
  const { object: user } = useUserStore();
  const theme = useTheme();
  const { object, loading, error, get } = useGigStore();
  const windowHeight = Dimensions.get("window").height;
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
          windowHeight={windowHeight}
        />
      ) : null}
      {(parsedError.detail) && <Errors errorMessages={parsedError.detail} />}
      {(parsedError.unExpectedError) && <Errors errorMessages={parsedError.unExpectedError} />}
    </>
  )
}

export default GigDetail;
