import TopNavigation from "./Top";
import DefaultScreen from "../home/DefaultScreen";
import {View} from "react-native";
import GigDetail from "../gig/GigDetail";
import EditGig from "../gig/EditGig";
import AddGig from "../gig/AddGig";
import {Text} from "@react-native-material/core";
import Settings from "../settings";

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

function Routes({user, setCurrentRoute}) {
  const initialRouteName = "DefaultScreen";
  const screens = [
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
    {
      key: "Settings",
      name: "Settings",
      component: Settings,
    },
  ]
  return (
    <TopNavigation
      user={user}
      screens={screens}
      initialRouteName={initialRouteName}
      setCurrentRoute={setCurrentRoute}
    />
  )
}

export default Routes;
