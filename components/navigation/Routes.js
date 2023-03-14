import TopNavigation from "./Top";
import DefaultScreen from "../home/DefaultScreen";
import {Text, View} from "react-native";
import GigDetail from "../gig/GigDetail";
import EditGig from "../gig/EditGig";
import AddGig from "../gig/AddGig";

function PlaceHolderMusic() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{"meow!! meow!! Music!"}</Text>
    </View>
  )
}

function PlaceHolderMessage() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{"meow!! meow!! Message"}</Text>
    </View>
  )
}

function Routes({setCurrentRoute}) {
  const initialRouteName = "DefaultScreen";
  const screenOptions = [
    {
      key: initialRouteName,
      name: initialRouteName,
      component: DefaultScreen,
    },
    {
      key: "GigDetail",
      name: "GigDetail",
      component: GigDetail,
    },
    {
      key: "AddGig",
      name: "AddGig",
      title: "Add Gig",
      component: AddGig,
    },
    {
      key: "EditGig",
      name: "EditGig",
      title: "Edit Gig",
      component: EditGig,
    },
    {
      key: "MusicScreen",
      name: "MusicScreen",
      component: PlaceHolderMusic,
    },
    {
      key: "MessageScreen",
      name: "MessageScreen",
      component: PlaceHolderMessage,
    },
  ]
  return (
    <TopNavigation
      screenOptions={screenOptions}
      initialRouteName={initialRouteName}
      setCurrentRoute={setCurrentRoute}
    />
  )
}

export default Routes;
