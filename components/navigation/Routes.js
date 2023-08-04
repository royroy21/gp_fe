import TopNavigation from "./Top";
import DefaultScreen from "../home/DefaultScreen";
import {View} from "react-native";
import GigDetail from "../gig/GigDetail";
import EditGig from "../gig/EditGig";
import AddGig from "../gig/AddGig";
import {Text} from "@react-native-material/core";
import Settings from "../settings";
import OtherUser from "../otherUser";
import ProfilePage from "../profile/ProfilePage";
import EditProfile from "../profile/EditProfile";
import Room from "../message/Room";
import Rooms from "../message/Rooms";

function PlaceHolderMusic() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{"meow!! meow!! Music!"}</Text>
    </View>
  )
}

function Routes({user, setCurrentRoute, BottomNavigationProps, theme, isWeb}) {
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
      key: "Room",
      name: "Room",
      component: Room,
    },
    {
      key: "RoomsScreen",
      name: "RoomsScreen",
      component: Rooms,
    },
    {
      key: "OtherUser",
      name: "OtherUser",
      component: OtherUser,
    },
    {
      key: "ProfilePage",
      name: "ProfilePage",
      component: ProfilePage,
    },
    {
      key: "EditProfile",
      name: "EditProfile",
      component: EditProfile,
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
      BottomNavigationProps={BottomNavigationProps}
      theme={theme}
      isWeb={isWeb}
    />
  )
}

export default Routes;
